"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-1.5 rounded-lg">
            <Mail className="w-5 h-5 text-text-light" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            MailMaker <span className="text-accent">AI</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-light/80">
          <Link
            href="#features"
            className="hover:text-accent transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-accent transition-colors"
          >
            How it Works
          </Link>
          <Link href="#pricing" className="hover:text-accent transition-colors">
            Pricing
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium hover:text-accent transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-accent hover:bg-accent/90 text-text-light px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex flex-col items-center justify-center w-8 h-6 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-4 flex flex-col justify-between">
            <div
              className={`w-full h-0.5 bg-text-light transition-all duration-300 ease-in-out origin-left ${
                isOpen ? "rotate-45 translate-x-1 translate-y-[-1px]" : ""
              }`}
            />
            <div
              className={`w-full h-0.5 bg-text-light transition-all duration-300 ease-in-out ${
                isOpen ? "opacity-0 -translate-x-2" : "opacity-100"
              }`}
            />
            <div
              className={`w-full h-0.5 bg-text-light transition-all duration-300 ease-in-out origin-left ${
                isOpen ? "-rotate-45 translate-x-1 translate-y-[1px]" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Container */}
      <div
        className={`md:hidden absolute top-full left-0 w-full glass border-b border-white/10 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 py-6" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="flex flex-col items-center gap-6 text-sm font-medium text-text-light/80 px-6">
          <Link
            href="#features"
            onClick={() => setIsOpen(false)}
            className="hover:text-accent transition-colors w-full text-center py-2"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            onClick={() => setIsOpen(false)}
            className="hover:text-accent transition-colors w-full text-center py-2"
          >
            How it Works
          </Link>
          <Link
            href="#pricing"
            onClick={() => setIsOpen(false)}
            className="hover:text-accent transition-colors w-full text-center py-2"
          >
            Pricing
          </Link>
          <div className="w-full h-px bg-white/10" />
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="hover:text-accent transition-colors w-full text-center py-2"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            onClick={() => setIsOpen(false)}
            className="bg-accent hover:bg-accent/90 text-text-light w-full py-3 rounded-full text-sm font-semibold transition-all text-center"
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
};
