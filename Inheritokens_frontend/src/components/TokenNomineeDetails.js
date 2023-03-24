import React, { useEffect, useState } from "react";
import "../styles/TokenNomineeDetails.scss";
import NomineesListPopupForToken from "./NomineesListPopupForToken";

function TokenNomineeDetails({
  setTokenNomineeDetails,
  nomineeDetail,
  nominatedArr,
  showNomineesListPopUp,
  setNomineesListPopUp,
  setNominatedArrChanged,
  setTotalUsedRatio,
  totalUsedRatio,
}) {
  const [arr, setArr] = useState(
    nomineeDetail.img
      ? [
          {
            img: nomineeDetail.img,
            name: nomineeDetail.name,
            email: nomineeDetail.email,
            w_add: nomineeDetail.w_add,
          },
        ]
      : []
  );

  const [ratio, setRatio] = useState();
  const [eachNomineeValue, setEachNomineeValue] = useState();

  const [arrChanged, setArrChanged] = useState(1);
  const printArr = () => {
    console.log(arr);
  };
  const handleDeleteSvgButton = (item) => {
    arr.splice(item, 1);
    printArr();
    setArr(arr);
    setArrChanged((prev) => prev + 1);
  };

  return (
    <div className="token-nominee-details">
      <div className="overlay"></div>
      <div id="modal">
        <div className="title">
          <span className="main-title">Add Nominees</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="36px"
            viewBox="0 0 24 24"
            width="36px"
            fill="#5a88e1"
            onClick={() => setTokenNomineeDetails(false)}
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
          </svg>
        </div>
        <p className="details">
          Select nominees and enter the total proportion of your token that will
          be divided among the selected nominees.
        </p>
        <div className="field-main">
          <span className="input-title">Nominees</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="18px"
            viewBox="0 0 24 24"
            width="18px"
            fill="#cccccc"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z" />
          </svg>
        </div>
        <div className="nominees-list">
          {arrChanged && arr.length > 0 ? (
            arr.map((person, key) => {
              return (
                <div className="nominee-details" key={key}>
                  <img
                    src={person.img}
                    alt="nfts"
                    className="nominee-profile"
                  />

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
                  <div className="delete-svg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      fill="#000000"
                      onClick={() => handleDeleteSvgButton(key)}
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
                    </svg>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="add-nominee">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#5a88e1"
                onClick={() => setNomineesListPopUp(true)}
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M12 7c-.55 0-1 .45-1 1v3H8c-.55 0-1 .45-1 1s.45 1 1 1h3v3c0 .55.45 1 1 1s1-.45 1-1v-3h3c.55 0 1-.45 1-1s-.45-1-1-1h-3V8c0-.55-.45-1-1-1zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
            </div>
          )}
          {arr.length > 0 ? (
            <div className="add-nominee">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#5a88e1"
                onClick={() => setNomineesListPopUp(true)}
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M12 7c-.55 0-1 .45-1 1v3H8c-.55 0-1 .45-1 1s.45 1 1 1h3v3c0 .55.45 1 1 1s1-.45 1-1v-3h3c.55 0 1-.45 1-1s-.45-1-1-1h-3V8c0-.55-.45-1-1-1zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="field-main">
          <span>
            {"Available Proportion - "}
            {parseFloat(100) - parseFloat(totalUsedRatio)}
            {" %"}
          </span>
        </div>
        <div className="field-main">
          <span className="input-title">Proportion</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="18px"
            viewBox="0 0 24 24"
            width="18px"
            fill="#cccccc"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z" />
          </svg>
        </div>

        <div
          className={
            ratio > parseFloat(100) - parseFloat(totalUsedRatio)
              ? "warning input-field"
              : "input-field"
          }
        >
          <input
            className="proportion-input"
            type="number"
            placeholder="Enter Proportion"
            min={0}
            max={parseFloat(100) - parseFloat(totalUsedRatio)}
            onChange={(e) => {
              if (e.target.value > 100) {
                e.target.value = 0;
              }
              setRatio(e.target.value);
            }}
          />
          <div className="percentage-symbol">
            <span>%</span>
          </div>
        </div>
        {ratio > parseFloat(100) - parseFloat(totalUsedRatio) ? (
          <span style={{ color: "red", fontSize: "12px" }}>
            * please enter proportion less or equals to available proportion
          </span>
        ) : (
          ""
        )}

        <div className="field-main">
          <span className="input-title">Each Nominee will get</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="18px"
            viewBox="0 0 24 24"
            width="18px"
            fill="#cccccc"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z" />
          </svg>
        </div>
        <div className="input-field disabled">
          <input
            type="text"
            placeholder="10%"
            className="disabled"
            readOnly
            value={
              ratio
                ? parseFloat(ratio / parseInt(arr.length)).toFixed(2)
                : "0.00"
            }
          />
          <div className="percentage-symbol">
            <span>%</span>
          </div>
        </div>
        <div className="next-btn">
          <button
            className={
              ratio > 0 &&
              arr.length > 0 &&
              ratio <= parseFloat(100) - parseFloat(totalUsedRatio)
                ? ""
                : "disabled"
            }
            onClick={() => {
              let temp = [];
              for (let i = 0; i < arr.length; i++) {
                temp.push({
                  priority_nominees: [arr[i]],
                  single_nominee_ratio: parseFloat(
                    ratio / parseInt(arr.length)
                  ).toFixed(2),
                });
              }
              nominatedArr.push({ nominees: temp, ratio: ratio });
              setTotalUsedRatio((prev) => parseFloat(prev) + parseFloat(ratio));
              setNominatedArrChanged((prev) => prev + 1);
              setTokenNomineeDetails(false);
            }}
          >
            Next
          </button>
        </div>
      </div>
      {showNomineesListPopUp ? (
        <NomineesListPopupForToken
          setNomineesListPopUp={setNomineesListPopUp}
          arr={arr}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default TokenNomineeDetails;
