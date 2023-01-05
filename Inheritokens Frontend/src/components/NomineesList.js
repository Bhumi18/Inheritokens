import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Nominees } from "./dummyNominees";
import "../styles/nomineeslist.scss";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import contract from "../artifacts/Main.json";
export const CONTRACT_ADDRESS = "0xaEF8eb4EDCB0177A5ef6a5e3f46E581a5908eef4";
export const BTTC_ADDRESS = "0xB987640A52415b64E2d19109E8f9d7a3492d5F54";

function NomineesList() {
  const navigate = useNavigate();
  const walletAdd = "0x054ae6107caadc187c304de87365bc52f8c2adb9";
  const { address, isConnected } = useAccount();
  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = useState([]);

  const showNominees = async () => {
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
          const address_array = await con.getNominees(address);
          // console.log(address_array);
          for (let i = 0; i < address_array.length; i++) {
            // console.log(address_array[i]);
            const nominee_details = await con.getNomineeDetails(
              address_array[i]
            );
            // console.log(nominee_details[0]);
            // console.log(nominee_details[1]);
            // console.log(nominee_details[2]);
            const url = "https://ipfs.io/ipfs/" + nominee_details[2];
            if (!data.find((item) => nominee_details[0] === item[0])) {
              data.push([
                nominee_details[0],
                nominee_details[1],
                url,
                nominee_details[3],
              ]);
            }
          }
          setData(data);
          // console.log(data);
          setLoading(false);
        } else if (chainId === 1029) {
          const con = new ethers.Contract(BTTC_ADDRESS, contract, signer);
          const address_array = await con.getNominees(address);
          // console.log(address_array);
          for (let i = 0; i < address_array.length; i++) {
            // console.log(address_array[i]);
            const nominee_details = await con.getNomineeDetails(
              address_array[i]
            );
            // console.log(nominee_details[0]);
            // console.log(nominee_details[1]);
            // console.log(nominee_details[2]);
            const url = "https://ipfs.io/ipfs/" + nominee_details[2];
            if (!data.find((item) => nominee_details[0] === item[0])) {
              data.push([
                nominee_details[0],
                nominee_details[1],
                url,
                nominee_details[3],
              ]);
            }
          }
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
    showNominees();
  }, []);

  if (data.length > 0) {
    return (
      <>
        <div className="nominees-main">
          <div className="add-nominee">
            <button
              className="add-nominee-btn"
              onClick={() => {
                navigate("/add-nominee");
              }}
            >
              Add Nominee
            </button>
          </div>
          {data.map((item, key) => {
            return (
              <div className="nominees-container" key={key}>
                <div className="nominees-profile">
                  <img
                    src={item[2]}
                    alt="nominee_profile_image"
                    width="64px"
                    height="64px"
                  />
                </div>
                <div className="nominees-details">
                  <h2>{item[0]}</h2>
                  <p>{item[1]}</p>
                  <p>
                    {item[3].substring(0, 6) +
                      "..." +
                      item[3].substring(item[3].length - 5, item[3].length)}
                  </p>
                </div>
                <div className="nominees-last">
                  <button
                    onClick={() => {
                      navigate("/edit-nominee", {
                        state: {
                          name: item[0],
                          email: item[1],
                          walletAddress: item[3],
                          profile_cid: item[2],
                        },
                      });
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="nominees-main">
          <div className="nominees-container">
            <div className="nominees-details">
              <h2>You have 0 nominees added.</h2>
              <p>Please add nominee to display here.</p>
            </div>
            <div className="nominees-last">
              <button
                onClick={() => {
                  navigate("/add-nominee");
                }}
              >
                Add Nominee
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default NomineesList;
