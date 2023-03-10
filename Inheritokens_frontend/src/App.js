import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
// import Navbar from "./components/Navbar";
import PageNotFound from "./components/PageNotFound";
import AddNominee from "./pages/AddNominee";
import EditNominee from "./pages/EditNominee";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import EditProfile from "./pages/EditProfile";

/// wagmi start

import {
  Chain,
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
  chain,
} from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
// import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
// import { InjectedConnector } from "wagmi/connectors/injected";
// import { MetaMaskConnector } from "wagmi/connectors/metaMask";
// import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

import { ConnectKitProvider } from "connectkit";
import SendingEmailRequest from "./components/SendingEmailRequest";
import EmailVerified from "./components/EmailVerified";
import ChooseNomineeNFT from "./pages/ChooseNomineeNFT";
import ChooseNomineeToken from "./pages/ChooseNomineeToken";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";

// rainbowkit
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { polygonMumbai } from "wagmi/chains";
import AllCharitiesList from "./pages/AllCharitiesList";

// connectkit
// const { provider, webSocketProvider } = configureChains(defaultChains, [
//   alchemyProvider({ apiKey: "O5NYvtwLMNG0LjAXPQEk0YJT2l3UxTAY" }),
//   publicProvider(),
// ]);
// const { chains } = configureChains(
//   [chain.mainnet, chain.optimism],
//   [publicProvider()]
// );
const BTTChain = {
  id: 1029,
  name: "BitTorrent Chain Donau",
  network: "BitTorrent Chain Donau",
  iconUrl: "https://testscan.bt.io/static/media/BTT.e13a6c4e.svg",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "BitTorrent Chain Donau",
    symbol: "BTT",
  },
  rpcUrls: {
    default: "https://pre-rpc.bittorrentchain.io/",
  },
  blockExplorers: {
    default: {
      name: "BitTorrent Chain Donau",
      url: "https://testscan.bt.io",
    },
  },
  testnet: true,
};

// const chains = [chain.polygonMumbai, customChain];

// const client = createClient(
//   getDefaultClient({
//     appName: "Your App Name",
//     alchemyId,
//     chains,
//   })
// );
// Set up client

// const client = createClient({
//   autoConnect: true,
//   connectors: [
//     new MetaMaskConnector({ chains }),
//     new CoinbaseWalletConnector({
//       chains,
//       options: {
//         appName: "wagmi",
//       },
//     }),
//     new WalletConnectConnector({
//       chains,
//       options: {
//         qrcode: true,
//       },
//     }),
//     new InjectedConnector({
//       chains,
//       options: {
//         name: "Injected",
//         shimDisconnect: true,
//       },
//     }),
//   ],
//   provider,
//   webSocketProvider,
// });

// const client = createClient({
//   autoConnect: true,
//   provider: getDefaultProvider(),
// });

/// wagmi end

// rainbowkit

const { chains, provider } = configureChains(
  [polygonMumbai, BTTChain],
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: "https://pre-rpc.bittorrentchain.io/" }),
    }),
    alchemyProvider({ apiKey: "O5NYvtwLMNG0LjAXPQEk0YJT2l3UxTAY" }),
    // publicProvider(),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App() {
  // initial loading
  const [isLoading, setLoading] = useState(true);

  function someRequest() {
    //Simulates a request; makes a "promise" that'll run for 2.5 seconds
    return new Promise((resolve) => setTimeout(() => resolve(), 2500));
  }

  useEffect(() => {
    someRequest().then(() => {
      const loaderElement = document.querySelector(".loader-container");
      if (loaderElement) {
        loaderElement.remove();
        setLoading(!isLoading);
      }
    });
  });

  if (isLoading) {
    //
    return null;
  }

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        showRecentTransactions={true}
        theme={lightTheme({
          accentColor: "#ffffff",
          accentColorForeground: "black",
          borderRadius: "medium",
          fontStack: "system",
          overlayBlur: "small",
          connectButtonText: "#5a88e1",
          fonts: {
            body: "JosefinSans",
          },
        })}
      >
        <div className="App">
          <Router>
            {/* <Navbar /> */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/edit-nominee" element={<EditNominee />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/add-nominee" element={<AddNominee />} />
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/verify/email" element={<SendingEmailRequest />} />
              <Route path="/email/verified/:slug" element={<EmailVerified />} />
              <Route path="/nominee/nft" element={<ChooseNomineeNFT />} />
              <Route path="/nominee/token" element={<ChooseNomineeToken />} />
              <Route path="/nominee/charities" element={<AllCharitiesList />} />

              <Route path="/*" element={<Home />} />
            </Routes>
          </Router>
          <Footer />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
