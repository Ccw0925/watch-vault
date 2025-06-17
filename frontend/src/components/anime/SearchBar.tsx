"use client";

import { useRouter } from "next/navigation";
import { useState, KeyboardEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/animes?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex w-full max-w-xs items-center relative font-inter">
      <Input
        type="text"
        placeholder="Search animes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 rounded-full text-center focus:text-left focus:pl-11"
      />
      <Button
        type="button"
        onClick={handleSearch}
        variant="ghost"
        size="icon"
        aria-label="Search"
        className="rounded-full absolute left-2 cursor-pointer"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
