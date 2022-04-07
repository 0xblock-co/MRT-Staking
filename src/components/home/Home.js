import React, { memo } from "react";
import Announcement from "./cards/Announcement";
import Stakingcard from "./cards/Stakingcard";
import Statscard from "./cards/Statscard";
import TotalValuecard from "./cards/TotalValuecard";
import { Staking_Address, Token_Address } from "../contract/Addresses";
import StakingABI from "../contract/ABI/Staking.json";
import TokenABI from "../contract/ABI/Token.json";

const Home = () => {
  return (
    <div className="text-white p-4 w-full">
      <div className="mt-24 flex flex-1 flex-col items-center gap-6">
        <h1 className="uppercase text-4xl font-semibold text-center w-full">
          Myreality
        </h1>
        <p className="text-center">
          Where Your Dreams Become Reality! Metaverse Game Development Studio.
        </p>
        <div className="grid lg:grid-cols-2 grid-cols-1 md:gap-6 gap-4">
          <Stakingcard
            stakingAddress={Staking_Address}
            tokenAddress={Token_Address}
            tokenABI={TokenABI}
            stakingABI={StakingABI}
          />
          <Announcement />
          <Statscard />
          <TotalValuecard
            stakingAddress={Staking_Address}
            tokenAddress={Token_Address}
            tokenABI={TokenABI}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Home);
