import React, { memo } from "react";
import { FaDiscord, FaTelegramPlane, FaTwitter } from "react-icons/fa";
import { ImHome, ImEarth } from "react-icons/im";
import { NavLink } from "react-router-dom";

const Sidebar = ({ sidenav, setSideNav }) => {
  return (
    <div
      className={`overflow-hidden pt-6 pb-3 sticky top-0 left-0 text-white h-screen bg-themeblue border-r border-themegray flex flex-col justify-between gap-3 ${
        sidenav ? "md:w-20 w-0" : "min-w-min"
      }`}
    >
      <div className="flex flex-col mt-20">
        <NavLink
          to="/"
          className={(props) => {
            return `${props.isActive ? "activemenu " : "inactivemenu "}menu`;
          }}
          onClick={() => setSideNav(true)}
        >
          <div className="px-3">
            <ImHome />
          </div>
          <h1>Home</h1>
        </NavLink>
        <NavLink
          to="/farms"
          className={(props) => {
            return `${props.isActive ? "activemenu " : "inactivemenu "}menu`;
          }}
          onClick={() => setSideNav(true)}
          end
        >
          <div className="px-3">
            <ImEarth />
          </div>
          <h1>Farms</h1>
        </NavLink>
      </div>
      <div className={`flex-col gap-4 ${sidenav ? "hidden": "flex"}`}>
        <div className="flex gap-6 px-4 items-center justify-center">
          <div className="rounded-full bg-white shadow-lg text-themeblue cursor-pointer p-2">
            <FaTelegramPlane />
          </div>
          <div className="rounded-full bg-white shadow-lg text-themeblue cursor-pointer p-2">
            <FaTwitter />
          </div>
          <div className="rounded-full bg-white shadow-lg text-themeblue cursor-pointer p-2">
            <FaDiscord />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Sidebar);
