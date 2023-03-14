import { ethers } from "ethers";

import InheritokensContract from "../artifacts/contracts/Inheritokens.sol/Inheritokens.json";

export const Inheritokens_Contract_Address =
  "0xC7D942D5a3F5389923C92D84CF78d0747987DfB8";

export const Charity_Contract_Address =
  "0x39AE499B3eD13048993f706CD873Ec98E7A886D4";

export const MultiplePriorityNominee_Contract_Address =
  "0x7CE080378E3cDbb272E852a36be8530004BF7A6b";

let cons;
const createInstance = async () => {
  try {
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
      cons = con;
    } else {
      console.log("");
    }
  } catch {}
};
createInstance();
export const prints = cons;
