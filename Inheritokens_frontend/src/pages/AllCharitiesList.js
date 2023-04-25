import React, { useEffect, useState } from "react";
import image from "../assets/images/defaultprofileimage.png";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/AllCharitiesList.scss";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

function AllCharitiesList() {
  const [arr, setArr] = useState([]);
  const { address } = useAccount();
  const navigate = useNavigate();
  const [allCharities, setAllCharities] = useState(true);
  const [allWhitelistedCharities, setAllWhitelistedCharities] = useState(false);

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

  useEffect(() => {
    setArr(data);
  }, []);

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
            // onClick={() => handleAddElement(filteredPersons[key])}
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
      <div className="all-chairities-main">
        <div className="all-nominees-list">
          <div className="table-title">
            <span
              className={allCharities ? "active" : ""}
              onClick={() => {
                setAllCharities(true);
                setAllWhitelistedCharities(false);
              }}
            >
              All Charities
            </span>
            <span
              className={allWhitelistedCharities ? "active" : ""}
              onClick={() => {
                setAllWhitelistedCharities(true);
                setAllCharities(false);
              }}
            >
              Whitelisted Charities
            </span>
          </div>
          <div className="search-div">
            <input
              className="input"
              type="search"
              placeholder="Search Charity"
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
      </div>
      <Footer />
    </>
  );
}

export default AllCharitiesList;
