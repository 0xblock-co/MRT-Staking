import { useEffect } from "react";
import Web3 from "web3";
import WallectConnect from "@walletconnect/client";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { setAccounts, setLogin } from "../store/mrtSlice";
import { toast } from "react-toastify";

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const start_and_end = (str) => {
  if (str)
    if (str.length > 10) {
      return str.substr(0, 4) + "..." + str.substr(str.length - 4, str.length);
    }
  return str;
};

export const useOutsideClick = (ref, containerRef, callback) => {
  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    const refValue = containerRef.current;
    refValue && refValue.addEventListener("click", handleClick);
    refValue && refValue.addEventListener("keypress", handleClick);

    return () => {
      refValue && refValue.removeEventListener("click", handleClick);
    };
  });
};

export const copyFunction = (val) => {
  navigator.clipboard.writeText(val);
  toast.info("Copied Successfully");
};

export const createProvider = async (walletType, walletsession) => {
  if (
    [
      process.env.REACT_APP_METAMASK,
      process.env.REACT_APP_TRUSTWALLET,
    ].includes(walletType)
  )
    return Web3.givenProvider;
  else if (walletType === process.env.REACT_APP_WALLETCONNECT) {
    const options = { infuraId: process.env.REACT_APP_INFURA_ID };

    if (walletsession) {
      const connector = new WallectConnect({
        bridge: "https://bridge.walletconnect.org",
        storageId: "walletconnect",
      });
      connector.session = walletsession;
      options.connector = connector;
      const provider = new WalletConnectProvider(options);
      provider.enable();
      return provider;
    } else {
      return new WalletConnectProvider(options);
    }
  } else return Web3.givenProvider;
};

export const disconnectWallet = (dispatch) => {
  dispatch(setAccounts([]));
  dispatch(setLogin(false));
  localStorage.clear();
};

export const errMsg = {
  // MAINNET_NETWORK_ERROR: "Please make sure you are Connected to the Rinkeby Network in your wallet!",
  MAINNET_NETWORK_ERROR:
    "Please make sure you are Connected to the Ethereum Main Network in your wallet!",
  EMPTY_AMOUNT: "Amount can't be empty",
  USER_REJECTED_APPROVAL: "User denied transaction signature",
  INSTALL_META:
    "The wallet hasn’t been installed on your device. Please download and install it first.",
  INSTALL_TRUST:
    "The wallet hasn’t been installed on your device. Please download and install it first.",
  USER_REJECTED_REQUEST: "Please Authorize to access your account",
  TERMS_AND_CONDITION: "Please Accept the terms and condition",
  APPROVAL_UNSECCESFULL: "Approval Unsuccessfull",
  SWAP_UNSECCESSFULL: "Swap Unseccessfull",
  LOW_ETHER: "Low ethereum Add ETH in your wallet before swap",
  SWITCH_NETWORK: "Please Switch network to Rinkeby",
};
