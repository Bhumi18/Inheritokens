import React from "react";
import axios from "axios";
import { useAccount, useNetwork } from "wagmi";
import coverimg from "../assets/images/coverfornominee.png";
import "../styles/profile.scss";
import Navbar from "../components/Navbar";
import defaultprofileimage from "../assets/images/defaultprofileimage.png";
import AllNfts from "../components/AllNfts";
import { useState } from "react";
import Tokens from "../components/Tokens";
import EditProfile from "./EditProfile";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NomineesList from "../components/NomineesList";
import { useReducer } from "react";
import { useRef } from "react";
import { ethers } from "ethers";
import contract from "../artifacts/Main.json";
import EditWalletRecoveryAdd from "./EditWalletRecoveryAdd";
export const CONTRACT_ADDRESS = "0xaEF8eb4EDCB0177A5ef6a5e3f46E581a5908eef4";
export const BTTC_ADDRESS = "0xB987640A52415b64E2d19109E8f9d7a3492d5F54";

function Profile() {
  const location = useLocation();

  const dataFetchedRef = useRef(false);
  const [nftData, setNftData] = useState([]);
  const [recoveryAddress, setRecoveryAddress] = useState("");
  const [nftInfo, setNftInfo] = useState([{ token_address: "", token_id: "" }]);
  const { address, isConnected } = useAccount("");
  const navigate = useNavigate();
  const { chain } = useNetwork();
  // console.log(chain);
  // const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [showProfileComponent, setProfileComponent] = useState(false);
  const [showAllNfts, setShowAllNfts] = useState(false);
  const [showAllTokens, setShowAllTokens] = useState(false);
  const [showAllNominees, setShowAllNominees] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showRecoveryEdit, setRecoveryEdit] = useState(false);
  const [nftShow, setnftShow] = useState(false);
  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = useState([]);

  const showProfile = async () => {
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
          const owner_details = await con.getOwnerDetails(address);
          // console.log(owner_details);
          const url = "https://ipfs.io/ipfs/" + owner_details[2];
          data.push([
            owner_details[0],
            owner_details[1],
            url,
            owner_details[2],
          ]);
          setData(data);
          // console.log(data);
          setLoading(false);
        } else if (chainId === 1029) {
          const con = new ethers.Contract(BTTC_ADDRESS, contract, signer);
          const owner_details = await con.getOwnerDetails(address);
          const url = "https://ipfs.io/ipfs/" + owner_details[2];
          data.push([
            owner_details[0],
            owner_details[1],
            url,
            owner_details[2],
          ]);
          setData(data);
          // console.log(data);
          setLoading(false);
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
  };

  useEffect(() => {
    if (!address) {
      navigate("/");
    }
  }, [address, navigate]);

  useEffect(() => {
    showProfile();
  }, []);

  useEffect(() => {
    showProfile();
  }, [chain]);

  const toggleEditProfile = () => {
    setShowEditProfile(!showEditProfile);
  };
  const toggleEditWalletRecoveryAdd = () => {
    setRecoveryEdit(!showRecoveryEdit);
  };

  const Nftpush = (props) => {
    // console.log(props);
    props.map((item) => {
      const nft = JSON.parse(item.metadata);
      // console.log(nft);
      if (
        !nftData.find(
          (item) => nftData["block_number"] === item["block_number"]
        )
      )
        setNftData((prev) => [...prev, item]);
      // nftData.push([item]);
      // console.log(nftData);
      return nftData;
    });

    // console.log(nftData);
  };
  const fetchNfts = async (a) => {
    let url = "https://deep-index.moralis.io/api/v2/" + address + "/nft";
    const options = {
      method: "GET",
      url: url,
      params: {
        chain: "mumbai",
        format: "decimal",
        normalizeMetadata: "false",
      },
      headers: {
        accept: "application/json",
        "X-API-Key":
          "sNXC9N5fpBJzWtV0sNHUAOfAyeQDGjfZ01RBZebMLmW2YAOoLgr2ItMow7rVj5Xb",
      },
    };

    await axios
      .request(options)
      .then(function (response) {
        // console.log(response.data.result);
        // Nftpush(response.data.result);
        for (let i = 0; i < response.data.result.length; i++) {
          // const nft = JSON.parse(item.metadata);
          // console.log(nft);
          if (
            !nftData.find(
              (temp) =>
                response.data.result[i]["block_number"] === temp["block_number"]
            )
          ) {
            nftData.push(response.data.result[i]);
          }
          // nftData.push([item]);
        }
        setNftData(nftData);
        console.log(nftData);
        setnftShow(true);
        // setShowAllNfts(true);
        // console.log("inside the api function");
      })
      .catch(function (error) {
        console.error(error);
      });
    // get nft api ends
  };

  // useEffect(() => {
  //   // get nft from wallet address
  //   // Moralis get nft api
  //   // if (dataFetchedRef) return;

  //   fetchNfts();

  //   if (address) {
  //     setProfileComponent(true);
  //   } else {
  //     navigate("/");
  //   }
  //   return () => {
  //     // dataFetchedRef.current = true;
  //     setShowAllNfts(false);
  //   };
  // }, []);

  useEffect(() => {
    if (location.state) {
      if (location.state.component === "nominee") {
        setShowAllNominees(true);
        setShowAllNfts(false);
        setShowAllTokens(false);
      } else if (location.state.component === "token") {
        setShowAllTokens(true);
        setShowAllNominees(false);
        setShowAllNfts(false);
      } else if (location.state.component === "nfts") {
        fetchNfts(true);
        setShowAllNfts(true);
        setShowAllTokens(false);
        setShowAllNominees(false);
      }
    } else {
      setShowAllNfts(true);
      setShowAllTokens(false);
      setShowAllNominees(false);
    }
  }, []);

  useEffect(() => {
    if (address) {
      setProfileComponent(true);
    } else {
      navigate("/");
    }
    return () => {
      // dataFetchedRef.current = true;
      setShowAllNfts(false);
    };
  }, [address]);

  useEffect(() => {
    fetchNfts();
  }, [showAllNfts]);

  if (showProfileComponent && !isLoading) {
    if (showEditProfile) {
      return (
        <EditProfile setShowEditProfile={setShowEditProfile} data={data} />
      );
    } else if (showRecoveryEdit) {
      return (
        <EditWalletRecoveryAdd setRecoveryEdit={setRecoveryEdit} data={data} />
      );
    } else {
      return (
        <>
          <Navbar userData={data[0][2]} />
          <section className="profile-main">
            <div className="profile-first-section">
              <div className="profile-cover-section">
                <div className="inside-cover-section">
                  <img className="profile-cover-img" src={coverimg} alt="" />
                </div>
              </div>
              <div className="profile-card">
                <div className="profile-card-inside">
                  <div className="image-parent">
                    <div className="image-child">
                      <img
                        src={data[0][2]}
                        width="176px"
                        height="176px"
                        alt="profileimage"
                      />
                    </div>
                  </div>
                  <div className="user-profile">
                    <h1>{data[0][0]}</h1>
                    <p className="address-p">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#000000"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M10 16V8c0-1.1.89-2 2-2h9V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-1h-9c-1.11 0-2-.9-2-2zm3-8c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h9V8h-9zm3 5.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                      </svg>
                      <span>
                        {address.substring(0, 6) +
                          "..." +
                          address.substring(address.length - 5, address.length)}
                      </span>
                      <svg
                        className="copy-address"
                        xmlns="http://www.w3.org/2000/svg"
                        enableBackground="new 0 0 24 24"
                        height="18px"
                        viewBox="0 0 24 24"
                        width="18px"
                        fill="#000000"
                      >
                        <g>
                          <rect fill="none" height="24" width="24" />
                        </g>
                        <g>
                          <path d="M15,20H5V7c0-0.55-0.45-1-1-1h0C3.45,6,3,6.45,3,7v13c0,1.1,0.9,2,2,2h10c0.55,0,1-0.45,1-1v0C16,20.45,15.55,20,15,20z M20,16V4c0-1.1-0.9-2-2-2H9C7.9,2,7,2.9,7,4v12c0,1.1,0.9,2,2,2h9C19.1,18,20,17.1,20,16z M18,16H9V4h9V16z" />
                        </g>
                      </svg>
                    </p>
                    <p className="email-p">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#000000"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-.4 4.25l-7.07 4.42c-.32.2-.74.2-1.06 0L4.4 8.25c-.25-.16-.4-.43-.4-.72 0-.67.73-1.07 1.3-.72L12 11l6.7-4.19c.57-.35 1.3.05 1.3.72 0 .29-.15.56-.4.72z" />
                      </svg>{" "}
                      <span>{data[0][1]}</span>
                    </p>
                    <div className="recovery-address">
                      {"Recovery Address "}
                      {recoveryAddress ? (
                        <>
                          <span>
                            {address.substring(0, 6) +
                              "..." +
                              address.substring(
                                address.length - 5,
                                address.length
                              )}
                          </span>
                          <svg
                            className="copy-address"
                            xmlns="http://www.w3.org/2000/svg"
                            height="18px"
                            viewBox="0 0 24 24"
                            width="18px"
                            fill="#000000"
                          >
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                          </svg>
                        </>
                      ) : (
                        <button
                          className="add-recovery"
                          onClick={() => toggleEditWalletRecoveryAdd()}
                        >
                          Add Recovery Address
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    className="profile-edit-button"
                    onClick={() => {
                      // navigate("/edit-profile", {
                      //   state: {
                      //     name: data[0][0],
                      //     email: data[0][1],
                      //     profile_cid: data[0][3],
                      //   },
                      // });
                      toggleEditProfile();
                    }}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
            <div className="profile-second-section">
              <div className="profile-navbar">
                <button
                  className={showAllNfts ? "active" : ""}
                  onClick={() => {
                    setShowAllNfts(true);
                    setShowAllTokens(false);
                    setShowAllNominees(false);
                  }}
                >
                  Collectibles
                </button>
                <button
                  className={showAllTokens ? "active" : ""}
                  onClick={() => {
                    setShowAllNfts(false);
                    setShowAllTokens(true);
                    setShowAllNominees(false);
                  }}
                >
                  Tokens
                </button>
                <button
                  className={showAllNominees ? "active" : ""}
                  onClick={() => {
                    setShowAllNfts(false);
                    setShowAllTokens(false);
                    setShowAllNominees(true);
                  }}
                >
                  Nominees
                </button>
                {/* <button></button> */}
              </div>
              {showAllNfts && nftShow ? <AllNfts nftData={nftData} /> : null}
              {showAllTokens ? <Tokens /> : null}
              {showAllNominees ? <NomineesList /> : null}
            </div>
          </section>
        </>
      );
    }
  }
}

export default Profile;
