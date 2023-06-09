import * as React from "react";

const Navbar = () => {
  return (
    <nav className="  shadow shadow-slate-200 sticky top-0 z-10 bg-white px-2 md:px-0 ">
      <div className=" flex justify-start text-stone-500 h-20 items-center container mx-auto  ">
        <h1 className=" text-xl font-bold font-shadow ">SendSages</h1>
      </div>
    </nav>
  );
};

export default Navbar;
