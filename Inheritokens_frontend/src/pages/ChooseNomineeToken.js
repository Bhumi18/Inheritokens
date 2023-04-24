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
import LoadingForTrans from "../components/LoadingForTrans";
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
  const [loader, setLoader] = useState({
    status: false,
    msg: "Waiting for transaction approval...",
    info: "",
  });
  // const [showNominatedArrChanged, setNominatedArrChanged] = useState(1);

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
      setLoader({ ...loader, status: true });
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
        setLoader({
          status: true,
          msg: "Waiting for approval of the token...",
          info: "",
        });
        const approvalOfSelectedToken = await approveSelectedToken(
          tokenDetails.token_address
        );

        // await approvalOfSelectedToken.wait();
        console.log(approvalOfSelectedToken);
      }
      setLoader({
        status: true,
        msg: "Waiting for approval of the USDC...",
        info: "",
      });
      const approveUSDCtx = await approveUSDCToken();
      // await approveUSDCtx.wait();
      setLoader({
        status: true,
        msg: "Waiting for transaction approval...",
        info: "",
      });
      const tx = await token_contract.assignTokensToMultipleNominees(
        tokenDetails.token_address, // token address
        tokenDetails.token_name, // token name
        arr
      );
      await tx.wait();
      setLoader({ status: false, msg: "Transaction broadcasted", info: "" });
      console.log(tx);
    } catch (error) {
      console.log(error.message);
      setLoader({
        status: false,
        info: "",
        msg: "",
      });
    }
  };

  useEffect(() => {
    // get nominated data on load
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
      {loader.status ? (
        <LoadingForTrans loader={loader} setLoader={setLoader} />
      ) : (
        ""
      )}
    </>
  );
}

export default ChooseNomineeToken;
