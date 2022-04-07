import React, { memo, useEffect, useMemo, useState } from "react";
import { ImInfo } from "react-icons/im";
import { toast } from "react-toastify";
import TimerComponent from "../../common/TimerComponent";
import {
  allowance,
  approve,
  balance,
  eligiblee,
  eligibleeReward,
  harvestToken,
  pendingTokens,
  reinvestToken,
  stakeTime,
  stakeToken,
  totalStaked,
  uid,
  withdraw,
} from "../../contract/read";
import { useAppSelector } from "../../store/store";

const Farmcard = ({
  stakingAddress,
  stakingABI,
  tokenAddress,
  tokenABI,
  setTotalBalance,
  totalBalance,
  setStakedAmount,
  stakedAmount,
  loading,
  setLoading,
}) => {
  const [authorize, setAuthorize] = useState(false);
  const [disable, setDisable] = useState(false);
  const [eligibleReward, setEligibleReward] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [withdrawStatus, setWithdrawStatus] = useState(false);
  const [amount, setAmount] = useState(0);
  const [wamount, setWithDrawAmount] = useState(0);
  const [reward, setReward] = useState(0);
  const [deposit, setDeposit] = useState([]);
  const [value, setValue] = useState(0);
  const [staketime, setStakeTime] = useState(0);

  const myState = useAppSelector((state) => state);
  const login = myState?.isLogin;
  const web3Var = myState?.web3;
  const account = myState?.accounts;

  useEffect(() => {
    const initialize = async () => {
      if (
        stakingAddress &&
        stakingABI &&
        tokenAddress &&
        tokenABI &&
        login &&
        web3Var &&
        account
      ) {
        const isApproved = await allowance(
          tokenABI,
          tokenAddress,
          stakingAddress,
          web3Var
        );

        if (isApproved > 1) {
          setAuthorize(true);
        }
        const tBalance = await balance(tokenABI, tokenAddress, web3Var);
        setTotalBalance(tBalance);

        const l = await uid(stakingABI, stakingAddress, web3Var);

        let arr = [];
        for (let i = 1; i <= l; i++) {
          if (!arr.includes(i)) arr.push(i);
        }
        setDeposit(arr);
      }
    };
    if (login) {
      initialize();
    } else {
      setTotalBalance(0);
      setReward(0);
      setStakedAmount(0);
      setValue(0);
      setAuthorize(false);
    }
  }, [
    stakingAddress,
    tokenAddress,
    tokenABI,
    stakingABI,
    login,
    web3Var,
    account,
    setStakedAmount,
    setTotalBalance
  ]);

  const approveStakingContract = async () => {
    try {
      setDisable(true);
      setLoading(true);
      const approved = await approve(
        tokenABI,
        tokenAddress,
        stakingAddress,
        web3Var
      );
      setLoading(false);
      toast.success("Approved successfully");
      if (approved) {
        setAuthorize(true);
      }
      setDisable(false);
    } catch (e) {
      setDisable(false);
      setLoading(false);
      toast.error(e);
    }
  };

  const stakeTkn = async (value) => {
    if (Number(amount) > Number(totalBalance)) {
      toast.error("Amount is greater than your Wallet Balance.");
    } else {
      try {
        setDisable(true);
        setLoading(true);
        await stakeToken(stakingABI, stakingAddress, amount, web3Var);
        setAmount(0);
        setLoading(false);
        toast.success("Staking process complete");
        setDisable(false);
        const l = await uid(stakingABI, stakingAddress, web3Var);
        let arr = [];
        for (let i = 1; i <= l; i++) {
          if (!arr.includes(i)) arr.push(i);
        }
        setDeposit(arr);
        const tBalance = await balance(tokenABI, tokenAddress, web3Var);
        setTotalBalance(tBalance);
        const staked = await totalStaked(
          stakingABI,
          stakingAddress,
          web3Var,
          value
        );
        setStakedAmount(staked);
      } catch (e) {
        setDisable(false);
        setLoading(false);
        toast.error(e);
      }
    }
  };

  const withdrawTkn = async (value) => {
    try {
      setDisable(true);
      setLoading(true);
      await withdraw(stakingABI, stakingAddress, web3Var, value);
      setAmount(0);
      setLoading(false);
      toast.success("Withdraw process complete");
      Eligiblity();
      EligibilityReward();
      setDisable(false);
      const staked = await totalStaked(
        stakingABI,
        stakingAddress,
        web3Var,
        value
      );
      setStakedAmount(staked);
      const tBalance = await balance(tokenABI, tokenAddress, web3Var);
      setTotalBalance(tBalance);
      const rewards = await pendingTokens(
        stakingABI,
        stakingAddress,
        web3Var,
        value
      );
      setReward(rewards);
    } catch (e) {
      setDisable(false);
      setLoading(false);
      toast.error(e);
    }
  };

  const harvestStakingContract = async (value) => {
    try {
      setLoading(true);
      setDisable(true);
      await harvestToken(stakingABI, stakingAddress, web3Var, value);
      setLoading(false);
      toast.success("Reward Collection Successful");
      EligibilityReward();
      setDisable(false);
      const rewards = await pendingTokens(
        stakingABI,
        stakingAddress,
        web3Var,
        value
      );
      setReward(rewards);
      const tBalance = await balance(tokenABI, tokenAddress, web3Var);
      setTotalBalance(tBalance);
    } catch (e) {
      setDisable(false);
      setLoading(false);
      toast.error(e);
    }
  };

  const reinvestStakingContract = async (value) => {
    try {
      console.log("hellobjn");
      setLoading(true);
      setDisable(true);
      await reinvestToken(stakingABI, stakingAddress, web3Var, value);
      // console.log("reinvest", s)
      setLoading(false);
      toast.success("ReInvest Reward Successful");
      setDisable(false);
      EligibilityReward();
      const rewards = await pendingTokens(
        stakingABI,
        stakingAddress,
        web3Var,
        value
      );
      setReward(rewards);
      const staked = await totalStaked(
        stakingABI,
        stakingAddress,
        web3Var,
        value
      );
      setStakedAmount(staked);
    } catch (e) {
      setDisable(false);
      setLoading(false);
      toast.error(e);
    }
  };

  const maxValue = () => {
    setAmount(totalBalance);
  };

  const Rewards = async (value) => {
    let rewards = 0;
    if (login) {
      rewards = await pendingTokens(stakingABI, stakingAddress, web3Var, value);
    }
    setReward(rewards);
  };

  const Eligiblity = async (value) => {
    if (login) {
      const val = await eligiblee(stakingABI, stakingAddress, web3Var, value);
      setEligible(val);
    }
  };

  const EligibilityReward = async (value) => {
    if (login) {
      const val = await eligibleeReward(
        stakingABI,
        stakingAddress,
        web3Var,
        value
      );
      setEligibleReward(val);
    }
  };

  const handleChange = async (e) => {
    setValue(e.target.value);
    Eligiblity(e.target.value);
    EligibilityReward(e.target.value);
    const rewards = await pendingTokens(
      stakingABI,
      stakingAddress,
      web3Var,
      e.target.value
    );
    setReward(rewards);
    const staked = await totalStaked(
      stakingABI,
      stakingAddress,
      web3Var,
      e.target.value
    );
    setStakedAmount(staked);
    const timestake = await stakeTime(
      stakingABI,
      stakingAddress,
      web3Var,
      e.target.value
    );

    console.log("hello", e.target.value);
    const currentT = new Date().getTime();
    setStakeTime(Number(parseInt(currentT / 1000) - timestake.timestamp));
    setWithdrawStatus(timestake.withdrawStatus);
  };

  useMemo(() => {
    setWithDrawAmount(Number(stakedAmount) + Number(reward));
  }, [stakedAmount, reward]);

  setInterval(() => {
    Eligiblity(value);
    EligibilityReward(value);
    Rewards(value);
  }, 60000);

  return (
    <div className="cards flex flex-col gap-6 md:w-96 w-80">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">MRT</h1>
        <select
          className="btn px-3 py-2 outline-none"
          onChange={(e) => handleChange(e)}
        >
          <option value={0}>Select deposit</option>
          {deposit.map((item) => (
            <option key={item} value={item}>
              Deposit {item}
            </option>
          ))}
        </select>
        <ImInfo className="cursor-pointer" />
      </div>
      <div className="grid grid-cols-2">
        <h1>APR:</h1>
        <p className="font-medium text-right">40%</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <h1>Balance</h1>
        <p className="font-medium text-right">{totalBalance}</p>
        <h1>Staked</h1>
        <p className="font-medium text-right">{stakedAmount}</p>
      </div>
      {authorize ? (
        <div className="flex flex-col gap-2">
          <p className="uppercase text-sm">MRT Deposit</p>
          <div className="input">
            <input
              type="text"
              value={amount > 0 ? amount : ``}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={0}
              disabled={disable}
              className="bg-transparent outline-none pl-4 w-5/6"
            />
            <button
              className="bg-white rounded-full text-themedarkblue uppercase px-3 py-1"
              disabled={disable}
              onClick={maxValue}
            >
              Max
            </button>
          </div>
          <button
            className="btn w-full uppercase"
            disabled={disable}
            onClick={() => stakeTkn(value)}
          >
            Deposit
          </button>
        </div>
      ) : (
        <button
          className="btn uppercase"
          disabled={disable}
          onClick={approveStakingContract}
        >
          Approve
        </button>
      )}
      <hr></hr>
      {value > 0 && withdrawStatus === false && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <p className="uppercase text-sm">Staked Time</p>
            <div className="relative hover-parent">
              <ImInfo className="cursor-pointer" />
              <div className="absolute -top-8 -right-8 hover-child">
                <div
                  className={`px-3 py-1 shadow-lg min-w-min bg-white text-themepurple border border-white items-center rounded-md w-full flex`}
                >
                  <h1 className="whitespace-nowrap">
                    Time will be reset after Reinvest.
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <TimerComponent stakeTime={staketime} />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <p className="uppercase text-sm">MRT Earned</p>
        <div className="input py-1">
          <input
            type="text"
            placeholder="0"
            value={reward > 0 ? reward : ``}
            disabled={true}
            className="bg-transparent w-full px-4 outline-none"
          />
        </div>
        <div className="flex gap-4">
          <button
            className="btn uppercase w-full"
            disabled={!eligibleReward}
            onClick={() => harvestStakingContract(value)}
          >
            Claim MRT
          </button>
          <button
            className="btn uppercase w-full"
            disabled={!eligibleReward}
            onClick={() => reinvestStakingContract(value)}
          >
            Reinvest MRT
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="uppercase text-sm">MRT Withdraw</p>
        <div className="input py-1">
          <input
            type="text"
            value={wamount > 0 ? wamount : ``}
            placeholder={0}
            disabled={true}
            className="bg-transparent w-full px-4 outline-none"
          />
        </div>
        <button
          className="btn uppercase w-full"
          disabled={!eligible}
          onClick={() => withdrawTkn(value)}
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default memo(Farmcard);
