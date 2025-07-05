import Image from "next/image";
import Link from "next/link";
import React from "react";
import ThemeButton from "./ThemeButton";
import { Separator } from "./ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Bird, Calendar, Trophy } from "lucide-react";

const TopNavBar = () => {
  return (
    <>
      <div className="sticky top-0 z-50 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10">
        <div className="flex items-center justify-between md:px-10 px-5 h-[65px] sm:pl-[150px] md:pl-[150px]">
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

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem className="sm:hidden flex">
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Animes</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/animes"
                          className="flex-row items-center gap-2"
                        >
                          <Bird />
                          All Animes
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/animes/top"
                          className="flex-row items-center gap-2"
                        >
                          <Trophy />
                          Top Animes
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/animes/seasons/now"
                          className="flex-row items-center gap-2"
                        >
                          <Calendar />
                          Seasonal Animes
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <ThemeButton />
        </div>
        <Separator />
      </div>
    </>
  );
};

export default TopNavBar;
