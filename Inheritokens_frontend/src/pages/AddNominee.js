import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Web3Storage } from "web3.storage";
import profilepic from "../assets/images/profile_image.svg";
import emailpic from "../assets/images/Mail.svg";
import walletpic from "../assets/images/wallet_icon.svg";
import closeicon from "../assets/images/close.png";
import namepic from "../assets/images/Name.svg";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";

import "../styles/signup.scss";
import Navbar from "../components/Navbar";
// import MailSvg from "../components/MailSvg";

import contract from "../artifacts/Main.json";
import { inheritokensInstance } from "../components/Contracts";
import Footer from "../components/Footer";
export const CONTRACT_ADDRESS = "0xaEF8eb4EDCB0177A5ef6a5e3f46E581a5908eef4";
export const BTTC_ADDRESS = "0xB987640A52415b64E2d19109E8f9d7a3492d5F54";

const API_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGZiNzE4QzgwYmJlYUQwNTAzYThFMjgzMmI2MDU0RkVmOUU4MzA2NzQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjE0MTEzNjczNTAsIm5hbWUiOiJUcnkifQ.srPPE7JD3gn8xEBCgQQs_8wyo6rDrXaDWC0QM8FtChA";

const client = new Web3Storage({ token: API_TOKEN });

function AddNominee() {
  const profile_picture = useRef();
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  // const [fileCid, setFileCid] = useState("");
  const [btnloading, setbtnLoading] = useState(false);
  const [submitNotClicked, setSubmitNotClicked] = useState(true);
  const [emailFormatWarn, setEmailFormatWarn] = useState(false);
  const [waFormatWarn, setwaFormatWarn] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [uploaded, setUploaded] = useState("Add Nominee");
  const [imgMsg, setImgMsg] = useState("Uploading your image on ipfs...");
  const nameRef = useRef("");
  const emailRef = useRef(null);
  const waRef = useRef(null);

  const { address } = useAccount();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    wallet_address: "",
    cid: "",
  });

  //email validation function

  const validateEmail = (email) => {
    const emailFormat =
      /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/.test(email);

    if (emailFormat) {
      setEmailFormatWarn(false);
      return true;
    } else {
      setEmailFormatWarn(true);
      console.log("Please enter email in proper format");
      return false;
    }
  };

  // wallet address validation

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

  async function uploadImage(e) {
    // console.log(e.target.value);
    console.log(document.getElementById("input").files[0].name);
    setFileName(document.getElementById("input").files[0].name);
    console.log(URL.createObjectURL(e.target.files[0]));
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  async function handleUpload(a, b) {
    console.log("inside handleUpload");
    if (a && b) {
      setSubmitNotClicked(false);
      setbtnLoading(true);
      var fileInput = document.getElementById("input");
      // console.log(fileInput);
      console.log(fileInput.files.length);

      let cid;
      if (fileInput.files.length > 0) {
        cid = await client.put(fileInput.files);
      }
      // const rootCid = await client.put(fileInput.files, {
      //   name: "inheritokens profile images",
      //   maxRetries: 3,
      // });
      // console.log(rootCid);
      // const res = await client.get(rootCid);
      // const files = await res.files();
      // console.log(files);
      // const url = URL.createObjectURL(files[0]);
      // console.log(url);
      // console.log(files[0].cid);
      let image_cid;
      if (fileInput.files.length > 0) {
        image_cid = cid + "/" + fileName;
      } else {
        image_cid =
          "bafybeidn6hnteexegeou2by4hyic35g7w5wmtbgaaknehewf5wv5zj7kve/defaultprofileimage.png";
      }
      console.log(image_cid);
      setUserData({ ...userData, cid: cid + "/" + fileName });
      // setFileCid(files[0].cid);
      setImgMsg("Successfully uploaded on IPFS");
      setbtnLoading(false);
      onSuccess(image_cid);
      // setFile(url);
    }
  }
  // const resetFile = () => {
  //   setFile("");
  //   setUploaded("Upload File");
  // };
  const onSuccess = async (image_cid) => {
    setImgMsg("waiting for transaction...");
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
          // const con = new ethers.Contract(CONTRACT_ADDRESS, contract, signer);
          const con = await inheritokensInstance();
          const tx = await con.addNomineesDetails(
            userData.name,
            userData.email,
            image_cid,
            userData.wallet_address
          );
          await tx.wait();
          navigate("/user/profile", { state: { component: "nominee" } });
        } else if (chainId === 1029) {
          const con = new ethers.Contract(BTTC_ADDRESS, contract, signer);
          const tx = await con.addNomineesDetails(
            userData.name,
            userData.email,
            image_cid,
            userData.wallet_address.toLowerCase()
          );
          await tx.wait();
          navigate("/user/profile", { state: { component: "nominee" } });
        } else {
          alert(
            "Please connect to the mumbai test network or BTTC test network!"
          );
        }
      }
    } catch (error) {
      setbtnLoading(false);
      setUploaded("Add Nominee");
      let msg = error.message.split("(")[0];
      setErrorMsg(msg);
      setError(true);
      console.log(error.message);
    }
    //contract code ends here.................................

    // setTimeout(() => {
    //   navigate("/user/profile");
    //   // console.log(userData);
    // }, 1000);
  };
  const resetImage = () => {
    setFile("");
    setFileName("");
    // setUploaded("Upload File");
  };

  const handleSubmit = (email, wa) => {
    let emailVerified = false;
    let waVerified = false;
    if (validateEmail(email)) {
      emailVerified = true;
    } else {
      emailVerified = false;
    }
    if (validateWalletAddress(wa)) {
      waVerified = true;
    } else {
      waVerified = false;
    }
    handleUpload(emailVerified, waVerified);
  };
  useEffect(() => {
    // console.log(userData);
    setEmailFormatWarn(false);
  }, [userData.email]);

  useEffect(() => {
    // console.log(userData);
    setwaFormatWarn(false);
  }, [userData.wallet_address]);

  useEffect(() => {
    if (!address) navigate("/");
  }, [address, navigate]);

  return (
    <>
      <Navbar />
      <section className="signup-main">
        <div className="login-card">
          <div
            className="close-button"
            onClick={() => {
              navigate("/user/profile", { state: { component: "nominee" } });
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
          <h2>Add Nominee</h2>
          {/* <h3>Enter your details</h3> */}
          <div action="" className="login-form">
            <div
              className="input-outer-div name-input"
              onClick={(e) => {
                nameRef.current.focus();
              }}
            >
              <img src={namepic} alt="nameicon" />
              {/* <MailSvg /> */}
              <input
                type="text"
                placeholder="Name"
                ref={nameRef}
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
            <div
              className={
                emailFormatWarn ? "warning input-outer-div" : "input-outer-div"
              }
              onClick={(e) => {
                emailRef.current.focus();
              }}
            >
              <img src={emailpic} alt="emailicon" />
              <input
                type="email"
                placeholder="Email"
                ref={emailRef}
                onChange={(e) => {
                  setUserData({ ...userData, email: e.target.value });
                }}
              />
            </div>
            {emailFormatWarn ? (
              <p style={{ color: "red", fontSize: "14px" }}>
                * Please enter valid email address
              </p>
            ) : (
              ""
            )}
            <div
              className={
                waFormatWarn ? "warning input-outer-div" : "input-outer-div"
              }
              onClick={(e) => {
                waRef.current.focus();
              }}
            >
              <img src={walletpic} alt="walleticon" />
              <input
                type="text"
                placeholder="Wallet Address"
                ref={waRef}
                onChange={(e) => {
                  setUserData({ ...userData, wallet_address: e.target.value });
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
            <div className="input-outer-div">
              <img
                src={profilepic}
                alt="profileicon"
                onClick={(e) => {
                  profile_picture.current.click();
                }}
              />
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
                  Nominee Profile Picture
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
                <p className="reset-text">{imgMsg}</p>
              </>
            ) : (
              <>
                <p className="reset-text"></p>
              </>
            )}
            <button
              className={
                userData.email === "" ||
                userData.name === "" ||
                userData.wallet_address === ""
                  ? "disabled"
                  : ""
              }
              onClick={() => {
                handleSubmit(userData.email, userData.wallet_address);
                // handleUpload();
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
      <Footer />
    </>
  );
}

export default AddNominee;
