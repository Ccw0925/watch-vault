"use client";
import React from "react";
import Dashboard from "@/components/home/Dashboard";
import SideBar from "@/components/SideBar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-70px)]">
      <div className="grid lg:grid-cols-[280px_calc(100%-280px)] grid-cols-1 flex-1 px-5">
        <SideBar className="hidden lg:block" />
        <Dashboard className="max-h-[calc(100vh-81px)]" />
      </div>
    </div>
  );
}
