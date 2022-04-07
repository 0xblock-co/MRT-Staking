import React, { memo } from "react";
import { Timeline } from "react-twitter-widgets";

const Announcement = () => {
  return (
    <div className="cards flex flex-col gap-6">
      <h1 className="text-2xl">Announcements</h1>
      <Timeline
        dataSource={{
          sourceType: "profile",
          screenName: "MyRealityGG",
        }}
        options={{
          // theme: "dark",
          height: "250",
          chrome: "noheader, nofooter",
          width: "100%",
        }}
        renderError={_err =>
          "Could not load timeline!"
        }
      />
    </div>
  );
};

export default memo(Announcement);
