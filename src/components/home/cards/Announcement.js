import React, { memo } from "react";

const Announcement = () => {
  return (
    <div className="cards flex flex-col gap-6">
      <h1 className="text-2xl">Announcements</h1>
      <span className="text-5xl font-bold">Coming soon...</span>
    </div>
  );
};

export default memo(Announcement);
