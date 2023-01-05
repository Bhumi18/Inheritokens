from flask import Flask
from flask_cors import CORS
import os
import smtplib
import random
from email.mime.multipart import MIMEMultipart
from flask_ngrok import run_with_ngrok
from email.mime.text import MIMEText
from flask.globals import request, session
from dotenv import load_dotenv
from web3 import Web3
import json

app = Flask(__name__)
run_with_ngrok(app)
cors = CORS(app)


smtp = smtplib.SMTP("smtp.gmail.com", 587)
load_dotenv()


@app.route("/")
def hello_world():
    response_body = {"status": 200, "data": "Hi"}
    return response_body

# Contract setup
alchemy_url = "https://polygon-mumbai.g.alchemy.com/v2/ALbcNieoFrIRYYNDrcr4dAASXUCZbm-i"
web3 = Web3(Web3.HTTPProvider(alchemy_url))
nominee_factory = "0xaEF8eb4EDCB0177A5ef6a5e3f46E581a5908eef4"
file = open("Nominee.json")
abi = json.load(file)
contract = web3.eth.contract(address=nominee_factory, abi=abi)

# ---------------------------------------------------------------------------------------
# ---------------------------------------------------------------------------------------
# ---------------------------------------------------------------------------------------
# Sending Verification otp using mail
# @app.route("/email_verification", methods=["POST"])
# def email_verification():
    # try:
    #     client_mail = request.json["email"]
    #     user_address = request.json["user_address"]

    #     # Generate OTP
    #     otp = random.randint(1000, 9999)
    #     hostname = (
    #         os.environ.get("APP_URL")
    #         + "/verify?otp="
    #         + str(otp)
    #         + "&"
    #         + "address="
    #         + user_address
    #     )
    #     # Invoking smtp to send mail
    #     smtp.starttls()
    #     smtp.login(os.environ.get("APP_MAIL"), os.environ.get("APP_PASSWORD"))

    #     msg = MIMEMultipart("alternative")
    #     msg["Subject"] = "Inheritokens email verification."
    #     msg["From"] = os.environ.get("APP_MAIL")
    #     msg["To"] = client_mail

    #     html = f"""
    #         Hi User,<br/>
    #         <p>Please click on the <a href='{hostname}'>link</a> to verify.</p><br/>
    #         Thank You,<br/>
    #         Team Inheritokens
    #     """

    #     part1 = MIMEText(html, "html")

    #     msg.attach(part1)

    #     smtp.sendmail(os.environ.get("APP_MAIL"), client_mail, msg.as_string())
    #     smtp.close()
    #     response_body = {"status": 200, "data": "sent", "otp":otp}
    #     return response_body

    # except Exception as e:
    #     print(e)
    #     print("error")
    #     return None
    
# ---------------------------------------------------------------------------------------
# ---------------------------------------------------------------------------------------
# ---------------------------------------------------------------------------------------
# check state of user
@app.route("/checkAddress", methods=["POST"])
def checkAddress():
    try:
        address = request.json["address"]
        # contract function to get all owner's address
        address_array = contract.functions.getOwners().call()
        if(address_array!=[]):
            for i in range(len(address_array)):
                # check if it is available and verification
                if address == address_array[i]:
                    isVerified = contract.functions.checkVerification(address).call()
                    if(isVerified):
                        response_body = {"status": 2, "message": "registered and verified"} 
                    else:
                        response_body = {"status": 1, "message": "registered but not verified"}      
                else:
                    response_body = {"status": 0, "message": " not registered"}                               
        else:
            response_body = {"status": 0, "message": " not registered"} 
        return response_body
    except Exception as e:
        print(e)
        return None

# ---------------------------------------------------------------------------------------
# ---------------------------------------------------------------------------------------
# ---------------------------------------------------------------------------------------
# verify owner's email address
@app.route("/verify", methods=["POST"])
def verify():
    try:
        address = request.json["address"]
        otp = request.json["otp"]
        #get opt from contract
        owner_details = contract.functions.getOwnerDetails(address).call()
        contract_otp = (owner_details[5])
        # data to sign the transaction
        if contract_otp==otp:
            chain_id = 80001
            my_address = os.environ.get("ADDRESS")
            private_key = os.environ.get("KEY")
            nonce = web3.eth.getTransactionCount(my_address)
            # contract function to verify the owner's email address
            store_transaction = contract.functions.verifyOwner(address).buildTransaction(
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
            tx_receipt = web3.eth.wait_for_transaction_receipt(send_store_tx)
            # print(tx_receipt)
            print("done")
            response_body = {"status": 200, "message": "verified"}                   
            return response_body
        else:
            response_body = {"status": 500, "message": "otp is not same"}                   
            return response_body
    except Exception as e:
        print(e)
        return None

if __name__ == "__main__":
  app.run()