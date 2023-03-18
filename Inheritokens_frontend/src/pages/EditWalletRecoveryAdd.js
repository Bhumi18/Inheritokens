import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Web3Storage } from "web3.storage";
import profilepic from "../assets/images/profile_image.svg";
import emailpic from "../assets/images/Mail.svg";
import namepic from "../assets/images/Name.svg";
import closeicon from "../assets/images/close.png";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

import "../styles/signup.scss";
// import MailSvg from "../components/MailSvg";
import contract from "../artifacts/Main.json";
import { inheritokensInstance } from "../components/Contracts";
export const CONTRACT_ADDRESS = "0xaEF8eb4EDCB0177A5ef6a5e3f46E581a5908eef4";
export const BTTC_ADDRESS = "0xB987640A52415b64E2d19109E8f9d7a3492d5F54";
const API_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGZiNzE4QzgwYmJlYUQwNTAzYThFMjgzMmI2MDU0RkVmOUU4MzA2NzQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjE0MTEzNjczNTAsIm5hbWUiOiJUcnkifQ.srPPE7JD3gn8xEBCgQQs_8wyo6rDrXaDWC0QM8FtChA";

const client = new Web3Storage({ token: API_TOKEN });

function EditWalletRecoveryAdd({
  setRecoveryEdit,
  recoveryAddress,
  setRecoveryAddress,
}) {
  const w_add = useRef();

  // const [fileCid, setFileCid] = useState("");
  const [btnloading, setbtnLoading] = useState(false);
  const [waFormatWarn, setwaFormatWarn] = useState(false);
  const [submitNotClicked, setSubmitNotClicked] = useState(true);
  const [uploaded, setUploaded] = useState("Update");
  const { address, isConnected } = useAccount();

  const [userData, setUserData] = useState({
    w_add: "",
  });
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const validateWalletAddress = (wa) => {
    console.log("inside wa validation");
    const waFormat = /^0x[a-fA-F0-9]{40}$/g.test(wa);
    console.log(waFormat);

    if (waFormat) {
      setwaFormatWarn(false);
      return true;
    } else {
      setwaFormatWarn(true);
      console.log("Please enter valid Wallet Address");
      return false;
    }
  };

  const handleUpload = async (a) => {
    if (a) {
      try {
        setSubmitNotClicked(false);
        setbtnLoading(true);

        const con = await inheritokensInstance();
        const tx = await con.addWalletRecovery(userData.w_add);
        await tx.wait();
        console.log("Wallet recovery address added successfully");
        setRecoveryAddress(userData.w_add);
        setbtnLoading(false);
        setRecoveryEdit(false);
      } catch (error) {
        setbtnLoading(false);
        setUploaded("Update");
        let msg = error.message.split("(")[0];
        setErrorMsg(msg);
        setError(true);
        console.log(error.message);
      }
    }
  };

  const handleSubmit = (wa) => {
    setError(false);
    setErrorMsg("");
    let waVerified = false;

    if (validateWalletAddress(wa)) {
      waVerified = true;
    } else {
      waVerified = false;
    }
    handleUpload(waVerified);
  };

  useEffect(() => {
    // console.log(userData);
    setError(false);
    setErrorMsg("");
    setwaFormatWarn(false);
  }, [userData.w_add]);

  return (
    <>
      <Navbar />
      <section className="signup-main">
        <div className="login-card recovery-card">
          <div
            className="close-button"
            onClick={() => {
              setRecoveryEdit(false);
            }}
          >
            <svg
              id="Layer_1"
              width="25px"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 122.88 119.79"
            >
              <title>close-window</title>
              <path d="M23.5,0H99.38a23.56,23.56,0,0,1,23.5,23.5V96.29a23.56,23.56,0,0,1-23.5,23.5H23.5a23.44,23.44,0,0,1-16.6-6.9l-.37-.4A23.43,23.43,0,0,1,0,96.29V23.5A23.56,23.56,0,0,1,23.5,0ZM41,49.35a7,7,0,0,1,9.89-9.89L61.44,50,72,39.46a7,7,0,1,1,9.89,9.9L71.33,59.9,81.87,70.43A7,7,0,0,1,72,80.33L61.44,69.79,50.9,80.33A7,7,0,0,1,41,70.43L51.55,59.89,41,49.35ZM99.38,12.52H23.5a11,11,0,0,0-11,11V96.29a10.92,10.92,0,0,0,3,7.49l.27.26a11,11,0,0,0,7.75,3.23H99.38a11,11,0,0,0,11-11V23.5a11,11,0,0,0-11-11Z" />
            </svg>
          </div>
          <h2>Add/Edit Recovery Wallet</h2>
          {/* <h3>Enter your details</h3> */}
          <div action="" className="login-form">
            <div
              className={
                waFormatWarn
                  ? "warning input-outer-div name-input"
                  : "input-outer-div name-input"
              }
              onClick={(e) => {
                w_add.current.focus();
              }}
            >
              <img src={namepic} alt="nameicon" />
              {/* <MailSvg /> */}
              <input
                type="text"
                ref={w_add}
                defaultValue={recoveryAddress}
                onChange={(e) => {
                  setUserData({ ...userData, w_add: e.target.value });
                }}
              />
            </div>
            {waFormatWarn ? (
              <p style={{ color: "red", fontSize: "14px" }}>
                * Please enter valid Wallet Address
              </p>
            ) : (
              ""
            )}

            {/* <div className="input-outer-div">
              <img src={emailpic} alt="emailicon" />
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => {
                  setUserData({ ...userData, email: e.target.value });
                }}
              />
            </div> */}
            <button
              className={
                userData.w_add === "" || userData.w_add === recoveryAddress
                  ? "disabled"
                  : ""
              }
              onClick={() => {
                // handleUpload();
                handleSubmit(userData.w_add);
              }}
            >
              {btnloading ? (
                <svg
                  className="animate-spin button-spin-svg-pic"
                  version="1.1"
                  id="L9"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 100 100"
                >
                  <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"></path>
                </svg>
              ) : (
                <>{uploaded}</>
              )}
            </button>
            {error ? (
              <p style={{ color: "red", fontSize: "14px" }}>
                {"* " + errorMsg}
              </p>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default EditWalletRecoveryAdd;
