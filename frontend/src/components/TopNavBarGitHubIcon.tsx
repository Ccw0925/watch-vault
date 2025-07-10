"use client";
import React from "react";
import GitHubIcon from "./icons/GitHubIcon";
import { motion } from "motion/react";
import Link from "next/link";

const TopNavBarGitHubIcon = () => (
  <Link href="https://github.com/Ccw0925/watch-vault" target="_blank">
    <motion.div
      whileHover={{ scale: 1.15 }}
      className="hidden sm:block cursor-pointer fill-black dark:fill-white"
    >
      <GitHubIcon />
    </motion.div>
  </Link>
);

export default TopNavBarGitHubIcon;
