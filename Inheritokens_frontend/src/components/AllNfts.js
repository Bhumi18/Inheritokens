import React, { useEffect } from "react";

import { useState } from "react";

import "../styles/allnft.scss";
import { Nominees } from "./dummyNominees";
import SelectNominees from "./SelectNominees";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import contract from "../artifacts/Main.json";
import { useNavigate } from "react-router-dom";
import {
  inheritokensInstance,
  MultiplePriorityNomineeInstance,
} from "./Contracts";
export const CONTRACT_ADDRESS = "0xaEF8eb4EDCB0177A5ef6a5e3f46E581a5908eef4";

function AllNfts({ nftData }) {
  const [indexValue, setIndexValue] = useState();
  const navigate = useNavigate();
  // console.log(nftData);
  const [showNomineesComponent, setNomineesComponent] = useState(false);
  const [nftData2, setNftData2] = useState([]);
  const [checkChainId, setCheckChainId] = useState();
  const [isLoading, setLoading] = React.useState(true);
  const { address, isConnected } = useAccount();

  const temp = async () => {
    // for (let i = 0; i < nftData.length; i++) {
    //   // const nft = JSON.parse(item.metadata);
    //   const nft = JSON.parse(nftData[i].metadata);
    //   console.log(nft);
    //   if (!nftData2.find((temp) => nft["image"] === temp[0]["image"])) {
    //     nftData2.push([nft, nftData[i].token_id, nftData[i].token_address]);
    //   }
    //   // nftData.push([item]);
    // }

    //contract function..........
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const { chainId } = await provider.getNetwork();
        setCheckChainId(chainId);
        // console.log("switch case for this case is: " + chainId);
        if (chainId === 80001) {
          // const con = new ethers.Contract(CONTRACT_ADDRESS, contract, signer);
          const inheritokens_contract = await inheritokensInstance();

          for (let i = 0; i < nftData.length; i++) {
            // const nft = JSON.parse(item.metadata);
            console.log(nftData[i]);
            const nft = JSON.parse(nftData[i].metadata);
            // const isNominated = await con.checkIsNominated(
            //   address,
            //   nftData[i].token_hash
            // );
            const dt = await inheritokens_contract.nftAddressToTokenStruct(
              address,
              nftData[i].token_address,
              nftData[i].token_id
            );
            console.log(dt);
            // console.log(i);
            // console.log(isNominated);
            // console.log(nft);
            if (!nftData2.find((temp) => nft["image"] === temp[0]["image"])) {
              nftData2.push([
                nft,
                nftData[i].token_id,
                nftData[i].token_address,
                dt.isNominated,
              ]);
            }
            // nftData.push([item]);
          }
          setNftData2(nftData2);
          // console.log(nftData2);
          setLoading(false);
        } else if (chainId === 1029) {
          setLoading(false);
        } else {
          alert(
            "Please connect to the mumbai test network or BTTC test network!"
          );
        }
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
    // nftData.map((item) => {
    //   const nft = JSON.parse(item.metadata);
    //   setNftData2((prev) => [...prev, nft]);
    //   console.log(nftData);
    //   return nftData2;
    // });
  };
  useEffect(() => {
    temp();
  }, [nftData2, checkChainId]);

  const handleChooseNominee = (item, isNominated) => {
    navigate("/nominee/nft", {
      state: { item: item, isNominated: isNominated },
    });
  };

  // if (nftData.length === 0) {
  //   return (
  //     <>
  //       <div className="all-nft-main">
  //         <div className="nft-image-parent">
  //           <div className="nft-image-child">
  //             <div className="image-div">
  //               <img src="" alt="nftimage" />
  //             </div>
  //             <div className="nft-image-child-inside">
  //               <h3>You don't have any NFTs</h3>
  //               <button className="below-nft-button">Nominated</button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </>
  //   );
  // }
  if (!isLoading && checkChainId === 80001 && nftData2.length > 0)
    return (
      <>
        {showNomineesComponent && (
          <SelectNominees
            setNomineesComponent={setNomineesComponent}
            nftData={nftData}
            indexValue={indexValue}
          />
        )}
        <div className="all-nft-main">
          <div className="nft-image-parent">
            {nftData2.map((item, key) => (
              <div className="nft-image-child" key={key}>
                <div className="image-div">
                  <img src={item[0].image} alt="nftimage" />
                </div>
                <div className="nft-image-child-inside">
                  <h3>{item[0].name}</h3>

                  {item[3] ? (
                    <>
                      <button
                        className="nominated-btn"
                        onClick={() => {
                          // setNomineesComponent(true);
                          // setIndexValue({ key });
                          // console.log(temp2.key);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          enableBackground="new 0 0 24 24"
                          height="24px"
                          viewBox="0 0 24 24"
                          width="24px"
                          fill="#0ba360"
                        >
                          <g>
                            <rect fill="none" height="24" width="24" />
                            <rect fill="none" height="24" width="24" />
                          </g>
                          <g>
                            <path d="M23,12l-2.44-2.79l0.34-3.69l-3.61-0.82L15.4,1.5L12,2.96L8.6,1.5L6.71,4.69L3.1,5.5L3.44,9.2L1,12l2.44,2.79l-0.34,3.7 l3.61,0.82L8.6,22.5l3.4-1.47l3.4,1.46l1.89-3.19l3.61-0.82l-0.34-3.69L23,12z M9.38,16.01L7,13.61c-0.39-0.39-0.39-1.02,0-1.41 l0.07-0.07c0.39-0.39,1.03-0.39,1.42,0l1.61,1.62l5.15-5.16c0.39-0.39,1.03-0.39,1.42,0l0.07,0.07c0.39,0.39,0.39,1.02,0,1.41 l-5.92,5.94C10.41,16.4,9.78,16.4,9.38,16.01z" />
                          </g>
                        </svg>
                        Nominated
                      </button>
                      <button
                        className="below-nft-button"
                        onClick={() => {
                          setNomineesComponent(true);
                          setIndexValue({ key });
                          // console.log(temp2.key);
                          handleChooseNominee(nftData[key], item[3]);
                        }}
                      >
                        Edit Nominee
                      </button>
                    </>
                  ) : (
                    <button
                      className="below-nft-button"
                      onClick={() => {
                        // setNomineesComponent(true);
                        // setIndexValue({ key });
                        handleChooseNominee(nftData[key], item[3]);
                        // console.log(temp2.key);
                      }}
                    >
                      Choose Nominee
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  else if (!isLoading && checkChainId === 1029) {
    return (
      <>
        <div className="all-nft-main-empty">
          <div className="nft-empty-parent">
            <h3>Right now we are not providing data for NFT on BTTC chain</h3>
            <p>You can nominate for native token on BTTC chain</p>
          </div>
        </div>
      </>
    );
  } else if (nftData2.length === 0)
    return (
      <>
        <div className="all-nft-main-empty">
          <div className="nft-empty-parent">
            <h3>You don't have any NFT on this chain</h3>
            <p>Please select a different chain where you have the nft/s</p>
          </div>
        </div>
      </>
    );
}

export default AllNfts;
