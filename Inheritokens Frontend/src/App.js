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

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

import { ConnectKitProvider } from "connectkit";
import SendingEmailRequest from "./components/SendingEmailRequest";
import EmailVerified from "./components/EmailVerified";

const { provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ apiKey: "O5NYvtwLMNG0LjAXPQEk0YJT2l3UxTAY" }),
  publicProvider(),
]);

// const { chains } = configureChains(
//   [chain.mainnet, chain.optimism],
//   [publicProvider()]
// );
const customChain = {
  id: 1029,
  name: 'BitTorrent Chain Donau',
  network: 'BitTorrent Chain Donau',
  nativeCurrency: {
    decimals: 18,
    name: 'BitTorrent Chain Donau',
    symbol: 'BTT'
  },
  rpcUrls: {
    default: 'https://pre-rpc.bittorrentchain.io/'
  },
  blockExplorers: {
    default: {
      name: 'BitTorrent Chain Donau', url: 'https://testscan.bt.io'
    }
  },
  testnet: true
}

const chains = [chain.polygonMumbai, customChain];

// const client = createClient(
//   getDefaultClient({
//     appName: "Your App Name",
//     alchemyId,
//     chains,
//   })
// );
// Set up client

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});
// const client = createClient({
//   autoConnect: true,
//   provider: getDefaultProvider(),
// });

/// wagmi end

function App() {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider
        customTheme={{
          "--ck-font-family": '"Josefin Sans"',
        }}
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

              <Route path="/*" element={<Home />} />
            </Routes>
          </Router>
        </div>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default App;
