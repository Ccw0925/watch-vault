import Image from "next/image";
import Link from "next/link";
import React from "react";
import ThemeButton from "./ThemeButton";
import { Separator } from "./ui/separator";

const TopNavBar = () => {
  return (
    <>
      <div className="sticky top-0 z-50 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10">
        <div className="flex justify-end items-center md:px-10 px-5 h-[65px]">
          <div className="absolute top-0 left-5 hidden sm:block h-[55px] w-[125px]">
            <Link href="/">
              <Image
                src="/logo-transparent.png"
                alt="Logo"
                width={125}
                height={55}
                priority
              />
            </Link>
          </div>
          <ThemeButton />
        </div>
        <Separator />
      </div>
    </>
  );
};

export default TopNavBar;
