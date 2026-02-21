"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/components/auth/AuthProvider";
import MobileMenu from "./MobileMenu";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { openCart, getItemCount } = useCart();
  const { user, isLoading, isAdmin, signOut } = useAuth();
  const itemCount = getItemCount();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/shop?category=rings", label: "Ringe" },
    { href: "/shop?category=necklaces", label: "Halskæder" },
    { href: "/shop?category=earrings", label: "Øreringe" },
    { href: "/shop?category=bracelets", label: "Armbånd" },
    { href: "/about", label: "Om Yunik" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 rounded-sm"
              aria-label="Åbn menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Desktop nav links - left */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-sans uppercase tracking-[0.15em] text-[#1A1A1A] hover:text-[#8D6553] transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 rounded-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Logo - center */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
            >
              <h1 className="font-serif text-2xl md:text-3xl font-light tracking-[0.2em] text-[#1A1A1A]">
                YUNIK
              </h1>
            </Link>

            {/* Desktop nav links - right */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.slice(3).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-sans uppercase tracking-[0.15em] text-[#1A1A1A] hover:text-[#8D6553] transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 rounded-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* User menu and Cart */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* User button/dropdown */}
              {hasMounted && !isLoading && (
                <div className="relative" ref={userMenuRef}>
                  {user ? (
                    <>
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="p-2 hover:text-[#8D6553] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 rounded-sm"
                        aria-label="Brugermenu"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {isUserMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-gray-100 py-2 z-50"
                          >
                            <div className="px-4 py-2 border-b border-gray-100">
                              <p className="text-xs text-dark/60 truncate">
                                {user?.email}
                              </p>
                            </div>
                            {isAdmin && (
                              <Link
                                href="/admin"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="block px-4 py-2 text-sm hover:bg-gray-50 text-[#8D6553] font-medium focus:outline-none focus-visible:bg-gray-100"
                              >
                                Admin Panel
                              </Link>
                            )}
                            <Link
                              href="/account"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-100"
                            >
                              Min Konto
                            </Link>
                            <Link
                              href="/account/orders"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-100"
                            >
                              Mine Ordrer
                            </Link>
                            <button
                              onClick={handleSignOut}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600 cursor-pointer focus:outline-none focus-visible:bg-gray-100"
                            >
                              Log ud
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="hidden lg:block text-xs font-sans uppercase tracking-[0.15em] text-[#1A1A1A] hover:text-[#8D6553] transition-colors duration-300"
                    >
                      Log ind
                    </Link>
                  )}
                </div>
              )}

              {/* Cart button */}
              <button
                onClick={openCart}
                className="relative p-2 -mr-2 lg:mr-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 rounded-sm"
                aria-label="Åbn kurv"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <AnimatePresence>
                  {hasMounted && itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-[#8D6553] text-white text-[10px] font-sans font-medium rounded-full flex items-center justify-center"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={navLinks}
      />

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
