import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/ChooseNomineeNFT.scss";
import image from "../assets/images/defaultprofileimage.png";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import GetOrdinal from "../components/GetOrdinal";
import ERC20 from "../artifacts/ERC20.json";

import contract from "../artifacts/Main.json";
import {
  approveNFT,
  approveUSDCNFT,
  checkApproved,
  inheritokensInstance,
  nftContractInstance,
  NFT_ADDRESS,
  tokenContractInstance,
} from "../components/Contracts";
import Footer from "../components/Footer";
import LoadingForTrans from "../components/LoadingForTrans";
export const CONTRACT_ADDRESS = "0xaEF8eb4EDCB0177A5ef6a5e3f46E581a5908eef4";
export const BTTC_ADDRESS = "0xB987640A52415b64E2d19109E8f9d7a3492d5F54";

function ChooseNomineeNFT({ nftsrc }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { address } = useAccount();
  // console.log(location.state.item);
  const [allNomiees, setAllNomiees] = useState(true);
  const [allCharities, setAllCharities] = useState(false);
  const [data, setData] = useState([]);
  const [nominatedAddresses, setNominatedAddresses] = useState();

  const [arr, setArr] = useState([]);
  const [nftData, setNftData] = useState({
    img: "",
    name: "",
    desc: "",
    contract: "",
    contract_add: "",
    token_id: "",
    symbol: "",
  });

  const [nominatedArr, setNominatedArr] = useState([]);
  const [arrChanged, setArrChanged] = useState(1);
  const [loader, setLoader] = useState({
    status: false,
    msg: "",
    info: "",
  });

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
        await getNominated();
        if (chainId === 80001) {
          // const con = new ethers.Contract(CONTRACT_ADDRESS, contract, signer);
          const con = await inheritokensInstance();
          const address_array = await con.getOwnerDetails(address);
          console.log(address_array);
          for (let i = 0; i < address_array[8].length; i++) {
            // console.log(address_array[i]);

            const nominee_details = await con.addressToNominee(
              address,
              address_array[8][i]
            );
            // console.log(nominee_details);
            // console.log(nominee_details[1]);
            // console.log(nominee_details[2]);
            const url = "https://ipfs.io/ipfs/" + nominee_details[2];
            console.log(
              !data.find((item) => nominee_details[3] === item.w_add)
            );
            if (!data.find((item) => nominee_details[3] === item.w_add)) {
              // if (data.length < address_array.length) {
              data.push({
                name: nominee_details[0],
                email: nominee_details[1],
                img: url,
                w_add: nominee_details[3],
              });
            }
          }
          setData(data);
          setArr(data);
          console.log(data);

          // setLoading(false);
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
            if (!data.find((item) => nominee_details[3] === item.w_add)) {
              // if (data.length < address_array.length) {
              data.push({
                name: nominee_details[0],
                email: nominee_details[1],
                img: url,
                w_add: nominee_details[3],
              });
            }
          }
          setData(data);
          setArr(data);
          console.log(data);
          // setLoading(false);
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

  // useEffect(() => {
  //   showNominees();
  // }, []);

  // get nominated data
  const getNominated = async () => {
    console.log(address);
    console.log("inside the getnomineedetails");
    try {
      const con = await nftContractInstance();
      console.log(location.state.item);
      console.log("first");
      const nominated = await con.getAllStructs(
        address,
        location.state.item.token_address,
        location.state.item.token_id
      );
      console.log(nominated);
      console.log(nominated[2]);
      console.log(typeof nominated[2]);
      setNominatedAddresses(nominated[2]);

      for (let i = 0; i < nominated[2].length; i++) {
        const con2 = await inheritokensInstance();
        const nominee_details = await con2.addressToNominee(
          address,
          nominated[2][i]
        );
        console.log(nominee_details);
        console.log("Hello");
        const url = "https://ipfs.io/ipfs/" + nominee_details[2];
        if (!nominatedArr.find((item) => nominee_details[3] === item.w_add)) {
          nominatedArr.push({
            name: nominee_details[0],
            email: nominee_details[1],
            img: url,
            w_add: nominee_details[3],
          });
        }
      }
      setArrChanged((prev) => prev + 1);
      // console.log(nominatedArr);
      setNominatedArr(nominatedArr);
    } catch (error) {
      console.log(error);
    }
  };

  // nominate nft function

  const assignNFT = async () => {
    try {
      setLoader({ ...loader, status: true });
      const nft_contract = await nftContractInstance();
      console.log(location.state.isNominated);
      if (!location.state.isNominated) {
        console.log("inside if not nominated");
        const chkApproved = await checkApproved(
          nftData.contract_add,
          nftData.token_id
        );
        console.log(chkApproved);
        console.log(NFT_ADDRESS);
        console.log(chkApproved !== NFT_ADDRESS);
        if (chkApproved !== NFT_ADDRESS) {
          setLoader({
            status: true,
            msg: "Waiting for approval of the NFT...",
            info: "",
          });
          const approvenft = await approveNFT(
            nftData.contract_add,
            nftData.token_id
          );
          console.log(approvenft);
        }
        let nominees_address = [];
        for (let i = 0; i < nominatedArr.length; i++) {
          nominees_address.push(nominatedArr[i].w_add);
        }
        console.log(nominees_address);
        setLoader({
          status: true,
          msg: "Waiting for transaction approval...",
          info: "",
        });
        const tx = await nft_contract.nominateNFT(
          nftData.contract_add, // token address or nft address
          nftData.name, // token name or nft name
          nftData.token_id, // token_id

          [
            "0x0F0c3d49bcf3E9eDcB504672c0f795c377874ebc", // charity address
            nominees_address[0], // null value by default
            nominees_address,
            false,
            "",
          ]
        );
        await tx.wait();
        setLoader({
          status: false,
          msg: "Waiting for transaction approval...",
          info: "",
        });
      } else {
        console.log("inside else ");
        const chkApproved = await checkApproved(
          nftData.contract_add,
          nftData.token_id
        );
        console.log(chkApproved);
        if (chkApproved !== NFT_ADDRESS) {
          setLoader({
            status: true,
            msg: "Waiting for approval of the NFT...",
            info: "",
          });
          const approvenft = await approveNFT(
            nftData.contract_add,
            nftData.token_id
          );
          console.log(approvenft);
        }
        setLoader({
          status: true,
          msg: "Waiting for approval of the USDC...",
          info: "",
        });
        const tx2 = await approveUSDCNFT();
        console.log(tx2);
        if (tx2) {
          // const approvenft = await approveNFT(
          //   nftData.contract_add,
          //   nftData.token_id
          // );
          // console.log(approvenft);
          let nominees_address = [];
          for (let i = 0; i < nominatedArr.length; i++) {
            nominees_address.push(nominatedArr[i].w_add);
          }
          console.log(nominees_address);
          setLoader({
            status: true,
            msg: "Waiting for transaction approval...",
            info: "",
          });
          const tx = await nft_contract.nominateNFT(
            nftData.contract_add, // token address or nft address
            nftData.name, // token name or nft name
            nftData.token_id, // token_id

            [
              "0x0F0c3d49bcf3E9eDcB504672c0f795c377874ebc", // charity address
              nominees_address[0], // null value by default
              nominees_address,
              false,
              "",
            ]
          );
          await tx.wait();
          setLoader({
            status: false,
            msg: "Waiting for transaction approval...",
            info: "",
          });
        }
      }
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
    if (!address) navigate("/");
  }, [address, navigate]);
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

  useEffect(() => {
    if (location.state.item) {
      console.log(location.state.isNominated);

      console.log(location.state.item);
      const nft = location.state.item;
      const metadata = JSON.parse(nft.metadata);
      setNftData({
        ...nftData,
        img: metadata["image"],
        name: metadata["name"],
        desc: metadata["description"],
        contract: nft.contract_type,
        contract_add: nft.token_address,
        token_id: nft.token_id,
        symbol: nft.symbol,
      });
    }
    showNominees();
  }, []);

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
            // className={
            //   nominatedAddresses.includes(person.w_add)
            //     ? "action-btn disabled"
            //     : "action-btn"
            // }
            className="action-btn"
            onClick={() => handleAddElement(filteredPersons[key])}
          >
            Add this
          </span>
        </td>
      </tr>
    ));
    return filtered;
  }

  return (
    <>
      <Navbar />
      <section className="choose-nominees-main">
        {" "}
        <div
          className="go-back"
          onClick={() =>
            navigate("/user/profile", { state: { component: "nfts" } })
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
        <div className="cn-sub-hero-section">
          <div className="sub-left">
            <div className="img-background">
              <img
                src={nftData.img ? nftData.img : ""}
                alt="nft"
                className="nft-image"
              />
            </div>
          </div>
          <div className="sub-right">
            <span className="contract-type">
              {nftData.contract ? nftData.contract : ""}
            </span>
            <div className="nft-name">
              <p>{nftData.name ? nftData.name : ""}</p>
            </div>

            <div className="sub-right-name">
              <span>Description</span>
            </div>
            <div className="sub-right-inner">
              <p>{nftData.desc ? nftData.desc : ""}</p>
            </div>

            <div className="sub-right-name">
              <span>Details</span>
            </div>
            <div className="sub-right-inner details">
              <div>
                <span>Contract Address</span>
                <span className="main-span">
                  {nftData.contract_add ? nftData.contract_add : ""}
                </span>
              </div>
              <div>
                <span>Token ID</span>
                <span className="main-span">
                  {nftData.token_id ? nftData.token_id : ""}
                </span>
              </div>
              <div>
                <span>Symbol</span>
                <span className="main-span">
                  {nftData.symbol ? nftData.symbol : ""}
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
              {}
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
                            <td className="priority">
                              {key + 1}
                              <sup className="sup-of-priority">
                                {GetOrdinal(key + 1)}
                              </sup>
                            </td>
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
              <button onClick={() => assignNFT()}>Save Nominees</button>
            </div>
          </div>
        </div>
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

export default ChooseNomineeNFT;
