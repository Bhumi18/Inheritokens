import React, { useEffect, useState } from "react";
// import image from "../assets/images/defaultprofileimage.png";
import "../styles/NomineesListPopupForToken.scss";
import contract from "../artifacts/Main.json";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { inheritokensInstance } from "./Contracts";
export const CONTRACT_ADDRESS = "0xaEF8eb4EDCB0177A5ef6a5e3f46E581a5908eef4";
export const BTTC_ADDRESS = "0xB987640A52415b64E2d19109E8f9d7a3492d5F54";

function NomineesListPopupForToken({
  setNomineesListPopUp,
  arr,
  setNomineesListPopUp2,
  nominatedArr,
  indexNumber,
}) {
  const [nomineesArr, setNomineesArr] = useState([]);
  const { address } = useAccount();
  const [allNomiees, setAllNomiees] = useState(true);
  const [allCharities, setAllCharities] = useState(false);
  const [index, setIndex] = useState();
  const [indexChild, setIndexChild] = useState();
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
          // const con = new ethers.Contract(CONTRACT_ADDRESS, contract, signer);
          const con = await inheritokensInstance();
          const address_array = await con.getOwnerDetails(address);
          // console.log(address_array);
          for (let i = 0; i < address_array[8].length; i++) {
            // console.log(address_array[i]);
            const nominee_details = await con.addressToNominee(
              address,
              address_array[i]
            );
            // console.log(nominee_details[0]);
            // console.log(nominee_details[1]);
            // console.log(nominee_details[2]);
            const url = "https://ipfs.io/ipfs/" + nominee_details[2];
            console.log(
              !data.find((item) => nominee_details[3] === item.w_add)
            );
            if (!data.find((item) => nominee_details[3] === item.w_add)) {
              data.push({
                name: nominee_details[0],
                email: nominee_details[1],
                img: url,
                w_add: nominee_details[3],
              });
            }
          }
          setData(data);
          if (arr.length > 0) {
            let filteredNomineesArr = data.filter((elem) =>
              arr.every((ele) => ele.w_add !== elem.w_add)
            );
            console.log(filteredNomineesArr);
            setNomineesArr(filteredNomineesArr);
          } else {
            setNomineesArr(data);
          }
          // console.log(data);
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
          if (arr.length > 0) {
            let filteredNomineesArr = data.filter((elem) =>
              arr.every((ele) => ele.w_add !== elem.w_add)
            );
            console.log(filteredNomineesArr);
            setNomineesArr(filteredNomineesArr);
          } else {
            setNomineesArr(data);
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

  useEffect(() => {
    showNominees();
  }, []);

  useEffect(() => {
    if (indexNumber) {
      setIndexChild(parseInt(indexNumber.child));
      setIndex(parseInt(indexNumber.parent));
    }
  }, []);

  // search bar components

  const [searchField, setSearchField] = useState("");
  const handleChange = (e) => {
    setSearchField(e.target.value);
  };
  const filteredPersons = nomineesArr.filter((person) => {
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
              if (arr) arr.push(filteredPersons[key]);
              else
                nominatedArr[index].nominees[indexChild].priority_nominees.push(
                  filteredPersons[key]
                );
              setNomineesListPopUp2
                ? setNomineesListPopUp2(false)
                : setNomineesListPopUp(false);
            }}
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
      <div
        className="overlay"
        onClick={() => {
          setNomineesListPopUp2
            ? setNomineesListPopUp2(false)
            : setNomineesListPopUp(false);
        }}
      ></div>
      <div id="modal">
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
            {nomineesArr.length > 0 ? (
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
      </div>
    </>
  );
}

export default NomineesListPopupForToken;
