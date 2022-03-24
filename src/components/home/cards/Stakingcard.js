import React, { memo, useEffect, useState } from "react";
import { balance, pendingTokens, uid } from "../../contract/read";
import { useAppSelector } from "../../store/store";

const Stakingcard = ({
  stakingAddress,
  stakingABI,
  tokenAddress,
  tokenABI,
}) => {
  const [reward, setReward] = useState(0);
  const [wbalance, setBalance] = useState(0);

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
        const tBalance = await balance(tokenABI, tokenAddress, web3Var);
        setBalance(tBalance);
        const l = await uid(stakingABI, stakingAddress, web3Var);
        let sum = 0;
        for (let i = 1; i <= l; i++) {
          const rewards = await pendingTokens(
            stakingABI,
            stakingAddress,
            web3Var,
            i
          );
          sum += rewards;
        }
        setReward(sum);
      }
    };
    if (login) {
      initialize();
    } else {
      setBalance(0);
      setReward(0);
    }
  }, [
    stakingAddress,
    tokenAddress,
    tokenABI,
    stakingABI,
    login,
    web3Var,
    account,
  ]);
  return (
    <div className="cards flex flex-col gap-6">
      <h1 className="text-2xl">Staking</h1>
      <div className="flex flex-col gap-2">
        <h2 className="font-light text-lg">MRT Earned</h2>
        <p className="font-light text-themegray">LOCKED</p>
        <h2 className="text-xl font-medium">{reward}</h2>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-light text-lg">MRT in Wallet</h2>
        <p className="font-light text-themegray">LOCKED</p>
        <h2 className="text-xl font-medium">{wbalance}</h2>
      </div>
    </div>
  );
};

export default memo(Stakingcard);
