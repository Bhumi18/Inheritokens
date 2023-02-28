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

# inheritokens contract set up

inheritokens_factory = "0x2dec54540c6688d81c78D42F1092D237D9a89716"    
file = open("D:/Lampros Projects/Inheritokens/Inheritokens_schedular/Inheritokens.json")
abi = json.load(file)
contract = web3.eth.contract(address=inheritokens_factory, abi=abi)

# multiple nominee contract set up

multiple_nominee = "0x6a66B56E1183e35141d14B3aCD0e21284Ca9FD13"
file1 = open(
    "D:/Lampros Projects/Inheritokens/Inheritokens_schedular/MultipleNominee.json"
)
abi1 = json.load(file1)
contract1 = web3.eth.contract(address=multiple_nominee, abi=abi1)

# other set up

chain_id = 80001
my_address = os.environ.get("ADDRESS")
private_key = os.environ.get("KEY")
moralis_api_key = os.environ.get("MORALIS_API_KEY")
nonce = web3.eth.get_transaction_count(my_address)


# Function to check six months of inactivity, send mail to the owner, send mail to the nominees
def getTransactionDetails():
    # get all owners available on platform (address)
    data = contract.functions.getOwners().call()
    # print(data)

    # loop through owners
    for i in range(len(data)):
        # check owner is alive or not from contract
        isAlive = contract.functions.getOwnerAlive(data[i]).call()
        # print(isAlive)

        if isAlive:
            # check for inactivity of an account using moralis api
            url = "https://deep-index.moralis.io/api/v2/" + data[i] + "?chain=mumbai"
            headers = {"accept": "application/json", "X-API-Key": moralis_api_key}
            response = requests.get(url, headers=headers)
            json_data = response.json()
            # print(json_data["result"][0]["block_timestamp"])
            last_transaction = json_data["result"][0]["block_timestamp"]
            # last_transaction = "2023-02-19"

            # convert timestamp into the proper date format
            trans_month = last_transaction[5:7]
            trans_year = last_transaction[:4]
            trans_date = last_transaction[8:10]
            last_trans_date = date(int(trans_year), int(trans_month), int(trans_date))

            # find the difference between the current date and the converted timestamp date
            today = date.today()
            difference = str(today - last_trans_date)
            no_days = difference.split(" ")[0]
            if no_days == "0:00:00":
                no_days = 0
            # print(no_days)

            # get email of owner from contract, and no of months owner wants to wait
            owner_struct = contract.functions.getOwnerDetails(data[i]).call()
            print(owner_struct)
            owner_email = owner_struct[1]
            no_of_inactive_months = owner_struct[8]
            no_of_months_mail = owner_struct[9]
            no_of_months_nominee = owner_struct[10]

            # get all nominees
            all_nominees = owner_struct[6]
            # print(all_nominees)

            # get response date and whether owner has responded or not from contract
            response_date = contract.functions.getResponseDate(data[i]).call()
            isResponded = contract.functions.getResponse(data[i]).call()
            # print(response_date)
            # print(isResponded)

            if response_date == "":
                # print("no res date")
                no_res_days = 0
            else:
                # convert response date into proper date format
                res_month = response_date[5:7]
                res_year = response_date[:4]
                res_date = response_date[8:]
                # print((response_date))
                temp_date = date(int(res_year), int(res_month), int(res_date))

                # find the difference between the current date and the converted response date
                today_date = date.today()
                difference_date = str(today_date - temp_date)
                no_res_days = difference_date.split(" ")[0]

                if no_res_days == "0:00:00":
                    no_res_days = 0
            # print(no_res_days)

            no_days = 181
            no_res_days = 70

            # owner's account is not active, owner's time period is not complete, owner has not responded yet, send mail to the owner
            if (
                int(no_days) > (no_of_inactive_months * 30)
                and int(no_res_days) < no_of_months_mail * 30
                and isResponded == False
            ):
                # response date is null then set the response date
                if response_date == "":
                    print("call contract function")
                    setDate(data[i])
                    print("called")

                # send mail to the owner
                # message = "Please tell me you are doing fine"
                # sendMail(message, email)
                print("Please tell me you are doing fine")

            # owner's account is not active, owner's time period is completed, owner has not responded, send mail to the nominee
            elif (
                int(no_days) > ((no_of_inactive_months * 30))
                and int(no_res_days) > no_of_months_mail * 30
                and isResponded == False
            ):
                # get all the ERC20 and ERC721 assets from moralis api
                (t20, t721) = getTokenAddresses(data[i])

                print("more than 1 month")
                print(t20)
                print(t721)
                # for i in range(len(data2)):
                #     data3 = contract.functions.getNomineeDetails(data2[i]).call()
                #     nominee_email.append(data3[2])
                #     message = "Hi, Congratulations you are nominated for cryptos!"
                #     sendMail(message, data3[2])
                # setNotAlive(data[i])

                # get all the structure data from the contract for a given token address and token id
                assigned_tokens = contract1.functions.getAllStructs(
                    data[i], Web3.to_checksum_address(t20[0]), 0
                ).call()
                print(assigned_tokens)

                for i in range(0, len(assigned_tokens)):
                    for j in range(0, len(assigned_tokens[i][1])):
                        if assigned_tokens[i][2][j] == True:
                            continue
                        else:
                            if no_res_days < (
                                ((no_of_months_nominee * 30) * (j + 1))
                                + (no_of_months_mail * 30)
                            ):
                                if assigned_tokens[i][3][j] == False:
                                    nominee_mail = contract.functions.getNomineeDetails(
                                        assigned_tokens[i][1][j]
                                    ).call()[1]
                                    print("nominee number")
                                    print(j + 1)
                                    print(nominee_mail)
                                    # send mail to the nominee
                                    break
                            else:
                                if (
                                    assigned_tokens[i][2][j] == False
                                    and assigned_tokens[i][3][j] == False
                                ):
                                    print("set not available in contract")
                                    # call contract function here
            elif int(no_days) < (no_of_inactive_months * 30):
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
