import React, { memo } from "react";

const Statscard = () => {
  return (
    <div className="cards flex flex-col gap-6">
      <h1 className="text-2xl">Stats</h1>
      <div className="grid grid-cols-2 items-center gap-2">
        <h2 className="font-light">Circulating Supply</h2>
        <p className="text-lg font-bold text-right">0</p>
        <h2 className="font-light">Market Cap</h2>
        <p className="text-lg font-bold text-right">0</p>
        <h2 className="font-light">MRT Price</h2>
        <p className="text-lg font-bold text-right">0</p>
      </div>
    </div>
  );
};

export default memo(Statscard);
