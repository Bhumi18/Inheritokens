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
export const CONTRACT_ADDRESS = "0xaEF8eb4EDCB0177A5ef6a5e3f46E581a5908eef4";
export const BTTC_ADDRESS = "0xB987640A52415b64E2d19109E8f9d7a3492d5F54";
const API_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGZiNzE4QzgwYmJlYUQwNTAzYThFMjgzMmI2MDU0RkVmOUU4MzA2NzQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjE0MTEzNjczNTAsIm5hbWUiOiJUcnkifQ.srPPE7JD3gn8xEBCgQQs_8wyo6rDrXaDWC0QM8FtChA";

const client = new Web3Storage({ token: API_TOKEN });

function EditProfile({ setShowEditProfile, data }) {
  const profile_picture = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const [file, setFile] = useState(data[0][3]);
  const [fileName, setFileName] = useState("");
  // const [fileCid, setFileCid] = useState("");
  const [btnloading, setbtnLoading] = useState(false);
  const [submitNotClicked, setSubmitNotClicked] = useState(true);
  const [uploaded, setUploaded] = useState("Update");
  const { address, isConnected } = useAccount();

  const [userData, setUserData] = useState({
    name: data[0][0],
    email: data[0][1],
  });
  // console.log(location.state.profile_cid);
  async function uploadImage(e) {
    // console.log(e.target.value);
    // console.log(document.getElementById("input").files[0].name);
    setFileName(document.getElementById("input").files[0].name);
    // console.log(URL.createObjectURL(e.target.files[0]));
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  async function handleUpload() {
    // var fileInput = document.getElementById("input");
    // console.log(fileInput);
    // const cid = await client.put(fileInput.files);
    // const rootCid = await client.put(fileInput.files, {
    //   name: "inheritokens",
    //   maxRetries: 3,
    // });
    // console.log(rootCid);
    // const res = await client.get(rootCid);
    // const files = await res.files();
    // console.log(files);
    // const url = URL.createObjectURL(files[0]);
    // console.log(url);
    // console.log(files[0].cid);
    // const image_cid = cid + "/" + fileName;
    // setUserData({ ...userData, cid: cid + "/" + fileName });
    // setFileCid(files[0].cid);
    setUploaded("Image Uploaded");
    setbtnLoading(false);
    onSuccess();
    // setFile(url);
  }
  // const resetFile = () => {
  //   setFile("");
  //   setUploaded("Upload File");
  // };
  const onSuccess = async () => {
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
          const tx = await con.editOwnerDetails(
            address,
            userData.name,
            userData.email,
            data[0][3]
          );
          tx.wait();
        } else if (chainId === 1029) {
          const con = new ethers.Contract(BTTC_ADDRESS, contract, signer);
          const tx = await con.editOwnerDetails(
            address,
            userData.name,
            userData.email,
            data[0][3]
          );
          tx.wait();
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
    setTimeout(() => {
      setUploaded("Redirecting...");
      // console.log(userData);
    }, 1000);
    setTimeout(() => {
      setShowEditProfile(false);
      // console.log(userData);
    }, 2000);
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
          <div
            className="close-button"
            onClick={() => {
              setShowEditProfile(false);
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
          <h2>Edit Profile</h2>
          {/* <h3>Enter your details</h3> */}
          <div action="" className="login-form">
            <div className="input-outer-div name-input">
              <img src={namepic} alt="nameicon" />
              {/* <MailSvg /> */}
              <input
                type="text"
                defaultValue={data[0][0]}
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
                defaultValue={data[0][1]}
                placeholder="Email"
                onChange={(e) => {
                  setUserData({ ...userData, email: e.target.value });
                }}
              />
            </div>
            {/* <div className="input-outer-div file-upload-input">
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
                  Choose file
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
            {/* {file && submitNotClicked ? (
              <>
                <p className="reset-text">
                  * To reset the file, click on the reset button.
                </p>
              </>
            ) : file && !submitNotClicked ? (
              <>
                <p className="reset-text">Uploading your image on ipfs</p>
              </>
            ) : (
              <>
                <p className="reset-text"></p>
              </>
            )}  */}
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

export default EditProfile;
