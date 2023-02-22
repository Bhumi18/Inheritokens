from typing import final
import requests
from datetime import datetime
from datetime import date
import smtplib
import os
from dotenv import load_dotenv
import time
import schedule
from web3 import Web3
import json
from moralis import evm_api

load_dotenv()

# Contract setup
alchemy_url = "https://polygon-mumbai.g.alchemy.com/v2/ALbcNieoFrIRYYNDrcr4dAASXUCZbm-i"
web3 = Web3(Web3.HTTPProvider(alchemy_url))
inheritokens_factory = "0x3D79C81fa0EdE22A05Cd5D5AF089BCf214F39AcB"
multiple_nominee = "0x20D9BB5339F93cd29b425E57A228E88ddf06eFE4"
file = open("D:/Lampros Projects/Inheritokens/Inheritokens_schedular/Inheritokens.json")
abi = json.load(file)
contract = web3.eth.contract(address=inheritokens_factory, abi=abi)
file1 = open(
    "D:/Lampros Projects/Inheritokens/Inheritokens_schedular/MultipleNominee.json"
)
abi1 = json.load(file1)
contract1 = web3.eth.contract(address=multiple_nominee, abi=abi1)
chain_id = 80001
my_address = os.environ.get("ADDRESS")
private_key = os.environ.get("KEY")
moralis_api_key = os.environ.get("MORALIS_API_KEY")
nonce = web3.eth.get_transaction_count(my_address)
tokens20 = []
tokens721 = []


# Function to get transaction details from api, get contract details
def getTransactionDetails():
    # get list of all owner's address
    data = contract.functions.getOwners().call()
    print(data)
    # loop over the list
    for i in range(len(data)):
        # check owner is alive or not from contract
        isAlive = contract.functions.getOwnerAlive(data[i]).call()
        print(isAlive)
        if isAlive:
            # check for inactivity of an account using moralis api
            url = "https://deep-index.moralis.io/api/v2/" + data[i] + "?chain=mumbai"
            headers = {"accept": "application/json", "X-API-Key": moralis_api_key}
            response = requests.get(url, headers=headers)
            json_data = response.json()
            print(json_data["result"][0]["block_timestamp"])
            last_transaction = json_data["result"][0]["block_timestamp"]
            # last_transaction = "2023-02-19"
            trans_month = last_transaction[5:7]
            trans_year = last_transaction[:4]
            trans_date = last_transaction[8:10]
            last_trans_date = date(int(trans_year), int(trans_month), int(trans_date))
            today = date.today()
            difference = str(today - last_trans_date)
            no_days = difference.split(" ")[0]
            if no_days == "0:00:00":
                no_days = 0
            print(no_days)

            # get email of owner from contract
            owner_struct = contract.functions.getOwnerDetails(data[i]).call()
            print(owner_struct)
            owner_email = owner_struct[1]
            no_of_months = owner_struct[8]
            # print(owner_email)

            # get all nominees
            all_nominees = owner_struct[6]
            print(all_nominees)

            # get email of nominees
            # data2 = contract.functions.getNomineeDetails("0x2B30bC9F81f919B01a09d5A3De574B15eAF2C3BC").call()
            # print(data2)

            # get response date and response from contract
            response_date = contract.functions.getResponseDate(data[i]).call()
            isResponded = contract.functions.getResponse(data[i]).call()
            print(response_date)
            print(isResponded)
            if response_date == "":
                print("no res date")
                no_res_days = 0
            else:
                # checking for 1 month
                res_month = response_date[5:7]
                res_year = response_date[:4]
                res_date = response_date[8:]
                print((response_date))
                temp_date = date(int(res_year), int(res_month), int(res_date))
                today_date = date.today()
                # print(today)
                difference_date = str(today_date - temp_date)
                no_res_days = difference_date.split(" ")[0]
                # print(no_res_days)
                if no_res_days == "0:00:00":
                    no_res_days = 0
            print(no_res_days)

            no_days = 40
            no_res_days = 71

            if (
                int(no_days) > (no_of_months * 30)
                and int(no_res_days) < 30
                and isResponded == False
            ):
                if response_date == "":
                    print("call contract function")
                    # setDate(data[i])
                    print("called")
                # message = "Please tell me you are doing fine"
                # sendMail(message, email)
                print("Please tell me you are doing fine")
            elif (
                int(no_days) > ((no_of_months * 30))
                and int(no_res_days) > 30
                and isResponded == False
            ):
                (t20, t721) = getTokenAddresses(data[i])
                print("more than 1 month")
                print(t20)
                print(t721)
                nominee_email = []
                # for i in range(len(data2)):
                #     data3 = contract.functions.getNomineeDetails(data2[i]).call()
                #     nominee_email.append(data3[2])
                #     message = "Hi, Congratulations you are nominated for cryptos!"
                #     sendMail(message, data3[2])
                # setNotAlive(data[i])
                assigned_tokens = contract1.functions.getAllStructs(
                    data[i], Web3.to_checksum_address(t20[0]), 0
                ).call()
                print(assigned_tokens)
                for i in range(0, len(assigned_tokens)):
                    for j in range(0, len(assigned_tokens[i][1])):
                        if assigned_tokens[i][2][j] == True:
                            continue
                        else:
                            if no_res_days < ((assigned_tokens[i][3][j] * 30) + 30):
                                print("nominee number")
                                print(j+1)
                                break
                            else:
                                if assigned_tokens[i][2][j] == True:
                                    continue
                                else:
                                    print("set not available in contract")
                    print(assigned_tokens[i][1])
            elif int(no_days) < 180:
                print("Active Account!")
            else:
                print("responded!")
        else:
            print("not alive")


# Function to get all the token address
def getTokenAddresses(owner):
    # owner = "0xeB88DDaEdA2261298F1b740137B2ae35aA42A975"
    tokens20 = []
    tokens721 = []
    # get ERC20 token's token addresses
    params = {
        "address": owner,
        "chain": "mumbai",
    }
    result = evm_api.token.get_wallet_token_balances(
        api_key=moralis_api_key,
        params=params,
    )
    for i in range(0, len(result)):
        tokens20.append((result[i]["token_address"]))

    # get ERC721 token's token addresses and tokenId
    paramsNFT = {
        "address": owner,
        "chain": "mumbai",
        "format": "decimal",
        "cursor": "",
        "normalizeMetadata": True,
    }
    response = evm_api.nft.get_wallet_nfts(
        api_key=moralis_api_key,
        params=paramsNFT,
    )
    nftData = response["result"]
    for i in range(0, len(nftData)):
        dictionary = {
            "token_address": nftData[i]["token_address"],
            "token_id": nftData[i]["token_id"],
        }
        tokens721.append(dictionary)
    return (tokens20, tokens721)


# Function to set response date in contract
def setDate(owner):
    today_date = str(date.today())
    store_transaction = contract.functions.setResponseDate(
        owner, today_date
    ).build_transaction(
        {
            "chainId": chain_id,
            "from": my_address,
            "nonce": nonce,
            "gasPrice": web3.eth.gas_price,
        }
    )

    signed_store_txn = web3.eth.account.sign_transaction(
        store_transaction, private_key=private_key
    )
    send_store_tx = web3.eth.send_raw_transaction(signed_store_txn.rawTransaction)
    print(send_store_tx)

    tx_receipt = web3.eth.wait_for_transaction_receipt(send_store_tx)
    print(tx_receipt)
    return


# Function to set owner is not alive in contract
def setNotAlive(owner):
    store_transaction = contract.functions.setOwnerNotAlive(owner).buildTransaction(
        {
            "chainId": chain_id,
            "from": my_address,
            "nonce": nonce,
            "gasPrice": web3.eth.gas_price,
        }
    )

    signed_store_txn = web3.eth.account.sign_transaction(
        store_transaction, private_key=private_key
    )
    send_store_tx = web3.eth.send_raw_transaction(signed_store_txn.rawTransaction)
    print(send_store_tx)

    tx_receipt = web3.eth.wait_for_transaction_receipt(send_store_tx)
    print(tx_receipt)
    return


# Function to send mail
def sendMail(message, email):
    # creates SMTP session
    smtp = smtplib.SMTP("smtp.gmail.com", 587)

    # start TLS for security
    smtp.starttls()

    # Authentication
    smtp.login(os.environ.get("APP_MAIL"), os.environ.get("APP_PASSWORD"))
    smtp.sendmail(os.environ.get("APP_MAIL"), email, message)
    smtp.quit()


def sayHello():
    print("hello")


# getTransactionDetails()
# call function every day
# schedule.every(2).minutes.do(getTransactionDetails)
# schedule.every(1).minutes.do(sayHello)
getTransactionDetails()
# getTokenAddresses()

# while True:
#     schedule.run_pending()
#     time.sleep(1)
