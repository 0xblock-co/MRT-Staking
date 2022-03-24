import "./App.css";
import Headers from "./components/common/Headers";
import Sidebar from "./components/common/Sidebar";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import { useAppDispatch } from "./components/store/store";
import Web3 from "web3";
import { setAccount, setAccounts, setWeb3 } from "./components/store/mrtSlice";
import { createProvider, disconnectWallet } from "./components/common/Common";
import { ToastContainer } from "react-toastify";
import mrt from "./assets/mrt.png";

const Home = React.lazy(() => import("./components/home/Home"));
const Farms = React.lazy(() => import("./components/farms/Farms"));

function App() {
  const [sidenav, setSideNav] = React.useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storeWeb3Instance = async () => {
      try {
        let web3Instance;
        /*
         creating web3 instance
         storing into redux store
        */
        const walletType = localStorage.getItem("walletType");
        const walletSession = JSON.parse(localStorage.getItem("walletconnect"));

        if (walletType) {
          const provider = await createProvider(walletType, walletSession);

          // create web3 instance and store
          web3Instance = new Web3(provider);
          dispatch(setWeb3(web3Instance));
        } else {
          web3Instance = new Web3(Web3.givenProvider);
          dispatch(setWeb3(web3Instance));
        }

        // check if accounts already exist in local storage
        // if yes then set in redux store
        const walletAddress = localStorage.getItem("address");
        walletAddress && dispatch(setAccounts(walletAddress));
        walletAddress && dispatch(setAccount(walletAddress[0]));
      } catch (error) {}
    };
    storeWeb3Instance();
  }, [dispatch]);

  // check which network type is being used
  // set accounts if account changed
  useEffect(() => {
    (async () => {
      try {
        const walletType = localStorage.getItem("walletType");
        // check metamask availability
        if (window.ethereum !== undefined) {
          if (
            walletType === process.env.REACT_APP_METAMASK ||
            walletType === process.env.REACT_APP_TRUSTWALLET
          ) {
            // check if metamask accounts changed
            window.ethereum.on("accountsChanged", async function (accounts) {
              if (accounts.length) {
                dispatch(setAccounts(accounts));
                dispatch(setAccount(accounts[0]));
                localStorage.setItem("address", accounts[0]);
              } else disconnectWallet(dispatch);
            });
          }

          // check if network is changed
          window.ethereum.on("chainChanged", async (chainId) => {
            if (chainId !== process.env.REACT_APP_MAINNET)
              disconnectWallet(dispatch);
          });
        }
      } catch (error) {}
    })();
  });

  return (
    <>
      <main>
        <Router>
          <Suspense
            fallback={
              <div className="h-screen flex justify-center items-center">
                <img
                  src={mrt}
                  alt="loading"
                  className="animate-bounce w-60 h-60"
                />
              </div>
            }
          >
            <Headers sidenav={sidenav} setSideNav={setSideNav} />
            <div className="flex gap-4">
              <Sidebar sidenav={sidenav} setSideNav={setSideNav} />
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
              <Routes>
                <Route path="/farms" element={<Farms />} />
              </Routes>
            </div>
          </Suspense>
        </Router>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        theme="dark"
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
