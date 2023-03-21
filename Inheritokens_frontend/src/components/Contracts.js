import { ethers } from "ethers";

import inheriABI from "../artifacts/contracts/Inheritokens.sol/Inheritokens.json";
import charityABI from "../artifacts/contracts/Charity.sol/CharityContract.json";
import tokenABI from "../artifacts/contracts/NominateTokens.sol/NominateTokens.json";
import nftABI from "../artifacts/contracts/NominateNFTs.sol/NominateNFTs.json";
import ERC20 from "../artifacts/ERC20.json";
import ERC721 from "../artifacts/ERC721.json";
export const INHERITOKENS_ADDRESS =
  "0x2C28d9f9b9FA99d13c9313205b9DA187b2629f92";
export const CHARITY_ADDRESS = "0x85324A7d8f770deCE1AF929a8595064A9474D022";
export const TOKEN_ADDRESS = "0x41c84De8e820c9570D9722DdBda8463974B401bd";
export const NFT_ADDRESS = "0x17936Ec923185031A81f0b371cd7Ed6d863c5deD";

export const inheritokensInstance = async () => {
  const { ethereum } = window;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    if (!provider) {
      console.log("Metamask is not installed, please install!");
    }

    const { chainId } = await provider.getNetwork();
    console.log("switch case for this case is: " + chainId);
    const con = new ethers.Contract(
      INHERITOKENS_ADDRESS,
      inheriABI.abi,
      signer
    );
    console.log(con);
    return con;
  } else {
    console.log("error");
  }
};

export const charityInstance = async () => {
  const { ethereum } = window;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    if (!provider) {
      console.log("Metamask is not installed, please install!");
    }

    const { chainId } = await provider.getNetwork();
    console.log("switch case for this case is: " + chainId);
    const con = new ethers.Contract(CHARITY_ADDRESS, charityABI.abi, signer);
    console.log(con);
    return con;
  } else {
    console.log("error");
  }
};

export const tokenContractInstance = async () => {
  const { ethereum } = window;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    if (!provider) {
      console.log("Metamask is not installed, please install!");
    }
    const { chainId } = await provider.getNetwork();
    console.log("switch case for this case is: " + chainId);
    const con = new ethers.Contract(TOKEN_ADDRESS, tokenABI.abi, signer);
    console.log(con);
    return con;
  } else {
    console.log("error");
  }
};

export const nftContractInstance = async () => {
  const { ethereum } = window;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    if (!provider) {
      console.log("Metamask is not installed, please install!");
    }
    const { chainId } = await provider.getNetwork();
    console.log("switch case for this case is: " + chainId);
    const con = new ethers.Contract(NFT_ADDRESS, nftABI.abi, signer);
    console.log(con);
    return con;
  } else {
    console.log("error");
  }
};

export const approveNFT = async (tokenAddress, tokenId) => {
  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract_address = ethers.utils.getAddress(
    tokenAddress // token address of nft
  );
  const contract = new ethers.Contract(contract_address, ERC721, signer);
  const tx = await contract.approve(NFT_ADDRESS, tokenId);
  return tx.wait();
};
export const checkApproved = async (tokenAddress, tokenId) => {
  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract_address = ethers.utils.getAddress(
    tokenAddress // token address of nft
  );
  const contract = new ethers.Contract(contract_address, ERC721, signer);
  const tx = await contract.getApproved(tokenId);
  return tx;
};
export const approveUSDCNFT = async () => {
  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const nft_contract = await nftContractInstance();
  const chargeData = await nft_contract.nftCharge();
  const chargeTokenAddress = await nft_contract.chargeTokenAddress();
  const charge = parseInt(chargeData, 10);
  const contract_address = ethers.utils.getAddress(
    chargeTokenAddress // chargeTokenAddress (make it dynamic)
  );
  const contract = new ethers.Contract(contract_address, ERC20, signer);
  const tx1 = await contract.approve(NFT_ADDRESS, charge);
  return await tx1.wait();
};
// inheritokensInstance();
// export const prints = cons;
