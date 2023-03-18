import { ethers } from "ethers";

import InheritokensContract from "../artifacts/contracts/Inheritokens.sol/Inheritokens.json";
import CharityContract from "../artifacts/contracts/Charity.sol/CharityContract.json";
import MultiplePriorityNomineeContract from "../artifacts/contracts/MultiplePriorityNominee.sol/MultiplePriorityNominee.json";

export const Inheritokens_Contract_Address =
  "0xBa9294771806D6909A3FD9C5b5240d71927Dfd2e";

export const Charity_Contract_Address =
  "0x8c485Ed4D128c6C862642B39Cb70f3BC9fe8CFb7";

export const MultiplePriorityNominee_Contract_Address =
  "0x9D4be64f5732bcaf6dB88998189D8B30BD84a4fF";

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
