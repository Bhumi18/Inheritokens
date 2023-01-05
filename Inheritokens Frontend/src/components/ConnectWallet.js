import React, { useRef } from "react";
import { ConnectKitButton } from "connectkit";

import styled from "styled-components";
const StyledButton = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 20px 50px;
  color: #000;
  background-color: #fff;
  font-size: 16px;
  font-weight: 400;
  border: none;

  font-family: "Josefin Sans";
  font-weight: 300;

  transition: 200ms ease;
  &:hover {
    transform: translateY(-6px);
    -webkit-box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.1);
    box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.1);
  }
  &:active {
    transform: translateY(-3px);
  }
`;

function ConnectWallet() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <StyledButton onClick={show} id="connect-wallet">
            {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
          </StyledButton>
        );
      }}
    </ConnectKitButton.Custom>
  );
}

export default React.forwardRef(ConnectWallet);
