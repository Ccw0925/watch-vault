"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

type Props = {
  btnText?: string;
  redirectUrl?: string;
};

const BackButton = ({ btnText = "Back", redirectUrl = "/" }: Props) => {
  const arrow = {
    initial: { x: 0 },
    hover: { x: -4 },
  };

  return (
    <Link href={redirectUrl}>
      <motion.div
        whileHover="hover"
        className="
            hover:bg-accent hover:text-accent-foreground 
            dark:hover:bg-accent/50 
            cursor-pointer 
            h-9 px-4 py-2 
            has-[>svg]:px-3 
            font-inter 
            inline-flex items-center justify-center gap-2 
            whitespace-nowrap 
            rounded-md 
            text-sm font-medium 
            transition-all 
            disabled:pointer-events-none disabled:opacity-50 
            [&_svg]:pointer-events-none 
            [&_svg:not([class*='size-'])]:size-4 
            shrink-0 
            [&_svg]:shrink-0 
            outline-none 
            focus-visible:border-ring 
            focus-visible:ring-ring/50 
            focus-visible:ring-[3px] 
            aria-invalid:ring-destructive/20 
            dark:aria-invalid:ring-destructive/40 
            aria-invalid:border-destructive
        "
      >
        <div className="flex gap-2 items-center">
          <motion.div variants={arrow}>
            <ArrowLeft />
          </motion.div>
          {btnText}
        </div>
      </motion.div>
    </Link>
  );
};

export default BackButton;
