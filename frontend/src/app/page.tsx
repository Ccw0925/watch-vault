"use client";
import React from "react";
import ThemeButton from "@/components/ThemeButton";
import Dashboard from "@/components/home/Dashboard";
import SideBar from "@/components/SideBar";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-end items-center px-10 h-[80px]">
        <ThemeButton />
      </div>

      <Separator />

      <div className="grid grid-cols-[280px_1fr] flex-1 px-5">
        <SideBar />
        <Dashboard className="max-h-[calc(100vh-81px)]" />
      </div>
    </div>
  );
}
