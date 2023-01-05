import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/home.scss";
import { useAccount } from "wagmi";
import ConnectWallet from "../components/ConnectWallet";

import bg1 from "../assets/images/background_copy.svg";
import avatar2 from "../assets/images/Avatar_1.svg";
import avatar1 from "../assets/images/Avatar_2.svg";
import avatar3 from "../assets/images/Avatar_3.svg";
import purplecharacter from "../assets/images/purple_character.svg";
import wallet01 from "../assets/images/wallet_1.svg";
import wallet02 from "../assets/images/wallet_2.svg";
import art2 from "../assets/images/Abstract-3d-art-background-1.png";
import art1 from "../assets/images/Abstract-3d-art-background-2.png";
import bitcoin from "../assets/images/Bitcoin.svg";
import neocoin from "../assets/images/neocoin.svg";
import tethercoin from "../assets/images/tether.svg";
import ecoin from "../assets/images/ethereum.svg";
import item1 from "../assets/images/1.png";
import item2 from "../assets/images/2.png";
import item3 from "../assets/images/3.png";
import arrow from "../assets/images/yellow_arrow.svg";
import logo from "../assets/images/interitokenslogo2.png";
import { useState } from "react";
import { ethers } from "ethers";
import contract from "../artifacts/Main.json";
import { useRef } from "react";
export const CONTRACT_ADDRESS = "0xaEF8eb4EDCB0177A5ef6a5e3f46E581a5908eef4";
export const BTTC_ADDRESS = "0xB987640A52415b64E2d19109E8f9d7a3492d5F54";

function Home() {
  const { address, isConnected } = useAccount();
  const [checkAddress, setCheckAddress] = useState();
  const [isRegistered, setIsRegistered] = useState(false);

  const navigate = useNavigate();

  const walletButtonRef = React.createRef();

  var data = JSON.stringify({
    address: address,
  });

  useEffect(() => {
    if (isConnected) {
      var config = {
        method: "post",
        url: `${process.env.REACT_APP_URL}checkAddress`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios(config)
        .then(function (response) {
          // console.log(JSON.stringify(response.data));
          console.log(response.data.status);
          // if (response.data.status === 0) {
          //   navigate("/signup");
          // } else if (response.data.status === 1) {
          //   navigate("/verify/email");
          // } else if (response.data.status === 2) {
          //   navigate("/user/profile");
          // }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [address, data, isConnected]);

  const getStarted = () => {
    // console.log(checkAddress);
    if (isConnected) {
      checkRegister();
      // if (isRegistered) {
      //   navigate("/user/profile");
      // } else {
      //   navigate("/signup");
      // }
      // var config = {
      //   method: "post",
      //   url: `${process.env.REACT_APP_URL}checkAddress`,
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   data: data,
      // };
      // axios(config)
      //   .then(function (response) {
      //     // console.log(JSON.stringify(response.data));
      //     console.log(response.data.status);
      //     setCheckAddress(response.data.status);
      //     if (response.data.status === 0) {
      //       navigate("/signup");
      //     }
      //     // else if (response.data.status === 1) {
      //     //   navigate("/verify/email");
      //     // }
      //     else if (response.data.status === 1) {
      //       navigate("/user/profile");
      //     }
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });
      // console.log(address);
      // if (checkAddress === 0) {
      //   navigate("/signup");
      // }
      // else if (checkAddress === 1) {
      //   navigate("/verify/email");
      // }
      // else if (checkAddress === 2) {
      //   navigate("/user/profile");
      // }
    } else {
      const connectWalletbtn = document.getElementById("connect-wallet");
      connectWalletbtn.click();
    }
  };

  const checkRegister = async () => {
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
          const address_array = await con.getOwners();
          let check = false;
          for (let i = 0; i < address_array.length; i++) {
            if (address_array[i] === address) {
              console.log("registering");
              check = true;
              break;
            }
          }
          if (check === false) {
            navigate("/signup");
          } else {
            navigate("/user/profile");
          }
          // console.log(data);
        } else if (chainId === 1029) {
          alert("You are connected to BTTC");
          const con = new ethers.Contract(BTTC_ADDRESS, contract, signer);
          const address_array = await con.getOwners();
          let check = false;
          for (let i = 0; i < address_array.length; i++) {
            if (address_array[i] === address) {
              console.log("registering");
              check = true;
              break;
            }
          }
          if (check === false) {
            navigate("/signup");
          } else {
            navigate("/user/profile");
          }
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

  return (
    <>
      <section className="home-main">
        <div className="home-navbar">
          <div className="navbar-menu">
            {/* <ul>
              
                <li className="logo-li">Inheritokens</li>
              
            </ul> */}
            <Link to="/">
              <img className="logo-image" src={logo} alt="logo" />
            </Link>
          </div>
          {/* <ConnectKitButton /> */}
          <ConnectWallet />
          {/* <button className="home-connect-btn" onClick={togglePopup}>
            Connect Wallet
          </button> */}
        </div>
        <section className="home-hero">
          <img className="bg-first" src={bg1} alt="background_image" />
          <div className="inside-hero-first">
            <h1 className="home-h1-1">
              Nominate your heir with
              <span className="home-h1-2">Inheritokens</span>
            </h1>
            <p className="home-first-p">
              Inheritokens allows you to nominate a successor to your assets
              before your demise. This project aims to keep the flow of tokens
              and NFTs around the web3.{" "}
            </p>
            <div className="home-avatar">
              <div className="avatars">
                <img src={avatar1} width="52px" alt="avatar1" loading="lazy" />
                <img src={avatar2} width="52px" alt="avatar2" loading="lazy" />
                <img src={avatar3} width="52px" alt="avatar3" loading="lazy" />
              </div>
              <button
                className="home-hero-button"
                onClick={() => {
                  // navigate("/user/profile");

                  getStarted();
                }}
              >
                Get Started
              </button>
            </div>
            {/* <h1>Hello</h1> */}
          </div>
          <div className="inside-hero-second">
            <div className="inside-hero-inside-second">
              <div className="hero-inside-second-img">
                <img src={purplecharacter} alt="character" />
              </div>
              <div>
                <h3>NFT</h3>
              </div>
              <div className="hero-inside-second-btn-div">
                <button className="hero-inside-second-button-1">
                  Add Nominee
                </button>
                <button className="hero-inside-second-button-2">
                  Change Nominee
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="home-second">
          <img className="abstarct-img-1" src={art1} alt="artimage" />
          <img className="abstarct-img-2" src={art2} alt="artimage" />
          <h1 className="home-h2-1">
            <span className="home-h2-2">Inheritokens</span> works like...
          </h1>
          <div className="process-div">
            <ul>
              <li>
                We monitor account activity and beware of 6 months of
                inactivity.
              </li>
              <li>We send an email to the account holder</li>
              <li>
                If we receive a reply, the assets are yours. Else, it transfers
                to your heir
              </li>
              <li>
                The heir has to come over to our portal to claim their new-found
                treasure!
              </li>
              <li>
                There is no step 5, we're just waiting for you to start
                connecting your wallet and fill in the deets of your email ID
                and your nominee. Go NOW!{" "}
                <span>
                  (
                  <Link
                    onClick={() =>
                      window.open(
                        "https://miro.com/app/board/uXjVPEfwh8I=/?share_link_id=246981492604"
                      )
                    }
                  >
                    Learn more
                  </Link>
                  )
                </span>
              </li>
            </ul>
          </div>
          <div className="inside-second">
            <div className="inside-second-inside-three">
              <img
                className="wallet-image"
                src={wallet01}
                alt="walletimage"
                loading="lazy"
              />
            </div>
            <div className="inside-second-inside-three">
              <div className="two">
                <img src={bitcoin} alt="" className="bitcoin" loading="lazy" />
                <img src={neocoin} alt="" className="neocoin" loading="lazy" />
                <img
                  src={tethercoin}
                  alt=""
                  className="tethercoin"
                  loading="lazy"
                />
                <img
                  src={ecoin}
                  alt=""
                  className="ethereumcoin"
                  loading="lazy"
                />
                <img src={item1} alt="" className="nft-1" loading="lazy" />
                <img src={item2} alt="" className="nft-2" loading="lazy" />
                <img src={item3} alt="" className="nft-3" loading="lazy" />
                <img src={arrow} alt="" className="arrow" loading="lazy" />
              </div>
            </div>
            <div className="inside-second-inside-three">
              <img
                className="wallet-image"
                src={wallet02}
                alt="walletimage"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
export default Home;
