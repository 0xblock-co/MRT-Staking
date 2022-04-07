import React, { memo } from "react";
import { totalValueLocked } from "../../contract/read";
import { useAppSelector } from "../../store/store";

const TotalValuecard = ({ stakingAddress, tokenABI, tokenAddress }) => {
  const [balance, setBalance] = React.useState(0);

  const myState = useAppSelector((state) => state);
  const web3Var = myState?.web3;

  React.useEffect(() => {
    const initialize = async () => {
      if (stakingAddress && tokenABI && tokenAddress && web3Var) {
        const tBalance = await totalValueLocked(
          tokenABI,
          tokenAddress,
          web3Var,
          stakingAddress
        );
        setBalance(tBalance);
      }
    };
      initialize();
  }, [stakingAddress, tokenABI, tokenAddress, web3Var]);

  return (
    <div className="cards flex flex-col gap-6">
      <h1 className="text-2xl">Total Value Locked (TVL)</h1>
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-extrabold">{balance}</h1>
        {/* <p className="font-light">Lorem Ipsum value</p> */}
      </div>
    </div>
  );
};

export default memo(TotalValuecard);
