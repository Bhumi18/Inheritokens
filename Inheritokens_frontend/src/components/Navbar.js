import React, { useEffect, useState } from "react";
import "../styles/navbar.scss";
import { useAccount } from "wagmi";
// import profilepic1 from "";
import profilepic1 from "../assets/images/defaultprofileimage.png";
import logo from "../assets/images/interitokenslogo2.png";
import ConnectWalletNavbar from "./ConnectWalletNavbar";
import { ethers } from "ethers";
import contract from "../artifacts/Main.json";
import { Link } from "react-router-dom";
export const CONTRACT_ADDRESS = "0xaEF8eb4EDCB0177A5ef6a5e3f46E581a5908eef4";
export const BTTC_ADDRESS = "0xB987640A52415b64E2d19109E8f9d7a3492d5F54";

function Navbar({ userData }) {
  const [data, setData] = useState([]);
  const { address, isConnected } = useAccount("");
  const [isLoading, setLoading] = React.useState(true);
  // const [walletAdd, setWalletAdd] = useState(
  //   "0x054ae6107caadc187c304de87365bc52f8c2adb9"
  // );

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
          data.push([owner_details[0], owner_details[1], url]);
          setData(data);
          // console.log(data);
          setLoading(false);
          // console.log(data[0][2]);
        } else if (chainId === 1029) {
          const con = new ethers.Contract(BTTC_ADDRESS, contract, signer);
          const owner_details = await con.getOwnerDetails(address);
          // console.log(owner_details);
          const url = "https://ipfs.io/ipfs/" + owner_details[2];
          data.push([owner_details[0], owner_details[1], url]);
          setData(data);
          // console.log(data);
          setLoading(false);
          // console.log(data[0][2]);
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
  }, [address]);
  if (!isLoading)
    return (
      <>
        <div className="navbar">
          <div className="navbar-inside">
            <div className="navbar-main">
              <Link to="/">
                <img className="logo" src={logo} alt="logo" />
              </Link>
              {/* <h1 className="navbar-h1">
              <span>INHERITOKENS</span>
            </h1> */}
              <div className="profile-wallet-section">
                <div className="wallet-address">
                  {/* <span>
                  {walletAdd.substring(0, 6) +
                    "..." +
                    walletAdd.substring(walletAdd.length - 5, walletAdd.length)}
                </span> */}
                  <ConnectWalletNavbar />
                </div>
                <Link to="/user/profile">
                  {data[0][2] !== "https://ipfs.io/ipfs/" ? (
                    <img
                      className="profile-icon"
                      src={data[0][2]}
                      alt="profileicon"
                    />
                  ) : (
                    <img
                      className="profile-icon"
                      src={profilepic1}
                      alt="profileicon"
                    />
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  else
    return (
      <>
        <div className="navbar">
          <div className="navbar-inside">
            <div className="navbar-main">
              <img className="logo" src={logo} alt="logo" />
              {/* <h1 className="navbar-h1">
        <span>INHERITOKENS</span>
      </h1> */}
              <div className="profile-wallet-section">
                <div className="wallet-address">
                  {/* <span>
            {walletAdd.substring(0, 6) +
              "..." +
              walletAdd.substring(walletAdd.length - 5, walletAdd.length)}
          </span> */}
                  <ConnectWalletNavbar />
                </div>
                <Link to="/user/profile">
                  <img
                    className="profile-icon"
                    src={profilepic1}
                    alt="profileicon"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}

export default Navbar;
