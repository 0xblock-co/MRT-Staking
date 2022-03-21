import React, { memo, useState } from "react";
import Farmcard from "./card/Farmcard";
import { Staking_Address, Token_Address } from "../contract/Addresses";
import StakingABI from "../contract/ABI/Staking.json";
import TokenABI from "../contract/ABI/Token.json";
import mrt from "../../assets/mrt.png"

const Farms = () => {
  const [stakedAmount, setStakedAmount] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(false)

  return (
    <>
      {loading && (
        <div className="fixed h-screen z-50 flex flex-col gap-4 bg-white bg-opacity-50 justify-center w-full items-center">
          <img src={mrt} alt="loading" className="animate-bounce w-60 h-60" />
        </div>
      )}
      <div className="text-white p-4 w-full">
        <div className="mt-24 flex flex-1 flex-col items-center gap-6">
          <h1 className="uppercase text-4xl font-semibold text-center w-full">
            Myreality Staking Pools
          </h1>
          <p className="text-center">
            Where Your Dreams Become Reality! Metaverse Game Development Studio
          </p>
          <div className="flex items-center justify-center">
            <Farmcard
              stakingAddress={Staking_Address}
              tokenAddress={Token_Address}
              tokenABI={TokenABI}
              stakingABI={StakingABI}
              setStakedAmount={setStakedAmount}
              stakedAmount={stakedAmount}
              totalBalance={totalBalance}
              setTotalBalance={setTotalBalance}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Farms);
