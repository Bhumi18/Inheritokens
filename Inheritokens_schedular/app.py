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
from datetime import datetime, timedelta

load_dotenv()

# Contract setup

alchemy_url = "https://polygon-mumbai.g.alchemy.com/v2/ALbcNieoFrIRYYNDrcr4dAASXUCZbm-i"
web3 = Web3(Web3.HTTPProvider(alchemy_url))

# inheritokens contract set up

inheritokens_factory = "0xBa9294771806D6909A3FD9C5b5240d71927Dfd2e"
file = open("D:/Lampros Projects/Inheritokens/Inheritokens_schedular/Inheritokens.json")
abi = json.load(file)
contract = web3.eth.contract(address=inheritokens_factory, abi=abi)

# multiple nominee contract set up

multiple_nominee = "0x9D4be64f5732bcaf6dB88998189D8B30BD84a4fF"
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
    print(data)

    # loop through owners
    for i in range(len(data)):
        # check owner is alive or not from contract
        owner_struct = contract.functions.getOwnerDetails(data[i]).call()

        # check for inactivity of an account using moralis api
        url = "https://deep-index.moralis.io/api/v2/" + data[i] + "?chain=mumbai"
        headers = {"accept": "application/json", "X-API-Key": moralis_api_key}
        response = requests.get(url, headers=headers)
        json_data = response.json()
        last_transaction = ""

        # get the block timestamp of the latest transaction done by owner
        for j in range(len(json_data["result"])):
            if json_data["result"][j]["from_address"].lower() == data[i].lower():
                last_transaction = json_data["result"][j]["block_timestamp"]
                break
        # print(last_transaction)

        # last_transaction = "2023-02-19"

        # convert timestamp into the proper date format
        trans_month = last_transaction[5:7]
        trans_year = last_transaction[:4]
        trans_date = last_transaction[8:10]
        last_trans_date = date(int(trans_year), int(trans_month), int(trans_date))
        # print(last_trans_date)

        # find the difference between the current date and the converted timestamp date
        today = date.today()
        # print(today)
        difference = str(today - last_trans_date)
        # print(difference)
        no_days = difference.split(" ")[0]
        # print(no_days)
        if no_days == "0:00:00":
            no_days = 0
        print("difference between current date and last transaction")
        print(no_days)

        # get email of owner from contract, and no of months owner wants to wait
        owner_email = owner_struct[1]
        # print(owner_email)
        no_of_inactive_months = owner_struct[10]
        # print(no_of_inactive_months)
        no_of_months_mail = owner_struct[11]
        # print(no_of_months_mail)
        no_of_months_nominee = owner_struct[12]
        # print(no_of_months_nominee)

        # get all nominees
        all_nominees = owner_struct[8]
        # print(all_nominees)

        # get response date and whether owner has responded or not from contract
        response_date = owner_struct[3]
        isResponded = owner_struct[6]
        # print(response_date)
        # print(isResponded)
        # response_date = "2023-02-19"

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
        print("since how many days we are sending mail to the owner")
        print(no_res_days)

        no_days = 31
        no_res_days = 31

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

            # send mail to the owner--------------------------------------
            # message = "Please tell me you are doing fine"
            # sendMail(message, email)
            print("Please tell me you are doing fine")

        # owner's account is not active, owner's time period is completed, owner has not responded, send mail to the nominee
        elif (
            int(no_days) > ((no_of_inactive_months * 30))
            and int(no_res_days) > no_of_months_mail * 30
            and isResponded == False
        ):
            print(contract.functions.getIsClaimable(data[i]).call())

            # get all the ERC20 and ERC721 assets from moralis api
            (t20, t721) = getTokenAddresses(data[i])

            print("Nominee Part")
            # print(t20)
            # print(t721)

            # for i in range(len(data2)):
            #     data3 = contract.functions.getNomineeDetails(data2[i]).call()
            #     nominee_email.append(data3[2])
            #     message = "Hi, Congratulations you are nominated for cryptos!"
            #     sendMail(message, data3[2])
            # setNotAlive(data[i])

            # get all the structure data from the contract for a given token
            for t in range(len(t20)):
                assigned_tokens = contract1.functions.getAllStructs(
                    data[i], Web3.to_checksum_address(t20[t]), 0, 0
                ).call()
                print(assigned_tokens)

                for p in range(0, len(assigned_tokens)):
                    if assigned_tokens[p][5] == "":
                        # set date
                        setDateForNominee(data[i], t20[t], 0, 0, p)
                    current_date = date.today()
                    later_date = assigned_tokens[p][5]
                    if current_date < later_date:
                        # send mail to the can claim nominee
                        nominee_details = contract.functions.getNomineeDetails(
                            data[i], assigned_tokens[p][2]
                        ).call()
                        nominee_mail = nominee_details[1]
                        message = "Hi, Congratulations you are nominated for cryptos!"
                        sendMail(message, nominee_mail)
                    else:
                        # set date and can claim
                        setDateForNominee(data[i], t20[t], 0, 0, p)
                        changeCanClaim(data[i], t20[t], 0, 0, p)

            temp = [
                {
                    "token_address": "0x619ae6538afb1fb0275583791f6f2d9faa278b42",
                    "token_id": "16",
                }
            ]
            print("NFT Part")
            for t in range(len(t721)):
                assigned_tokens = contract1.functions.getAllStructs(
                    data[i], Web3.to_checksum_address(t721[t][0]), t721[t][1], 1
                ).call()
                print(assigned_tokens)
                # get all the structure data from the contract for a given NFT
                for p in range(0, len(assigned_tokens)):
                    if assigned_tokens[p][5] == "":
                        # set date
                        setDateForNominee(data[i], t721[t][0], t721[t][1], 1, p)
                    current_date = date.today()
                    later_date = assigned_tokens[p][5]
                    if current_date < later_date:
                        # send mail to the can claim nominee
                        nominee_details = contract.functions.getNomineeDetails(
                            data[i], assigned_tokens[p][2]
                        ).call()
                        nominee_mail = nominee_details[1]
                        message = "Hi, Congratulations you are nominated for cryptos!"
                        sendMail(message, nominee_mail)
                    else:
                        # set date and can claim
                        setDateForNominee(data[i], t721[t][0], t721[t][1], 1, p)
                        changeCanClaim(data[i], t721[t][0], t721[t][1], 1, p)
        elif int(no_days) < (no_of_inactive_months * 30):
            print("Active Account!")
        else:
            print("responded!")


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


# Function to set date for nominee
def setDateForNominee(_owner, _tokenAddress, _tokenId, _category, _index):
    days_after = date.today() + timedelta(days=30)
    store_transaction = contract.functions.setDateForNominee(
        _owner, _tokenAddress, _tokenId, _category, days_after, _index
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


# Function to change the canClaim
def changeCanClaim(_owner, _tokenAddress, _tokenId, _category, _index):
    store_transaction = contract.functions.changeCanClaim(
        _owner, _tokenAddress, _tokenId, _category, _index
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
    current_date = date.today()
    days_after = date.today() + timedelta(days=30)
    print((current_date))
    print(days_after)
    print(str(days_after > current_date))


# getTransactionDetails()
# call function every day
# schedule.every(2).minutes.do(getTransactionDetails)
# schedule.every(1).minutes.do(sayHello)
# getTransactionDetails()
# getTokenAddresses()
sayHello()

# while True:
#     schedule.run_pending()
#     time.sleep(1)
