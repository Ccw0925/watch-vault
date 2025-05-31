import { type LucideIcon } from "lucide-react";
import React from "react";

type Props = {
  icon: LucideIcon;
  label: string;
};

const SideBarMenuItem = ({ icon: Icon, label }: Props) => {
  return (
    <div className="flex gap-3">
      <Icon />
      <p>{label}</p>
    </div>
  );
};

export default SideBarMenuItem;
