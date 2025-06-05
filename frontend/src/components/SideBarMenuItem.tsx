import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  icon: LucideIcon;
  label: string;
  link?: string;
};

const SideBarMenuItem = ({ icon: Icon, label, link = "#" }: Props) => {
  return (
    <Link href={link}>
      <div className="flex gap-3 cursor-pointer dark:hover:bg-gray-700 py-[10px] px-3 rounded-xl hover:bg-gray-100">
        <Icon />
        <p>{label}</p>
      </div>
    </Link>
  );
};

export default SideBarMenuItem;
