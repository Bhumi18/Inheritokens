import React from "react";
import { ConnectKitButton } from "connectkit";

import styled from "styled-components";
const StyledButton = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  font-size: 1rem;
  font-family: "Josefin Sans";
  font-weight: 400;
  background: #dcd6fc;
  // background: linear-gradient(90deg, #dcd6fc, #9bb7ed);
  background-image: linear-gradient(to right, #9f8ff7 0%, #5a88e1 100%);
  background-image: -moz-linear-gradient(left, #9f8ff7 0%, #5a88e1 100%);
  background-image: -webkit-linear-gradient(left, #9f8ff7 0%, #5a88e1 100%);
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;

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

function ConnectWalletNavbar() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <StyledButton onClick={show}>
            {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
          </StyledButton>
        );
      }}
    </ConnectKitButton.Custom>
  );
}

export default ConnectWalletNavbar;
