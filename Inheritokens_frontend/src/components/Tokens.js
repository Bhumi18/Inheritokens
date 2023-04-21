import React, { useState } from "react";
import axios from "axios";
import { chainId, useAccount, useNetwork } from "wagmi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/token.scss";
import { parse } from "@ethersproject/transactions";
import SelectNomineeForToken from "./SelectNomineeForToken";
import { ethers } from "ethers";
import { inheritokensInstance } from "./Contracts";

function Tokens() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { chain } = useNetwork();
  console.log(chain);
  const [showNativeTokenBalance, setNativeTokenBalance] = useState(0);
  const [nativeTokenNominated, setNativeTokenNominated] = useState();
  const [allTokens, setAllTokens] = useState([]);
  const [showAllToken, setShowAllToken] = useState(false);
  const [showNomineesComponent, setNomineesComponent] = useState(false);
  const [checkChainId, setCheckChainId] = useState();

  let tokenDetails = {
    token_address: "",
    token_name: "",
    token_symbol: "",
    token_balance: "",
  };

  const fetchTokens = async () => {
    const inheritokens_contract = await inheritokensInstance();
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      if (!provider) {
        console.log("Metamask is not installed, please install!");
      }
      const { chainId } = await provider.getNetwork();
      setCheckChainId(chainId);

      if (chainId === 80001) {
        const options = {
          method: "GET",
          url: "https://deep-index.moralis.io/api/v2/" + address + "/balance",
          params: { chain: "mumbai" },
          headers: {
            accept: "application/json",
            "X-API-Key":
              "sNXC9N5fpBJzWtV0sNHUAOfAyeQDGjfZ01RBZebMLmW2YAOoLgr2ItMow7rVj5Xb",
          },
        };
        await axios
          .request(options)
          .then(async function (response) {
            console.log(response);
            console.log(response.data);
            const isNominated =
              await inheritokens_contract.tokenAddressToTokenStruct(
                address,
                "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889"
              );
            setNativeTokenNominated(isNominated.isNominated);
            // if (!showNativeTokenBalance.length > 0) {
            //   showNativeTokenBalance.push(response.data.balance);
            //   setNativeTokenBalance(showNativeTokenBalance);
            // }
            if (showNativeTokenBalance !== Number(response.data.balance)) {
              setNativeTokenBalance(response.data.balance);
              console.log(showNativeTokenBalance);
            }
          })
          .catch(function (error) {
            console.error(error);
          });
      } else if (chainId === 1029) {
        var config = {
          method: "post",
          url:
            "https://api-testnet.bttcscan.com/api?module=account&action=balance&address=" +
            address +
            "&tag=latest&apikey=RBFAJ89HCF95HJ676INF1I6416QAZ1QFZ7",
          headers: {},
        };

        await axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));

            // if (!showNativeTokenBalance.length > 0) {
            // showNativeTokenBalance.push(Number(response.data.result));
            // setNativeTokenBalance(showNativeTokenBalance);
            // }
            if (showNativeTokenBalance !== Number(response.data.result)) {
              setNativeTokenBalance(response.data.result);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
        // setNativeTokenBalance(showNativeTokenBalance);
      } else {
        alert(
          "Please connect to the mumbai test network or BTTC test network!"
        );
      }
    }
    // console.log(showMeticBalance);
  };

  const fetchTokenAll = async () => {
    const inheritokens_contract = await inheritokensInstance();
    const options = {
      method: "GET",
      url: "https://deep-index.moralis.io/api/v2/" + address + "/erc20",
      params: { chain: "mumbai" },
      headers: {
        accept: "application/json",
        "X-API-Key":
          "sNXC9N5fpBJzWtV0sNHUAOfAyeQDGjfZ01RBZebMLmW2YAOoLgr2ItMow7rVj5Xb",
      },
    };

    await axios
      .request(options)
      .then(async function (response) {
        console.log(response.data);

        for (let i = 0; i < response.data.length; i++) {
          const isNominated =
            await inheritokens_contract.tokenAddressToTokenStruct(
              address,
              response.data[i].token_address
            );
          console.log(isNominated.isNominated);
          if (
            !allTokens.find(
              (temp) =>
                response.data[i]["token_address"] === temp["token_address"]
            )
          ) {
            allTokens.push({
              ...response.data[i],
              isNominated: isNominated.isNominated,
            });
          }
        }
        setAllTokens(allTokens);
        console.log(allTokens);
        setShowAllToken(true);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  useEffect(() => {
    fetchTokens();
    fetchTokenAll();
  }, []);

  const handleClick = (isNominated) => {
    navigate("/nominee/token", {
      state: { item: tokenDetails, isNominated: isNominated },
    });
  };

  return (
    <>
      {showNomineesComponent && (
        <SelectNomineeForToken
          setNomineesComponent={setNomineesComponent}
          tokenDetails={tokenDetails}
        />
      )}
      <div className="token-main">
        <div className="token-table" id="token-table">
          <div className="token-parent">
            {/* <div className="token-header">
            <ul className="token-header-ul">
              <li className="token-header-li">Token</li>
              <li className="token-header-li">Balance</li>
              <li className="token-header-li">Price</li>
              <li className="token-header-li">Nominated</li>
              <li className="token-header-li">Available</li>
            </ul>
          </div> */}
            <table>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Balance</th>
                  <th>Nominee</th>
                </tr>
              </thead>
              <tbody>
                {showNativeTokenBalance ? (
                  <tr>
                    <td className="token-symbol">
                      {checkChainId === 80001 ? "MATIC" : "BTT"}
                    </td>
                    <td>
                      {showNativeTokenBalance === 0
                        ? "0"
                        : String(
                            showNativeTokenBalance / Math.pow(10, 18)
                          ).substring(0, showNativeTokenBalance.length - 1)}
                    </td>
                    <td>
                      {checkChainId === 80001 ? (
                        <button
                          onClick={() => {
                            // setNomineesComponent(true);
                            tokenDetails = {
                              token_address:
                                "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
                              token_name: "MATIC",
                              token_symbol: "MATIC",
                              token_balance: Number(
                                String(showNativeTokenBalance).substring(0, 18)
                              ),
                              token_decimals: 18,
                            };
                            handleClick(nativeTokenNominated);
                          }}
                        >
                          {nativeTokenNominated
                            ? "Edit Nominee"
                            : "Choose Nominee"}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setNomineesComponent(true);
                            tokenDetails = {
                              token_address:
                                "0x0000000000000000000000000000000000001010",
                              token_name: "BitTorrent Chain Donau",
                              token_symbol: "BTT",
                              token_balance: showNativeTokenBalance,
                            };
                          }}
                        >
                          Choose Nominee
                        </button>
                      )}
                    </td>
                  </tr>
                ) : null}

                {showAllToken && checkChainId === 80001
                  ? allTokens.map((val, key) => {
                      return (
                        <tr key={key}>
                          <td className="token-symbol">{val.symbol}</td>
                          <td>
                            {String(
                              val.balance / Math.pow(10, val.decimals)
                            ).substring(0, showNativeTokenBalance.length - 1)}
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                // setNomineesComponent(true);
                                tokenDetails = {
                                  token_address: val.token_address,
                                  token_name: val.name,
                                  token_symbol: val.symbol,
                                  token_balance: val.balance,
                                  token_decimals: val.decimals,
                                };
                                handleClick(val.isNominated);
                              }}
                            >
                              {val.isNominated
                                ? "Edit Nominee"
                                : "Choose Nominee"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
            <div className="token-child"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tokens;
