import React from "react";
import Timer from "react-compound-timer/build";

const TimerComponent = ({ stakeTime }) => {
  console.log(stakeTime)
  const timing = Number(stakeTime) * 1000;
  return (
    <div>
      <Timer initialTime={timing} key={stakeTime}>
        {() =>
            <div className="bg-white rounded-full px-4 py-2 font-medium text-themepurple flex gap-2 justify-center">
              <div>
                <Timer.Days /> days
              </div>
              <div>
                <Timer.Hours /> hours
              </div>
              <div>
                <Timer.Minutes /> minutes
              </div>
              <div>
                <Timer.Seconds /> seconds
              </div>
            </div>
        }
      </Timer>
    </div>
  );
};

export default TimerComponent;
