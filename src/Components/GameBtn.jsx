import React, { forwardRef } from "react";

const GameBtn = forwardRef(({ color,  bg, onClick }, ref) => (
  <button
    color={color}
    ref={ref}
    className={` ${bg} w-[150px] sm:w-[180px] h-[150px] sm:h-[180px] m-2 duration-200 hover:scale-105`}
    onClick={onClick}
  />
));

export default GameBtn;
