"use client";

import type { FC } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Move Magazine</h1>
        <h4>(Volume 1 - Issue 2 / October 1989)</h4>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuToggle}
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" />
      </Button>
    </header>
  );
};

export default Header;
