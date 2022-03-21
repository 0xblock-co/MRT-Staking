import React, { memo } from "react";

const TotalValuecard = () => {
  return (
    <div className="cards flex flex-col gap-6">
      <h1 className="text-2xl">Total Value Locked (TVL)</h1>
      <div className="flex flex-col gap-3">
        <h1 className="text-5xl font-extrabold">$15246320</h1>
        <p className="font-light">Lorem Ipsum value</p>
      </div>
    </div>
  );
};

export default memo(TotalValuecard);
