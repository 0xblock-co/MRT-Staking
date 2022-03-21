import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  web3: null,
  web3Modal: null,
  accounts: null,
  isLogin: false,
  provider: null,
  account: "",
  signature: "",
  networkId: null,
};

export const mrtSlice = createSlice({
  name: "mrt",
  initialState,
  reducers: {
    setWeb3: (state, action) => {
      state.web3 = action.payload;
    },
    setWeb3Modal: (state, action) => {
      state.web3Modal = action.payload;
    },
    setAccounts: (state, action) => {
      state.accounts = action.payload;
    },
    setAccount: (state, action) => {
      state.account = action.payload;
    },
    setLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setProvider: (state, action) => {
      state.provider = action.payload;
    },
    setChainId: (state, action) => {
      state.chainId = action.payload;
    },
    setNetworkId: (state, action) => {
      state.networkId = action.payload;
    },
  },
});

export const {
  setWeb3,
  setWeb3Modal,
  setAccounts,
  setAccount,
  setLogin,
  setProvider,
  setChainId,
  setNetworkId,
} = mrtSlice.actions;
export default mrtSlice.reducer;
