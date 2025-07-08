"use client";
import React, { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    localStorage.setItem("guestId", "88922968-1a72-4289-9933-3950b9a7fc33");
  }, []);
  return <div>page</div>;
};

export default Page;
