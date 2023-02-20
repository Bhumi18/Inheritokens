import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { chainId, useNetwork } from "wagmi";
import Navbar from "../components/Navbar";
import image from "../assets/images/defaultprofileimage.png";
import "../styles/ChooseNomineeToken.scss";
import TokenNomineeDetails from "../components/TokenNomineeDetails";

function ChooseNomineeToken() {
  const location = useLocation();
  const { chain } = useNetwork();
  const [allNomiees, setAllNomiees] = useState(true);
  const [allCharities, setAllCharities] = useState(false);
  const [showTokenNomineeDetails, setTokenNomineeDetails] = useState(false);
  const [nomineeDetail, setNomineeDetail] = useState({
    img: "",
    name: "",
    email: "",
    w_add: "",
  });
  const [arr, setArr] = useState([]);
  const [nominatedArr, setNominatedArr] = useState([]);
  const [arrChanged, setArrChanged] = useState(1);

  const printArr = () => {
    console.log(arr);
  };
  const handleAddElement = (item) => {
    nominatedArr.push(item);
    arr.splice(arr.indexOf(item), 1);
    printArr();
    setArrChanged((prev) => prev + 1);
  };
  const handleRestoreElement = (key) => {
    arr.push(nominatedArr[key]);
    nominatedArr.splice(key, 1);
    setArrChanged((prev) => prev + 1);
  };

  const handleMoveUpElement = (key) => {
    var element = nominatedArr[key];
    nominatedArr.splice(key, 1);
    nominatedArr.splice(key - 1, 0, element);
    setArrChanged((prev) => prev + 1);
    printArr();
  };
  const handleMoveDownElement = (key) => {
    var element = nominatedArr[key];
    nominatedArr.splice(key, 1);
    nominatedArr.splice(key + 1, 0, element);
    setArrChanged((prev) => prev + 1);
    printArr();
  };
  const data = [
    {
      img: image,
      name: "Bhumi Sadariya",
      email: "bhumi@gmail.com",
      w_add: "0xeB88DDaEdA226129a8Fisj0137B2ae35aA42A975",
    },
    {
      img: image,
      name: "Jaydip Patel",
      email: "jaydip@gmail.com",
      w_add: "0xeB88DDaEdA2261298F1b740137B2ae35aA42A975",
    },
    {
      img: image,
      name: "Lajja Vaniya",
      email: "lajja@gmail.com",
      w_add: "0xeB88DDaEdA2261298F1b740137B2ae35aA42A975",
    },
    {
      img: image,
      name: "Deepak Rathore",
      email: "deepak@gmail.com",
      w_add: "0xeB88DDaEdA2261298F1b740137B2ae35aA42A975",
    },
    {
      img: image,
      name: "Bhadresh",
      email: "bhadresh@gmail.com",
      w_add: "0xeB88DDaEdA2261298F1b740137B2ae35aA42A975",
    },
    {
      img: image,
      name: "Rahul Rajan",
      email: "rahul@gmail.com",
      w_add: "0xeB88DDaEdA2261298F1b740137B2ae35aA42A975",
    },
    {
      img: image,
      name: "Aakash Palan",
      email: "akashpalan@gmail.com",
      w_add: "0xeB88DDaEdA2261298F1b740137B2ae35aA42A975",
    },
    {
      img: image,
      name: "Adithya",
      email: "adithya@gmail.com",
      w_add: "0xeB88DDaEdA2261298F1b740137B2ae35aA42A975",
    },
    {
      img: image,
      name: "Sarvagna Kadiya",
      email: "sarvagna@gmail.com",
      w_add: "0xeB88DDaEdA2261298F1b740137B2ae35aA42A975",
    },
    {
      img: image,
      name: "Prashant Suthar",
      email: "prashant@gmail.com",
      w_add: "0xeB88DDaEdA2261298F1b740137B2ae35aA42A975",
    },
  ];
  // search bar components

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
          <span
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
          </span>
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
  console.log(location.state);

  useEffect(() => {
    if (location.state) {
      let td = location.state;
      console.log(td);
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

  return (
    <>
      <Navbar />
      <section className="token-nominee-main">
        <div className="hero-section">
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
                  </p>{" "}
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
          <div className="all-nominees-list">
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
                  <tbody>
                    {searchList()}
                    {/* {arrChanged && arr.length > 0 ? (
                    arr.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td>
                            <img
                              src={item.img}
                              alt="nfts"
                              className="nominee-profile"
                            />
                          </td>
                          <td>
                            <div className="inside-choose-nominee">
                              <h2>{item.name}</h2>
                              <p>{item.email}</p>
                              <p>
                                {item.w_add.substring(0, 5) +
                                  "..." +
                                  item.w_add.substring(
                                    item.w_add.length - 4,
                                    item.w_add.length
                                  )}
                              </p>
                            </div>
                          </td>
                          <td>
                            <button onClick={() => handleAddElement(key)}>
                              Add this
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4}>Select nominees from the left panel</td>
                    </tr>
                  )} */}
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
              )}
            </div>
          </div>
          <div className="selected-nominees-list">
            <div className="table-title">
              <span className="active">Nominated</span>
            </div>
            {nominatedArr.length > 0 ? (
              <table>
                <caption>Selected Nominees list</caption>
                <thead>
                  <tr>
                    <th>Priority</th>
                    <th>Move</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {arrChanged
                    ? nominatedArr.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td className="priority">{key + 1}</td>
                            <td className="arrows">
                              {key === 0 ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="24px"
                                  viewBox="0 0 24 24"
                                  width="24px"
                                  fill="#000000"
                                  className="disabled"
                                >
                                  <path d="M0 0h24v24H0V0z" fill="none" />
                                  <path d="M11.29 8.71L6.7 13.3c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 10.83l3.88 3.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.7 8.71c-.38-.39-1.02-.39-1.41 0z" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="24px"
                                  viewBox="0 0 24 24"
                                  width="24px"
                                  fill="#000000"
                                  onClick={() => handleMoveUpElement(key)}
                                >
                                  <path d="M0 0h24v24H0V0z" fill="none" />
                                  <path d="M11.29 8.71L6.7 13.3c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 10.83l3.88 3.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.7 8.71c-.38-.39-1.02-.39-1.41 0z" />
                                </svg>
                              )}
                              {key === nominatedArr.length - 1 ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="24px"
                                  viewBox="0 0 24 24"
                                  width="24px"
                                  fill="#000000"
                                  className="disabled"
                                >
                                  <path
                                    d="M24 24H0V0h24v24z"
                                    fill="none"
                                    opacity=".87"
                                  />
                                  <path d="M15.88 9.29L12 13.17 8.12 9.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0z" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="24px"
                                  viewBox="0 0 24 24"
                                  width="24px"
                                  fill="#000000"
                                  onClick={() => handleMoveDownElement(key)}
                                >
                                  <path
                                    d="M24 24H0V0h24v24z"
                                    fill="none"
                                    opacity=".87"
                                  />
                                  <path d="M15.88 9.29L12 13.17 8.12 9.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0z" />
                                </svg>
                              )}
                            </td>

                            <td className="nominee-details">
                              <div className="nominee-details">
                                <img
                                  src={item.img}
                                  alt="nfts"
                                  className="nominee-profile"
                                />

                                <div className="inside-choose-nominee">
                                  <h2>{item.name}</h2>
                                  <p>{item.email}</p>
                                  <p>
                                    {item.w_add.substring(0, 5) +
                                      "..." +
                                      item.w_add.substring(
                                        item.w_add.length - 4,
                                        item.w_add.length
                                      )}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 0 24 24"
                                width="24px"
                                fill="#000000"
                                onClick={() => handleRestoreElement(key)}
                              >
                                <path d="M0 0h24v24H0V0z" fill="none" />
                                <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
                              </svg>
                            </td>
                          </tr>
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
            )}
            <div className="save-btn-div">
              <button>Save Nominees</button>
            </div>
          </div>
        </div>
        {showTokenNomineeDetails ? (
          <TokenNomineeDetails
            setTokenNomineeDetails={setTokenNomineeDetails}
            nomineeDetail={nomineeDetail}
            nominatedArr={nominatedArr}
          />
        ) : (
          ""
        )}
      </section>
    </>
  );
}

export default ChooseNomineeToken;
