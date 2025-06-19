"use client";

import { useRouter } from "next/navigation";
import {
  useState,
  KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
} from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/animes?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  return (
    <div className="flex w-full max-w-xs items-center relative font-inter">
      <Input
        ref={inputRef}
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
