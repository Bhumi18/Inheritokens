import { ethers } from "ethers";

import InheritokensContract from "../artifacts/contracts/Inheritokens.sol/Inheritokens.json";
import CharityContract from "../artifacts/contracts/Charity.sol/CharityContract.json";
import MultiplePriorityNomineeContract from "../artifacts/contracts/MultiplePriorityNominee.sol/MultiplePriorityNominee.json";

export const Inheritokens_Contract_Address =
  "0x32b5BBE1E87Da3C6114acD3d1a90da7Cb21fE8EB";

export const Charity_Contract_Address =
  "0x9B236f9CF1477aaEc44D10202B28b0a35939f048";

export const MultiplePriorityNominee_Contract_Address =
  "0x086022091DBd9072e61f718F9584bEcFDb8A5e43";

export const inheritokensInstance = async () => {
  const { ethereum } = window;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    console.log(provider);
    const signer = provider.getSigner();
    console.log(signer);
    if (!provider) {
      console.log("Metamask is not installed, please install!");
    }

    const { chainId } = await provider.getNetwork();
    console.log(chainId);
    console.log("switch case for this case is: " + chainId);
    const con = new ethers.Contract(
      Inheritokens_Contract_Address,
      InheritokensContract.abi,
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
    console.log(provider);
    const signer = provider.getSigner();
    console.log(signer);
    if (!provider) {
      console.log("Metamask is not installed, please install!");
    }

    const { chainId } = await provider.getNetwork();
    console.log(chainId);
    console.log("switch case for this case is: " + chainId);
    const con = new ethers.Contract(
      Charity_Contract_Address,
      CharityContract.abi,
      signer
    );
    console.log(con);
    return con;
  } else {
    console.log("error");
  }
};

export const MultiplePriorityNomineeInstance = async () => {
  const { ethereum } = window;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    console.log(provider);
    const signer = provider.getSigner();
    console.log(signer);
    if (!provider) {
      console.log("Metamask is not installed, please install!");
    }

    const { chainId } = await provider.getNetwork();
    console.log(chainId);
    console.log("switch case for this case is: " + chainId);
    const con = new ethers.Contract(
      MultiplePriorityNominee_Contract_Address,
      MultiplePriorityNomineeContract.abi,
      signer
    );
    console.log(con);
    return con;
  } else {
    console.log("error");
  }
};
// inheritokensInstance();
// export const prints = cons;
