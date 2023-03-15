import { ethers } from "ethers";

import InheritokensContract from "../artifacts/contracts/Inheritokens.sol/Inheritokens.json";
import CharityContract from "../artifacts/contracts/Charity.sol/CharityContract.json";
import MultiplePriorityNomineeContract from "../artifacts/contracts/MultiplePriorityNominee.sol/MultiplePriorityNominee.json";

export const Inheritokens_Contract_Address =
  "0xC7D942D5a3F5389923C92D84CF78d0747987DfB8";

export const Charity_Contract_Address =
  "0x39AE499B3eD13048993f706CD873Ec98E7A886D4";

export const MultiplePriorityNominee_Contract_Address =
  "0x7CE080378E3cDbb272E852a36be8530004BF7A6b";

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
