import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { chainId, useAccount, useNetwork } from "wagmi";
import Navbar from "../components/Navbar";
import image from "../assets/images/defaultprofileimage.png";
import "../styles/ChooseNomineeToken.scss";

import TokenNomineeDetails from "../components/TokenNomineeDetails";
import NomineesListPopupForToken from "../components/NomineesListPopupForToken";
import UpdateOrViewNominees from "../components/UpdateOrViewNominees";
import GetOrdinal from "../components/GetOrdinal";
import contract from "../artifacts/Main.json";
import { ethers } from "ethers";
import Footer from "../components/Footer";
import {
  tokenContractInstance,
  approveUSDCToken,
  approveSelectedToken,
  inheritokensInstance,
} from "../components/Contracts";
export const CONTRACT_ADDRESS = "0xaEF8eb4EDCB0177A5ef6a5e3f46E581a5908eef4";
export const BTTC_ADDRESS = "0xB987640A52415b64E2d19109E8f9d7a3492d5F54";

function ChooseNomineeToken() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [allNomiees, setAllNomiees] = useState(true);
  const [allCharities, setAllCharities] = useState(false);
  const [showTokenNomineeDetails, setTokenNomineeDetails] = useState(false);
  const [showNomineesListPopUp, setNomineesListPopUp] = useState(false);
  const [showNomineesListPopUp2, setNomineesListPopUp2] = useState(false);
  const [showNomineesListPopUp3, setNomineesListPopUp3] = useState(false);
  const [showNomineesUpdate, setNomineesUpdate] = useState(false);
  const [totalUsedRatio, setTotalUsedRatio] = useState(0);
  const [indexNumber, setIndexNumber] = useState({ parent: "", child: "" });
  const [nomineeDetail, setNomineeDetail] = useState({
    img: "",
    name: "",
    email: "",
    w_add: "",
  });
  const [arr, setArr] = useState([]);
  const [nominatedArr, setNominatedArr] = useState([]);
  const [arrChanged, setArrChanged] = useState(1);
  const [data, setData] = useState([]);
  // const [showNominatedArrChanged, setNominatedArrChanged] = useState(1);

  // const printArr = () => {
  //   console.log(arr);
  // };
  // const handleAddElement = (item) => {
  //   nominatedArr.push(item);
  //   arr.splice(arr.indexOf(item), 1);
  //   printArr();
  //   setArrChanged((prev) => prev + 1);
  // };
  // const handleRestoreElement = (key) => {
  //   arr.push(nominatedArr[key]);
  //   nominatedArr.splice(key, 1);
  //   setArrChanged((prev) => prev + 1);
  // };
  const handleParentDelete = (key, k, ratio) => {
    // console.log("key", key, "k", k);
    nominatedArr[key].ratio = nominatedArr[key].ratio - ratio;
    setTotalUsedRatio((prev) => prev - ratio);
    nominatedArr[key].nominees.splice(k, 1);
    if (nominatedArr[key].nominees.length === 0) {
      nominatedArr.splice(key, 1);
    }
    setArrChanged((prev) => prev + 1);
  };
  // const handleMoveUpElement = (key) => {
  //   var element = nominatedArr[key];
  //   nominatedArr.splice(key, 1);
  //   nominatedArr.splice(key - 1, 0, element);
  //   setArrChanged((prev) => prev + 1);
  //   printArr();
  // };
  // const handleMoveDownElement = (key) => {
  //   var element = nominatedArr[key];
  //   nominatedArr.splice(key, 1);
  //   nominatedArr.splice(key + 1, 0, element);
  //   setArrChanged((prev) => prev + 1);
  //   printArr();
  // };

  const [searchField, setSearchField] = useState("");
  const handleChange = (e) => {
    setSearchField(e.target.value);
  };
  const filteredPersons = arr.filter((person) => {
    return (
      person.name.toLowerCase().includes(searchField.toLowerCase()) ||
      person.email.toLowerCase().includes(searchField.toLowerCase()) ||
      person.w_add.toLowerCase().includes(searchField.toLowerCase())
    );
  });

  function searchList() {
    const filtered = filteredPersons.map((person, key) => (
      <tr key={key}>
        <td>
          <div className="nominee-details">
            <img src={person.img} alt="nfts" className="nominee-profile" />

            <div className="inside-choose-nominee">
              <h2>{person.name}</h2>
              <p>{person.email}</p>
              <p>
                {/* {person.w_add} */}
                {person.w_add.substring(0, 5) +
                  "..." +
                  person.w_add.substring(
                    person.w_add.length - 4,
                    person.w_add.length
                  )}
              </p>
            </div>
          </div>
        </td>
        <td className="add-this">
          {/* <span
            className="action-btn"
            onClick={() => {
              setNomineeDetail({
                img: person.img,
                name: person.name,
                email: person.email,
                w_add: person.w_add,
              });
              setTokenNomineeDetails(true);
            }}
          >
            Add this
          </span> */}
        </td>
      </tr>
    ));
    return filtered;
  }

  const [tokenDetails, setTokenDetails] = useState({
    token_address: "",
    token_name: "",
    token_symbol: "",
    token_balance: "",
  });
  // console.log(location.state);

  useEffect(() => {
    if (location.state.item) {
      let td = location.state.item;
      // console.log(td);
      setTokenDetails({
        token_address: td.token_address,
        token_name: td.token_name,
        token_symbol: td.token_symbol,
        token_balance: td.token_balance,
        token_decimals: td.token_decimals,
      });
    }
    setArr(data);
  }, []);

  useEffect(() => {
    console.log(nominatedArr);
    // console.log(indexNumber);
  });

  useEffect(() => {
    if (!address) navigate("/");
  }, [address, navigate]);

  const assignTokenNominee = async () => {
    try {
      const token_contract = await tokenContractInstance();
      let arr = [];
      for (let i = 0; i < nominatedArr.length; i++) {
        for (let j = 0; j < nominatedArr[i].nominees.length; j++) {
          let multipleNominee = [];
          for (
            let k = 0;
            k < nominatedArr[i].nominees[j].priority_nominees.length;
            k++
          ) {
            multipleNominee.push(
              nominatedArr[i].nominees[j].priority_nominees[k].w_add
            );
          }
          arr.push([
            parseFloat(nominatedArr[i].nominees[j].single_nominee_ratio),
            "0x0F0c3d49bcf3E9eDcB504672c0f795c377874ebc",
            nominatedArr[i].nominees[j].priority_nominees[0].w_add,
            multipleNominee,
            false,
            "",
          ]);
        }
      }
      console.log(arr);
      if (location.state.isNominated) {
        // approve selected token function if already approved selected token is less than available balance
        // not required to approve selected token as we already approved more than enough token right now
      } else {
        const approvalOfSelectedToken = await approveSelectedToken(
          tokenDetails.token_address
        );
        // await approvalOfSelectedToken.wait();
        console.log(approvalOfSelectedToken);
      }
      const approveUSDCtx = await approveUSDCToken();
      // await approveUSDCtx.wait();
      const tx = await token_contract.assignTokensToMultipleNominees(
        tokenDetails.token_address, // token address
        tokenDetails.token_name, // token name
        arr
      );
      await tx.wait();
      console.log(tx);
    } catch (error) {
      console.log(error.message);
    }
  };

  // get nominated data
  // const getNominatedData = async () => {
  //   try {
  //     const token_contract = await tokenContractInstance();
  //     const data = await token_contract.getAllStructs(
  //       address,
  //       tokenDetails.token_address
  //     );
  //     console.log(data);

  //     for (let i = 0; i < data.length; i++) {
  //       console.log("inside the function");
  //       let nomineesDetails = [];
  //       const con2 = await inheritokensInstance();
  //       console.log(data[i][3]);
  //       for (let j = 0; j < data[i][3].length; j++) {
  //         console.log(data[i][3][j]);
  //         const nominee_details = await con2.addressToNominee(
  //           address,
  //           data[i][3][j]
  //         );
  //         console.log(nominee_details);
  //         nomineesDetails.push(nominee_details);
  //       }

  //       nominatedArr.push({
  //         nominees: [
  //           {
  //             priority_nominees: nomineesDetails,
  //             single_nominee_ratio: parseInt(data[i][0]),
  //           },
  //         ],
  //       });
  //       console.log(nominatedArr);
  //       console.log(nominatedArr);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  useEffect(() => {
    const getNominatedData = async () => {
      try {
        const token_contract = await tokenContractInstance();
        const data = await token_contract.getAllStructs(
          address,
          tokenDetails.token_address
        );
        console.log(data);
        let tempArr = [];
        for (let i = 0; i < data.length; i++) {
          console.log("inside the function");
          let nomineesDetails = [];
          const con2 = await inheritokensInstance();
          console.log(data[i][3]);
          if (tempArr.length < data.length) {
            for (let j = 0; j < data[i][3].length; j++) {
              console.log(data[i][3][j]);
              const nominee_details = await con2.addressToNominee(
                address,
                data[i][3][j]
              );
              console.log(nominee_details);
              nomineesDetails.push({
                name: nominee_details[0],
                email: nominee_details[1],
                img: "https://ipfs.io/ipfs/" + nominee_details[2],
                w_add: nominee_details[3],
              });
            }

            tempArr.push({
              nominees: [
                {
                  priority_nominees: nomineesDetails,
                  single_nominee_ratio: parseInt(data[i][0]),
                },
              ],
              ratio: parseInt(data[i][0]),
            });
            setTotalUsedRatio((prev) => prev + parseInt(data[i][0]));
          }
          // console.log(nominatedArr);
          console.log(tempArr);
        }
        setNominatedArr(tempArr);
        // setArrChanged((prev) => prev + 1);
      } catch (err) {
        console.log(err);
      }
    };
    if (address) {
      getNominatedData();
    }
  }, [address, tokenDetails.token_address]);

  return (
    <>
      <Navbar />
      <section className="token-nominee-main">
        <div className="hero-section">
          <div
            className="go-back"
            onClick={() =>
              navigate("/user/profile", { state: { component: "token" } })
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
            >
              <path d="M0 0h24v24H0V0z" fill="none" opacity=".87" />
              <path d="M16.62 2.99c-.49-.49-1.28-.49-1.77 0L6.54 11.3c-.39.39-.39 1.02 0 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.38 12l7.25-7.25c.48-.48.48-1.28-.01-1.76z" />
            </svg>
            <span>Back</span>
          </div>
          <div className="sub-hero">
            <div className="sub-hero-left">
              <span>{tokenDetails ? tokenDetails.token_symbol : ""}</span>
            </div>
            <div className="sub-hero-right">
              <span className="chain-name">{chain.name}</span>
              <div className="token-details">
                <span className="token-sub">Balance</span>
                <div className="token-balance">
                  <p className="token-balance">
                    {tokenDetails.token_balance === 0
                      ? "0"
                      : String(
                          (
                            tokenDetails.token_balance /
                            Math.pow(10, parseInt(tokenDetails.token_decimals))
                          ).toFixed(10)
                        )}
                    {/* 1200237234234920.039485734234673 */}
                    <span className="token-name">
                      {tokenDetails ? tokenDetails.token_name : ""}
                    </span>
                  </p>
                </div>
              </div>
              <div className="token-details">
                <span className="token-sub">Token Address</span>
                <span className="token-address">
                  {tokenDetails ? tokenDetails.token_address : ""}
                </span>
              </div>
              <div className="token-details">
                <span className="token-sub">Token Decimals</span>
                <span className="token-decimals">
                  {tokenDetails ? tokenDetails.token_decimals : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="second-section">
          {/* <div className="all-nominees-list">
            <div className="table-title">
              <span
                className={allNomiees ? "active" : ""}
                onClick={() => {
                  setAllNomiees(true);
                  setAllCharities(false);
                }}
              >
                All Nominees
              </span>
              <span
                className={allCharities ? "active" : ""}
                onClick={() => {
                  setAllCharities(true);
                  setAllNomiees(false);
                }}
              >
                Charities
              </span>
            </div>
            <div className="search-div">
              <input
                className="input"
                type="search"
                placeholder="Search Nominee"
                onChange={handleChange}
              />
            </div>
            <div className="table-div">
              {arr.length > 0 ? (
                <table>
                  <caption>All the Nominees list</caption>
                  <thead>
                    <tr>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>{searchList()}</tbody>
                </table>
              ) : (
                <div className="nominees-not-found">
                  <p>For this nft, no nominations were identified.</p>
                  <p>Select the nominee from the list of nominees.</p>
                  <p>
                    After adding the nominees click on save button to save the
                    details with priority
                  </p>
                </div>
              )}
            </div>
          </div> */}
          <div className="selected-nominees-list">
            <div className="table-title">
              <span className="active">Nominated</span>
              <button
                className="add-nominee"
                onClick={() => setTokenNomineeDetails(true)}
              >
                Add Nominee
              </button>
            </div>
            {/* {nominatedArr.length > 0 ? (
              <table>
                <caption>Selected Nominees list</caption>
                <thead>
                  <tr>
                    <th>Ratio</th>
                    <th>Nominees</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {arrChanged && nominatedArr.length > 0
                    ? nominatedArr.map((item, key) => {
                        return (
                          item.nominees &&
                          item.nominees.map((i, k) => {
                            return (
                              <tr key={k} className="selected-nominees">
                                <td className="ratio">
                                  {parseFloat(
                                    parseFloat(item.ratio) /
                                      item.nominees.length
                                  ).toFixed(2) + " %"}
                                </td>

                                <td className="nominee-details">
                                  {i.map((j, l) => {
                                    return (
                                      <div
                                        className="nominee-details nominated-nominee-details"
                                        key={l}
                                      >
                                        <span className="nominated-priority">
                                          {l + 1}
                                        </span>
                                        <div>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24px"
                                            viewBox="0 0 24 24"
                                            width="24px"
                                            fill="#000000"
                                            onClick={() =>
                                              handleMoveUpElement(key)
                                            }
                                          >
                                            <path
                                              d="M0 0h24v24H0V0z"
                                              fill="none"
                                            />
                                            <path d="M11.29 8.71L6.7 13.3c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 10.83l3.88 3.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.7 8.71c-.38-.39-1.02-.39-1.41 0z" />
                                          </svg>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24px"
                                            viewBox="0 0 24 24"
                                            width="24px"
                                            fill="#000000"
                                            onClick={() =>
                                              handleMoveDownElement(key)
                                            }
                                          >
                                            <path
                                              d="M24 24H0V0h24v24z"
                                              fill="none"
                                              opacity=".87"
                                            />
                                            <path d="M15.88 9.29L12 13.17 8.12 9.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0z" />
                                          </svg>
                                        </div>
                                        <img
                                          src={j.img}
                                          alt="nfts"
                                          className="nominee-profile"
                                        />

                                        <div className="inside-choose-nominee">
                                          <h2>{j.name}</h2>
                                          <p>{j.email}</p>
                                          <p>
                                            {j.w_add.substring(0, 5) +
                                              "..." +
                                              j.w_add.substring(
                                                j.w_add.length - 4,
                                                j.w_add.length
                                              )}
                                          </p>
                                        </div>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="24px"
                                          viewBox="0 0 24 24"
                                          width="24px"
                                          fill="#000000"
                                          onClick={() =>
                                            handleRestoreElement(key)
                                          }
                                        >
                                          <path
                                            d="M0 0h24v24H0V0z"
                                            fill="none"
                                          />
                                          <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
                                        </svg>
                                      </div>
                                    );
                                  })}

                                  <button
                                    onClick={() => {
                                      setIndexNumber({ parent: key, child: k });
                                      setNomineesListPopUp2(true);
                                    }}
                                  >
                                    Add priority
                                  </button>
                                </td>
                                <td>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 0 24 24"
                                    width="24px"
                                    fill="#000000"
                                  >
                                    <path d="M0 0h24v24H0V0z" fill="none" />
                                    <path d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                  </svg>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 0 24 24"
                                    width="24px"
                                    fill="#000000"
                                    onClick={() => handleParentDelete(key, k)}
                                  >
                                    <path d="M0 0h24v24H0V0z" fill="none" />
                                    <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
                                  </svg>
                                </td>
                              </tr>
                            );
                          })
                        );
                      })
                    : ""}
                </tbody>
              </table>
            ) : (
              <div className="nominees-not-found">
                <p>For this nft, no nominations were identified.</p>
                <p>Select the nominee from the list of nominees.</p>
                <p>
                  After adding the nominees click on save button to save the
                  details with priority
                </p>
              </div>
            )} */}

            {/* here ***************************************************************** */}
            {arrChanged && nominatedArr.length > 0 ? (
              nominatedArr.map((item, key) => {
                return (
                  item.nominees &&
                  item.nominees.map((i, k) => {
                    return (
                      <div key={k} className="nominated-ratio-main">
                        <div className="ratio-and-modify">
                          <span>
                            Nominated -
                            <span className="ratio">
                              {" " +
                                parseFloat(i.single_nominee_ratio).toFixed(2) +
                                " %"}
                            </span>
                          </span>
                          <div className="modify-delete">
                            <button
                              className="modify"
                              onClick={() => {
                                setIndexNumber({ parent: key, child: k });
                                setNomineesUpdate(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="delete"
                              onClick={() =>
                                handleParentDelete(
                                  key,
                                  k,
                                  parseFloat(
                                    parseFloat(item.ratio) /
                                      item.nominees.length
                                  ).toFixed(2)
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <p className="nominee-will-get">
                          Amount for Nominee:
                          <span>
                            {" " +
                              ((tokenDetails.token_balance /
                                Math.pow(
                                  10,
                                  parseInt(tokenDetails.token_decimals)
                                )) *
                                parseFloat(
                                  parseFloat(item.ratio) / item.nominees.length
                                ).toFixed(2)) /
                                100 +
                              " MATIC"}
                          </span>
                        </p>
                        <div className="table-div">
                          {i.priority_nominees.length > 0 ? (
                            <table>
                              <thead>
                                <tr>
                                  <th>Priority</th>
                                  {/* <th>Move</th> */}
                                  <th>Nominee Details</th>
                                  {/* <th></th> */}
                                </tr>
                              </thead>
                              <tbody>
                                {i.priority_nominees.map((j, l) => {
                                  if (l < 3)
                                    return (
                                      <tr key={l}>
                                        <td className="priority">
                                          {l + 1}
                                          <sup className="sup-of-priority">
                                            {GetOrdinal(l + 1)}
                                          </sup>
                                        </td>
                                        <td className="nominee-details">
                                          <div className="nominee-details">
                                            <img
                                              src={j.img}
                                              alt="nfts"
                                              className="nominee-profile"
                                            />

                                            <div className="inside-choose-nominee">
                                              <h2>{j.name}</h2>
                                              <p>{j.email}</p>
                                              <p>
                                                {j.w_add.substring(0, 5) +
                                                  "..." +
                                                  j.w_add.substring(
                                                    j.w_add.length - 4,
                                                    j.w_add.length
                                                  )}
                                              </p>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                })}
                              </tbody>
                            </table>
                          ) : (
                            ""
                          )}
                          {i.priority_nominees.length > 3 ? (
                            <div className="show-more-nominees">
                              <button
                                className="show-more"
                                onClick={() => {
                                  setIndexNumber({ parent: key, child: k });
                                  setNomineesUpdate(true);
                                }}
                              >
                                Show More
                              </button>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        {/* <button
                          onClick={() => {
                            setIndexNumber({ parent: key, child: k });
                            setNomineesListPopUp2(true);
                          }}
                        >
                          Add priority
                        </button> */}
                      </div>
                    );
                  })
                );
              })
            ) : (
              <div className="nominated-ratio-main">
                <div className="ratio-and-modify">
                  <span>
                    Nominated -<span className="ratio">{" 00.00 %"}</span>
                  </span>
                  <div className="modify-delete">
                    <button className="modify disabled">Edit</button>
                    <button className="delete disabled">Delete</button>
                  </div>
                </div>

                <p className="not-find-nominee">
                  We can't find any nominee for this token. Please add nominees
                  using "Add Nominee" button.
                </p>
              </div>
            )}

            {/* Available ratio */}
            <div>
              <span className="available-ratio">
                Available Ratio :
                {parseFloat(100 - parseFloat(totalUsedRatio)).toFixed(2)} %
              </span>
            </div>
            <div className="save-btn-div">
              <button
                className="add-nominee"
                onClick={() => setTokenNomineeDetails(true)}
              >
                Add Nominee
              </button>
              <button
                className="save-nominee"
                onClick={() => assignTokenNominee()}
              >
                Save Nominees
              </button>
            </div>
          </div>
        </div>
        {showTokenNomineeDetails ? (
          <TokenNomineeDetails
            setTokenNomineeDetails={setTokenNomineeDetails}
            nomineeDetail={nomineeDetail}
            nominatedArr={nominatedArr}
            showNomineesListPopUp={showNomineesListPopUp}
            setNomineesListPopUp={setNomineesListPopUp}
            setNominatedArrChanged={setArrChanged}
            setTotalUsedRatio={setTotalUsedRatio}
            totalUsedRatio={totalUsedRatio}
          />
        ) : (
          ""
        )}
        {showNomineesListPopUp2 ? (
          <NomineesListPopupForToken
            setNomineesListPopUp2={setNomineesListPopUp2}
            nominatedArr={nominatedArr}
            indexNumber={indexNumber}
          />
        ) : (
          ""
        )}
        {showNomineesUpdate ? (
          <UpdateOrViewNominees
            setNomineesUpdate={setNomineesUpdate}
            nominatedArr={nominatedArr}
            indexNumber={indexNumber}
            showNomineesListPopUp3={showNomineesListPopUp3}
            setNomineesListPopUp3={setNomineesListPopUp3}
          />
        ) : (
          ""
        )}
      </section>
      <Footer />
    </>
  );
}

export default ChooseNomineeToken;
