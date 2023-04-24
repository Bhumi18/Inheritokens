import React from "react";
import "../styles/LoadingForTrans.scss";

function LoadingForTrans(props) {
  return (
    <>
      <div
        className="overlay-loading"
        onClick={() => {
          //   props.setLoader({ ...props.loader, status: false });
        }}
      ></div>
      <div id="modal-loading">
        <div className="loader-main">
          <div className="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          {props.loader.error ? (
            <span style={{ color: "red", fontSize: "14px" }}>
              {props.loader.error}
            </span>
          ) : (
            <span className="heading">{props.loader.msg}</span>
          )}
          <span className="info">{props.loader.info}</span>
        </div>
      </div>
    </>
  );
}

export default LoadingForTrans;
