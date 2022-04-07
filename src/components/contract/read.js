import { setAccounts } from "../store/mrtSlice";
import { store } from "../store/store";

export const getAccount = async () => {
  try {
    const account = store.getState().accounts; //await window.ethereum.request({ method: "eth_accounts" });

    return account;
  } catch (error) {
    return "";
  }
};

export const hexToNumber = (hex) => window?.web3.utils.hexToNumber(hex);

export const getChainId = async () => {
  try {
    const chainId = await window?.web3?.eth?.getChainId();
    localStorage.setItem("chainId", hexToNumber(chainId));
    const checkNetwork =
      hexToNumber(chainId) === 1 || hexToNumber(chainId) === 56;
    localStorage.setItem("correctNetwork", `${checkNetwork}`);
    return hexToNumber(chainId);
  } catch (e) {
    return "";
  }
};

export const chainChanged = async () => {
  window.ethereum.on("chainChanged", (chainId) => {
    localStorage.setItem("chainId", hexToNumber(chainId));
    window.location.reload();
  });
};

export const accountsChanged = async (account) => {
  store.dispatch(setAccounts(account));
};

export const getBalance = async (account) => {
  const balance = await window?.web3.eth.getBalance(account);
  return (balance / Math.pow(10, 18)).toFixed(4);
};

export const stakeToken = async (
  stakingABI,
  stakingAddress,
  amount,
  web3Var
) => {
  try {
    const account = await getAccount();
    if (!account.length) {
      return 0;
    }
    const reqAmount = web3Var.utils.toWei(amount, "ether");
    const contract = new web3Var.eth.Contract(stakingABI, stakingAddress);
    return contract.methods.deposit(reqAmount).send({ from: account[0] });
  } catch (error) {
    throw error;
  }
};

export const withdraw = async (stakingABI, stakingAddress, web3Var, value) => {
  try {
    const account = await getAccount();
    if (!account.length) {
      return 0;
    }

    const contract = new web3Var.eth.Contract(stakingABI, stakingAddress);
    return contract.methods.withdraw(value).send({ from: account[0] });
  } catch (error) {
    throw error;
  }
};

export const harvestToken = async (stakingABI, stakingAddress, web3Var, value) => {
  try {
    const account = await getAccount();
    if (!account.length) {
      return 0;
    }
    const contract = new web3Var.eth.Contract(stakingABI, stakingAddress);
    return contract.methods.claimReward(value).send({ from: account[0] });
  } catch (error) {
    throw error;
  }
};

export const reinvestToken = async (stakingABI, stakingAddress, web3Var, value) => {
  try {
    console.log("in")
    const account = await getAccount();
    if (!account.length) {
      return 0;
    }
    const contract = new web3Var.eth.Contract(stakingABI, stakingAddress);
    console.log("contract",contract)
    return contract.methods.reinvestReward(value).send({ from: account[0] });
  } catch (error) {
    throw error;
  }
};

export const balance = async (tokenABI, tokenAddress, web3Var) => {
  try {
    const account = await getAccount();
    if (!account.length) {
      return 0;
    }

    const contract = new web3Var.eth.Contract(tokenABI, tokenAddress);

    const tokenBalance = await contract.methods.balanceOf(account[0]).call();

    return web3Var.utils.fromWei(tokenBalance, "ether");
  } catch (error) {
    console.log(error)
    return 0;
  }
};

export const totalValueLocked = async (tokenABI, tokenAddress, web3Var, stakingAddress) => {
  try {
    const contract = new web3Var.eth.Contract(tokenABI, tokenAddress);

    const tokenBalance = await contract.methods.balanceOf(stakingAddress).call();

    return web3Var.utils.fromWei(tokenBalance, "ether");
  } catch (error) {
    console.log(error)
    return 0;
  }
};

export const totalStaked = async (stakingABI, stakingAddress, web3Var, value) => {
  try {
    const account = await getAccount();
    if (!account.length) {
      return 0;
    }
    const contract = new web3Var.eth.Contract(stakingABI, stakingAddress);
    const staked = await contract.methods.userInfo(account[0], value).call();
    return web3Var.utils.fromWei(staked.depositAmount, "ether");
  } catch (error) {
    return 0;
  }
};

export const stakeTime = async (stakingABI, stakingAddress, web3Var, value) => {
  try {
    const account = await getAccount();
    if (!account.length) {
      return 0;
    }
    const contract = new web3Var.eth.Contract(stakingABI, stakingAddress);
    const timev = await contract.methods.userInfo(account[0], value).call();
    return timev;
  } catch (error) {
    return 0;
  }
};


export const pendingTokens = async (stakingABI, stakingAddress, web3Var, value) => {
  try {
    const account = await getAccount();
    if (!account.length) {
      return 0;
    }
    const contract = new web3Var.eth.Contract(stakingABI, stakingAddress);

    const rewards = await contract.methods.calculateRewards(account[0], value).call();
    return rewards / Math.pow(10, 18);
  } catch (error) {
    return 0;
  }
};

export const uid = async (stakingABI, stakingAddress, web3Var) => {
  try {
    const account = await getAccount();
    if (!account.length) {
      return 0;
    }
    const contract = new web3Var.eth.Contract(stakingABI, stakingAddress);

    const value = await contract.methods.uid(account[0]).call();
    return value;
  } catch (error) {
    return 0;
  }
};

export const eligiblee = async (stakingABI, stakingAddress, web3Var, value) => {
  try {
    const account = await getAccount();
    if (!account.length) {
      return 0;
    }
    const contract = new web3Var.eth.Contract(stakingABI, stakingAddress);
    const val = await contract.methods.checkEligibility(account[0], value).call();
    return val;
  } catch (error) {
    return true;
  }
};

export const eligibleeReward = async (stakingABI, stakingAddress, web3Var, value) => {
  try {
    const account = await getAccount();
    if (!account.length) {
      return 0;
    }
    const contract = new web3Var.eth.Contract(stakingABI, stakingAddress);

    const val = await contract.methods
      .checkRewardEligibility(account[0], value)
      .call();
    return val;
  } catch (error) {
    return true;
  }
};

export const approve = async (
  tokenABI,
  tokenAddress,
  stakingAddress,
  web3Var
) => {
  try {
    const account = await getAccount();
    if (!account.length) {
      return 0;
    }
    const contract = new web3Var.eth.Contract(tokenABI, tokenAddress);
    const UINT256_MAX =
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    return contract.methods
      .approve(stakingAddress, UINT256_MAX)
      .send({ from: account[0] });
  } catch (error) {
    throw error;
  }
};

export const allowance = async (
  tokenABI,
  tokenAddress,
  stakingAddress,
  web3Var
) => {
  try {
    const account = await getAccount();
    if (!account.length) {
      return 0;
    }
    const tokenContract = new web3Var.eth.Contract(tokenABI, tokenAddress);

    const allowanceResponse = await tokenContract.methods
      .allowance(account[0], stakingAddress)
      .call();
    return allowanceResponse;
  } catch (error) {
    return 0;
  }
};
