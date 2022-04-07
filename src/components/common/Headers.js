import React, { memo, useCallback, useMemo, useState } from "react";
import mrt from "../../assets/mrt.png";
import metamask from "../../assets/metamask.png";
import walletconnect from "../../assets/walletconnect.png";
import trustwallet from "../../assets/trustwallet.png";
import Wallet from "./Modal";
import Wallet1 from "./Modal";
import { GrClose } from "react-icons/gr";
import { MdContentCopy } from "react-icons/md";
import {
  copyFunction,
  createProvider,
  disconnectWallet,
  start_and_end,
} from "./Common";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setAccount, setAccounts, setLogin, setNetworkId } from "../store/mrtSlice";
import { toast } from "react-toastify";

const Headers = ({ sidenav, setSideNav }) => {
  const myState = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleOpen1 = () => {
    setOpen1(true);
  };

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [])
  const handleClose1 = () => {
    setOpen1(false);
  };

  // const [walletConnections, setWalletConnections] = useState(mobileWallets);

  // useEffect(() => {
  //   if (detectDevice() === devices.desktop)
  //     setWalletConnections(desktopWallets);
  // }, [desktopWallets]);

  // getting state values
  const web3Instance = myState?.web3;

  // const disableWallet = (walletName) => {
  //   setWalletConnections((prevValue) => (
  //     prevValue.map(wallet => {
  //       if(wallet.name === walletName) {
  //         return {
  //           ...wallet,
  //           isInstalled: false
  //         }
  //       }
  //       else return wallet
  //     })
  //   ))
  // }

  // function to connect all wallets
  const connectToWallet = useCallback(
    async (walletType) => {
      try {
        // checking if any wallet is installed or not
        if (
          walletType === process.env.REACT_APP_METAMASK &&
          window.ethereum === undefined
        ) {
          // disableWallet(walletType)
          toast.error("The wallet hasn't been installed on your device.");
        } else if (
          walletType === process.env.REACT_APP_TRUSTWALLET &&
          window.ethereum === undefined
        ) {
          toast.error("The wallet hasn't been installed on your device.");
        }
        let provider, walletAddress;
        // create provider according to wallet type
        provider = await createProvider(walletType);
        // set provider
        web3Instance.setProvider(provider);
        // show qr code for wallet connect
        process.env.REACT_APP_WALLETCONNECT === walletType &&
          (await provider.enable());
        const currentNetId = await web3Instance.eth.net.getNetworkType();
        if (currentNetId !== process.env.REACT_APP_MAIN)
          if (
            [
              process.env.REACT_APP_METAMASK,
              process.env.REACT_APP_TRUSTWALLET,
            ].includes(walletType)
          ) {
            toast.error(
              "Please make sure you are connected to the Rinkeby Test Network in your wallet!"
            );
            return;
          }
        /**
         * get walletAddress according to wallet type
         * store walletAddress in localstorage and redux store
         */
        if (
          walletType === process.env.REACT_APP_METAMASK ||
          walletType === process.env.REACT_APP_TRUSTWALLET
        ) {
          walletAddress = await web3Instance.eth.requestAccounts();
        } else if (walletType === process.env.REACT_APP_WALLETCONNECT) {
          walletAddress = await web3Instance.eth.getAccounts();
        }
        const netId = await web3Instance.eth.net.getId();
        dispatch(setLogin(true));
        dispatch(setNetworkId({ netId }));
        dispatch(setAccounts(walletAddress))
        dispatch(setAccount(walletAddress[0]));
        localStorage.setItem("walletType", walletType);
        localStorage.setItem("address", walletAddress[0]);
        // close connction modal
        handleClose();
      } catch (error) {
        // if (error) {
        //   if (error === "Please make sure you are Connected to the Ethereum Main Network in your wallet!")
        //     console.log("Please make sure you are Connected to the Ethereum Main Network in your wallet!");
        //   else if (error.code === -32002)
        //     console.log("Metamask is Already opened");
        //   else if (
        //     error.message?.includes("User closed modal") ||
        //     error.code === 4001 ||
        //     error === "Please Authorize to access your account"
        //   ) {
        //     console.log("Please Authorize to access your account");
        //   } else if (
        //     error === "The wallet hasn't been installed on your device."
        //   )
        //     console.log(
        //       "The wallet hasn't been installed on your device."
        //     );
        //   else if (
        //     error === "The wallet hasn't been installed on your device."
        //   )
        //     console.log(
        //       "The wallet hasn't been installed on your device."
        //     );
        //   else if (error === errMsg.SWITCH_NETWORK) console.log(errMsg.SWITCH_NETWORK);
        //   else console.log("Something went wrong try again");
        // }
        toast.error(error);
      }
    },
    [web3Instance, dispatch, handleClose]
  );

  const mobileWallets = useMemo(
    () => [
      {
        id: 3,
        name: process.env.REACT_APP_WALLETCONNECT,
        handleClick: () => connectToWallet(process.env.REACT_APP_WALLETCONNECT),
        src: walletconnect,
        isInstalled: true,
      },
    ],
    [connectToWallet]
  );

  const desktopWallets = useMemo(
    () => [
      {
        id: 1,
        name: process.env.REACT_APP_METAMASK,
        handleClick: () => connectToWallet(process.env.REACT_APP_METAMASK),
        src: metamask,
        isInstalled: true,
      },
      {
        id: 2,
        name: process.env.REACT_APP_TRUSTWALLET,
        handleClick: () => connectToWallet(process.env.REACT_APP_TRUSTWALLET),
        src: trustwallet,
        isInstalled: true,
      },
      ...mobileWallets,
    ],
    [mobileWallets, connectToWallet]
  );

  return (
    <>
      <div className="h-24 w-full px-4 py-2 bg-themeblue flex items-center justify-between border-b-2 border-themegray z-40 fixed">
        <div className="flex gap-6 items-center">
          <div
            className="flex flex-col gap-2 p-1 border border-themegray bg-gradient-to-r from-themesky to-themepurple rounded-md cursor-pointer"
            onClick={() => setSideNav(!sidenav)}
          >
            <div
              className={`pb-1 w-3 rounded-tl-xl rounded-bl-xl bg-white ${
                sidenav
                  ? "transform transition ease-in-out delay-100 duration-300 rotate-45 translate-y-1 translate-x-5"
                  : "transform transition ease-in-out delay-100 duration-300 rotate-0"
              }`}
            ></div>
            <div
              className={`pb-1 w-8 rounded-xl bg-white  ${
                sidenav
                  ? "transform transition ease-in-out delay-100 duration-300 -translate-y-0.5 rotate-0"
                  : "transform transition ease-in-out delay-100 duration-300 rotate-0"
              }`}
            ></div>
            <div
              className={`pb-1 w-5 rounded-tr-xl rounded-br-xl bg-white ${
                sidenav
                  ? "transform transition ease-in-out delay-100 duration-300 -rotate-45 translate-x-4 -translate-y-2"
                  : "transform transition ease-in-out delay-100 duration-300 rotate-0"
              }`}
            ></div>
          </div>
          <img src={mrt} alt="logo" className="w-16 h-16" />
        </div>
        <div>
          {myState?.isLogin ? (
            <button
              className="bg-gradient-to-r from-themesky to-themepurple py-2 px-4 rounded-2xl border border-themegray text-white"
              onClick={handleOpen1}
            >
             {start_and_end(myState?.account)}
            </button>
          ) : (
            <button
              className="bg-gradient-to-r from-themesky to-themepurple py-2 px-4 rounded-2xl border border-themegray text-white"
              onClick={handleOpen}
            >
              Connect
            </button>
          )}
        </div>
      </div>
      <Wallet open={open} close={handleClose}>
        <div className="text-xl p-4 font-medium flex justify-between items-center w-full border-b-2 bg-white text-themedarkblue rounded-t-3xl">
          <h1 className="">Connect to Wallet</h1>
          <GrClose
            className="cursor-pointer border border-white rounded-lg"
            onClick={handleClose}
          />
        </div>
        <div className="py-4">
          <p className="px-4 py-2 text-center font-light">
            By connecting your wallet, you agree to our Terms of Service and our
            Privacy Policy. And also Select The Rinkeby Test Network.
          </p>
          {desktopWallets.map((item) => (
            <div
              className="flex justify-between items-center cursor-pointer m-4 border border-gray-400 px-4 py-2 rounded-2xl bg-themedarkblue"
              key={item.id}
              onClick={item.handleClick}
            >
              <span className="text-lg font-medium">{item.name}</span>
              <img src={item.src} alt="metamask" className="w-10 h-10" />
            </div>
          ))}
        </div>
      </Wallet>
      <Wallet1 open={open1} close={handleClose1}>
        <div className="text-xl p-4 font-medium flex justify-between items-center w-full border-b-2 bg-white text-themedarkblue rounded-t-3xl">
          <h1 className="">Your Wallet</h1>
          <GrClose
            className="cursor-pointer border border-white rounded-lg"
            onClick={handleClose1}
          />
        </div>
        <div className="py-4 w-full flex flex-col gap-4 items-center">
          {myState.isLogin && (
            <div
              className="cursor-pointer w-4/5 hover:bg-voilet1 hover:bg-opacity-20 rounded-xl py-2 px-2 flex gap-4 items-center"
              onClick={() => {
                copyFunction(myState.account);
              }}
            >
              <h1 className="text-ellipsis font-normal overflow-hidden truncate whitespace-nowrap">
                {myState?.account}
              </h1>
              <MdContentCopy className="w-8 h-8" />
            </div>
          )}
          <button
            className="btn w-3/5"
            onClick={() => {
              disconnectWallet(dispatch);
              handleClose1();
            }}
          >
            Disconnect
          </button>
        </div>
      </Wallet1>
    </>
  );
};

export default memo(Headers);
