import React, { useRef, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Web3Storage } from "web3.storage";
import profilepic from "../assets/images/profile_image.svg";
import emailpic from "../assets/images/Mail.svg";
import namepic from "../assets/images/Name.svg";
import closeicon from "../assets/images/close.png";
import Navbar from "../components/Navbar";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import "../styles/signup.scss";
// import MailSvg from "../components/MailSvg";

import contract from "../artifacts/Main.json";
export const CONTRACT_ADDRESS = "0xaEF8eb4EDCB0177A5ef6a5e3f46E581a5908eef4";
export const BTTC_ADDRESS = "0xB987640A52415b64E2d19109E8f9d7a3492d5F54";

const API_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkyYmY4MEI1OUJlMzBCRjM1ZDdkYTY5M0NFNTQzNDdGNjlFZEM1NmQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njc5NzY5MDYzODYsIm5hbWUiOiJpbmhlcml0b2tlbnMifQ.Z4UmWNYWRFp7AwVpbPfcm12T2E5oRylpnd8c3cp9PHA";

const client = new Web3Storage({ token: API_TOKEN });

function Signup() {
  const profile_picture = useRef();
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  // const [fileCid, setFileCid] = useState("");
  const [btnloading, setbtnLoading] = useState(false);
  const [submitNotClicked, setSubmitNotClicked] = useState(true);
  const [uploaded, setUploaded] = useState("Sign Up");
  const { address, isConnected } = useAccount();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    cid: "",
    otp: "",
  });

  async function uploadImage(e) {
    // console.log(e.target.value);
    // console.log(document.getElementById("input").files[0].name);
    setFileName(document.getElementById("input").files[0].name);
    // console.log(URL.createObjectURL(e.target.files[0]));
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  async function handleUpload() {
    var fileInput = document.getElementById("input");
    // console.log(fileInput);
    const cid = await client.put(fileInput.files);
    // console.log("new " + cid + "/" + fileName);
    // const rootCid = await client.put(fileInput.files, {
    //   name: "inheritokens profile images",
    //   maxRetries: 5,
    // });
    // console.log(rootCid);
    // const res = await client.get(rootCid);
    // const files = await res.files();
    // console.log(files);
    // const url = URL.createObjectURL(files[0]);
    // console.log(url);
    // console.log(files[0].cid);
    const image_cid = cid + "/" + fileName;
    setUserData({ ...userData, cid: cid + "/" + fileName });
    // setFileCid(files[0].cid);
    setUploaded("Uploaded");
    setbtnLoading(false);
    // sendEmailVarification(image_cid);
    onSuccess(image_cid, 1808);

    // setFile(url);
  }
  // const resetFile = () => {
  //   setFile("");
  //   setUploaded("Upload File");
  // };
  const sendEmailVarification = async (image_cid) => {
    var data = JSON.stringify({
      email: userData.email,
      user_address: address,
    });

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_URL}email_verification`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        console.log(response.data.otp);
        console.log(typeof response.data.otp);
        setUserData({ ...userData, otp: 1808 });
        onSuccess(image_cid, 1808);
      })
      .catch(function (error) {
        console.log(error);
        onSuccess(image_cid, 1808);
      });
  };
  const onSuccess = async (image_cid, otp) => {
    setUploaded("Requesting...");
    // setTimeout(() => {
    //   setUploaded("Requesting...");
    //   // console.log(userData);
    // }, 1000);
    // verify api function.....................
    // var data = JSON.stringify({
    //   address: address,
    //   otp: otp,
    // });

    // var config = {
    //   method: "post",
    //   url: "https://api.dehitas.xyz/verify",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   data: data,
    // };

    // await axios(config)
    //   .then(function (response) {
    //     console.log(JSON.stringify(response.data));
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });

    // verify function ends....................
    //contract code starts here...............................
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }

        const { chainId } = await provider.getNetwork();
        console.log("switch case for this case is: " + chainId);
        if (chainId === 80001) {
          const con = new ethers.Contract(CONTRACT_ADDRESS, contract, signer);
          const tx = await con.addOwnerDetails(
            userData.name,
            userData.email,
            image_cid,
            otp
          );
          setUploaded("waiting for transaction...");
          await tx.wait();
          navigate("/user/profile");
          // setTimeout(() => {
          //   // navigate("/verify/email", {
          //   //   state: {
          //   //     email: userData.email,
          //   //   },
          //   // });
          //   navigate("/user/profile");
          //   // console.log(userData);
          // }, 2000);
        } else if (chainId === 1029) {
          const con = new ethers.Contract(BTTC_ADDRESS, contract, signer);
          const tx = await con.addOwnerDetails(
            userData.name,
            userData.email,
            image_cid,
            otp
          );
          await tx.wait();
          navigate("/user/profile");
          // setTimeout(() => {
          //   navigate("/user/profile");
          // }, 2000);
        } else {
          alert(
            "Please connect to the mumbai test network or BTTC test network!"
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
    //contract code ends here.................................

    // console.log("userdata" + userData);
  };

  const resetImage = () => {
    setFile("");
    setFileName("");
    // setUploaded("Upload File");
  };

  useEffect(() => {
    // console.log(userData);
  }, [userData]);

  return (
    <>
      <Navbar />
      <section className="signup-main">
        <div className="login-card">
          <h2>Sign Up</h2>
          {/* <h3>Enter your details</h3> */}
          <div action="" className="login-form">
            <div className="input-outer-div name-input">
              <img src={namepic} alt="nameicon" />
              {/* <MailSvg /> */}
              <input
                type="text"
                placeholder="Name"
                onChange={(e) => {
                  setUserData({ ...userData, name: e.target.value });
                }}
              />
            </div>
            {/* <PhoneInput
              inputExtraProps={{
                name: "phone",
                required: true,
                autoFocus: false,
              }}
              // country={"us"}
              placeholder="Phone number"
              value={UserData.contact_number}
              autoFocus="false"
              onChange={(e) => setUserData({ ...UserData, contact_number: e })}
            /> */}
            <div className="input-outer-div">
              <img src={emailpic} alt="emailicon" />
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => {
                  setUserData({ ...userData, email: e.target.value });
                }}
              />
            </div>
            <div className="input-outer-div file-upload-input">
              <img src={profilepic} alt="profileicon" />
              <input
                className="input-edit-profile"
                id="input"
                type="file"
                hidden
                // defaultValue={nameOfUser}
                ref={profile_picture}
                onChange={(e) => {
                  uploadImage(e);
                }}
              />
              {file ? (
                <>
                  <p
                    onClick={(e) => {
                      profile_picture.current.click();
                    }}
                  >
                    {fileName}
                  </p>{" "}
                  <img
                    className="close-icon"
                    src={closeicon}
                    alt="close"
                    onClick={() => {
                      resetImage();
                    }}
                  />
                </>
              ) : (
                <p
                  onClick={(e) => {
                    profile_picture.current.click();
                  }}
                >
                  Upload Profile Picture
                </p>
              )}
            </div>

            {file ? (
              <>
                <div className="file-upload-div">
                  <img src={file} className="uploaded-img" alt="uploadsvg" />
                  <p></p>{" "}
                </div>
              </>
            ) : null}
            {/* <button className="file-upload-btn">Select Profile Image</button> */}
            {file && submitNotClicked ? (
              <>
                <p className="reset-text">
                  * To reset the file, click on the reset button.
                </p>
              </>
            ) : file && !submitNotClicked ? (
              <>
                <p className="reset-text">* Uploading your image on ipfs...</p>
              </>
            ) : (
              <>
                <p className="reset-text"></p>
              </>
            )}
            <button
              onClick={() => {
                handleUpload();
                setSubmitNotClicked(false);
                setbtnLoading(true);
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
          </div>
        </div>
      </section>
    </>
  );
}

export default Signup;
