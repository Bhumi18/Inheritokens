import React from "react";
import axios from "axios";
import { useAccount } from "wagmi";
import coverimg from "../assets/images/coverfornominee.png";
import "../styles/profile.scss";
import Navbar from "../components/Navbar";
import defaultprofileimage from "../assets/images/defaultprofileimage.png";
import AllNfts from "../components/AllNfts";
import { useState } from "react";
import Tokens from "../components/Tokens";
import EditProfile from "./EditProfile";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NomineesList from "../components/NomineesList";
import { useReducer } from "react";
import { useRef } from "react";
import { ethers } from "ethers";
import contract from "../artifacts/Main.json";
export const CONTRACT_ADDRESS = "0xaEF8eb4EDCB0177A5ef6a5e3f46E581a5908eef4";
export const BTTC_ADDRESS = "0xB987640A52415b64E2d19109E8f9d7a3492d5F54";

function Profile() {
  const dataFetchedRef = useRef(false);
  const [nftData, setNftData] = useState([]);
  const [nftInfo, setNftInfo] = useState([{ token_address: "", token_id: "" }]);
  const { address, isConnected } = useAccount("");
  const navigate = useNavigate();
  // const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [showProfileComponent, setProfileComponent] = useState(false);
  const [showAllNfts, setShowAllNfts] = useState(false);
  const [showAllTokens, setShowAllTokens] = useState(false);
  const [showAllNominees, setShowAllNominees] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
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
    showProfile();
  }, []);

  const toggleEditProfile = () => {
    setShowEditProfile(!showEditProfile);
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
  const fetchNfts = async () => {
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
        // console.log(nftData);
        setShowAllNfts(true);
        // console.log("inside the api function");
      })
      .catch(function (error) {
        console.error(error);
      });
    // get nft api ends
  };

  useEffect(() => {
    // get nft from wallet address
    // Moralis get nft api
    // if (dataFetchedRef) return;

    fetchNfts();

    if (address) {
      setProfileComponent(true);
    } else {
      navigate("/");
    }
    return () => {
      // dataFetchedRef.current = true;
      setShowAllNfts(false);
    };
  }, []);

  useEffect(() => {
    fetchNfts();

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

  if (showProfileComponent && !isLoading) {
    if (showEditProfile) {
      return (
        <EditProfile setShowEditProfile={setShowEditProfile} data={data} />
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
                    <p>{data[0][1]}</p>
                    <p>{address}</p>
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
              {showAllNfts ? <AllNfts nftData={nftData} /> : null}
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
