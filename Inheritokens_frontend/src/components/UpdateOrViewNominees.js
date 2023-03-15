import React, { useEffect, useState } from "react";
import GetOrdinal from "./GetOrdinal";
import "../styles/UpdateOrViewNominees.scss";
import NomineesListPopupForToken from "./NomineesListPopupForToken";

function UpdateOrViewNominees({
  setNomineesUpdate,
  nominatedArr,
  indexNumber,
  showNomineesListPopUp3,
  setNomineesListPopUp3,
}) {
  const [arr, setArr] = useState([]);
  const [ratio, setRatio] = useState();
  const [arrChanged, setArrChanged] = useState(1);

  useEffect(() => {
    if (nominatedArr[indexNumber.parent].nominees[indexNumber.child]) {
      setArr(
        nominatedArr[indexNumber.parent].nominees[indexNumber.child]
          .priority_nominees
      );
      setRatio(
        nominatedArr[indexNumber.parent].nominees[indexNumber.child]
          .single_nominee_ratio
      );
      console.log(nominatedArr[indexNumber.parent].nominees[indexNumber.child]);
    }
  }, []);

  const handleMoveUpElement = (key) => {
    var element = arr[key];
    arr.splice(key, 1);
    arr.splice(key - 1, 0, element);
    setArrChanged((prev) => prev + 1);
  };
  const handleMoveDownElement = (key) => {
    var element = arr[key];
    arr.splice(key, 1);
    arr.splice(key + 1, 0, element);
    setArrChanged((prev) => prev + 1);
  };
  const handleDeleteElement = (key) => {
    arr.splice(key, 1);
    setArrChanged((prev) => prev + 1);
  };
  const handleUpdateData = () => {
    nominatedArr[indexNumber.parent].nominees[
      indexNumber.child
    ].priority_nominees = arr;
    nominatedArr[indexNumber.parent].nominees[
      indexNumber.child
    ].single_nominee_ratio = ratio;
    setNomineesUpdate(false);
  };
  return (
    <>
      <div
        className="overlay"
        onClick={() => {
          setNomineesUpdate(false);
        }}
      ></div>
      <div id="modal">
        <div className="update-view-main">
          <div className="title">
            <span className="main-title">Add / Edit Nominee</span>
          </div>
          <div className="details">
            <span className="title">
              {/* Nominated - <span className="content">{ratio} %</span> */}
              Nominated - <input type="text" placeholder={ratio + " %"} />
            </span>
          </div>
          <div className="table-div">
            {arrChanged && arr.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Priority</th>
                    <th>Move</th>
                    <th>Nominee Details</th>
                    <th></th>
                  </tr>
                </thead>
                {arr.map((j, l) => {
                  return (
                    <tbody key={l}>
                      <tr>
                        <td className="priority">
                          {l + 1}
                          <sup className="sup-of-priority">
                            {GetOrdinal(l + 1)}
                          </sup>
                        </td>
                        <td className="arrows">
                          {l === 0 ? (
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
                              onClick={() => handleMoveUpElement(l)}
                            >
                              <path d="M0 0h24v24H0V0z" fill="none" />
                              <path d="M11.29 8.71L6.7 13.3c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 10.83l3.88 3.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.7 8.71c-.38-.39-1.02-.39-1.41 0z" />
                            </svg>
                          )}
                          {l === arr.length - 1 ? (
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
                              onClick={() => handleMoveDownElement(l)}
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
                        <td>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 0 24 24"
                            width="24px"
                            fill="#000000"
                            onClick={() => handleDeleteElement(l)}
                          >
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
                          </svg>
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
            ) : (
              ""
            )}
          </div>
          <div className="save-btn-div">
            <button
              className="add-nominee"
              onClick={() => setNomineesListPopUp3(true)}
            >
              Add Priority Nominee
            </button>
            <button className="save-nominee" onClick={() => handleUpdateData()}>
              Next
            </button>
          </div>
        </div>
      </div>
      {showNomineesListPopUp3 ? (
        <NomineesListPopupForToken
          setNomineesListPopUp={setNomineesListPopUp3}
          arr={arr}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default UpdateOrViewNominees;
