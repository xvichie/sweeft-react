import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

import { LuPencilRuler } from "react-icons/lu";
import { RiTakeawayFill } from "react-icons/ri";

import Hamburger from "hamburger-react";
import { Link, useNavigate } from "react-router-dom";

import { FaChevronDown } from "react-icons/fa";


function Header() {
  const [nav, setNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);


  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  const navigate = useNavigate();

  // Array containing navigation items
  const navItems = [
    { id: 1, text: "მთავარი" },
    { id: 2, text: "ისტორია" },
  ];


  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const __textcolors = ["text-black", "text-white"];
  const __backcolors = ["bg-black", "bg-transparent", "bg-white"];
  return (
    <>
      <div
        className={`bg-${
          !scrolled ? "transparent" : "white"
        } w-full flex flex-row justify-center items-center transition-all duration-150 ease-in h-20 px-4 text-white z-52`}
      >
        <div className="w-11/12  flex flex-row justify-between items-center transition-all duration-300 ease-in">
          {/* Logo */}
          <Link to={"/"}>
              <h1
                className="h-16 text-main-purple font-bold items-center flex flex-col justify-center text-lg"
              >Sweeft Gallery</h1>
          </Link>
          {/* Desktop Navigation */}
          <ul className="hidden lg:flex">
              <Link to={'/'}>
              <li
                className={`relative p-4 rounded-xl m-2 cursor-pointer duration-300 
                 sm:text-sm font-bold
                ${scrolled ? "text-main-purple" : "text-main-purple"}
                group`}
              >
                <span>{"მთავარი"}</span>
                <div
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-${
                    !scrolled ? "main-purple" : "main-purple"
                  } scale-x-0 
                    origin-left transition-transform duration-300 transform group-hover:scale-x-100`}
                ></div>
              </li>
              </Link>
              <Link to={'/history'}>
              <li
                className={`relative p-4 rounded-xl m-2 cursor-pointer duration-300 
                 sm:text-sm font-bold
                ${scrolled ? "text-main-purple" : "text-main-purple"}
                group`}
              >
                <span>{"ისტორია"}</span>
                <div
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-${
                    !scrolled ? "main-purple" : "main-purple"
                  } scale-x-0 
                    origin-left transition-transform duration-300 transform group-hover:scale-x-100`}
                ></div>
              </li>
              </Link>
          </ul>
        </div>


        {/* Mobile Navigation Icon */}
        <div onClick={handleNav} className="block lg:hidden z-50">
          {/* {nav ? <AiOutlineClose size={28} /> : <AiOutlineMenu size={28} />} */}
          <Hamburger
            toggled={nav}
            color={!scrolled || nav ? "#4a154b" : "black"}
            toggle={setNav}
            duration={0.5}
            size={30}
          />
        </div>

        {/* Mobile Navigation Menu */}
        <ul
          className={
            nav
              ? "fixed lg:hidden left-0 flex flex-col top-0 w-screen h-full border-r border-r-gray-900 bg-white ease-in-out duration-500 z-10000"
              : "ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%] flex flex-col z-10000"
          }
        >
          {/* Mobile Logo */}
          <h1
            className="h-16 w-fit m-2 text-main-purple font-bold text-3xl flex flex-col justify-center"
          >
          Sweeft Gallery
          </h1>

          {/* Mobile Navigation Items */}
          <div className="flex-1 flex flex-col">
            {navItems.map((item) => (
              <li
                key={item.id}
                className="p-6 border-b rounded-xl
                text-main-purple font-bold 
                            duration-300 hover:bg-main-purple hover:text-white cursor-pointer border-main-purple
                            text-center"
              >
                {item.text}
              </li>
            ))}
          </div>
          <div className="flex flex-col justify-center align-middle text-center items-center">
            <button
              className="btn btn-outline w-11/12
              hover:bg-main-red
              hover:text-white
              "
              onClick={() => {
                setNav(!nav);
                if (document) {
                  (
                    document.getElementById("order_modal") as HTMLFormElement
                  ).showModal();
                }
              }}
            >
              <RiTakeawayFill></RiTakeawayFill>
              შეუკვეთე ახლავე
            </button>
            <button
              className="btn btn-outline mb-4 mt-2 w-11/12
              bg-main-purple
              text-white
              hover:bg-main-red
              hover:text-white
              "
              onClick={() => {
                setNav(!nav);
                if (document) {
                  (
                    document.getElementById("login_modal") as HTMLFormElement
                  ).showModal();
                }
              }}
            >
              <LuPencilRuler></LuPencilRuler>
              შესვლა
            </button>
          </div>
        </ul>
      </div>
    </>
  );
}

export default Header;
