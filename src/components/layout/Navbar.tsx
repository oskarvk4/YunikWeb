"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCopy } from "@/components/CopyProvider";
import { categoryLabel } from "@/lib/copy-text";
import MobileMenu from "./MobileMenu";
import CartDrawer from "./CartDrawer";
import AnnouncementBar from "./AnnouncementBar";
import { CATEGORY_VALUES } from "@/lib/storefront";
import type { ProductCategory } from "@/types";

// Category links for the mobile menu. Each one only appears while it has enough pieces.
const CATEGORY_LINKS: { category: ProductCategory; href: string }[] = [
  { category: "rings", href: "/shop?category=rings" },
  { category: "necklaces", href: "/shop?category=necklaces" },
  { category: "earrings", href: "/shop?category=earrings" },
  { category: "bracelets", href: "/shop?category=bracelets" },
];

export default function Navbar({
  visibleCategories = CATEGORY_VALUES,
  announcement = [],
}: {
  visibleCategories?: ProductCategory[];
  /** Messages for the strip above the menu, from /admin/copy. */
  announcement?: string[];
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { openCart, getItemCount, hasHydrated } = useCart();
  const { user, isLoading, isAdmin, signOut } = useAuth();
  const copy = useCopy();
  const menu = copy.site.menu;
  const userMenu = copy.site.userMenu;
  const itemCount = getItemCount();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  // Header is always solid/visible — no transparent-over-hero behavior.
  const isSolid = true;

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

  const desktopLeftLinks = [
    { href: "/shop", label: menu.shop },
    { href: "/care", label: menu.care },
  ];

  const desktopRightLinks = [
    { href: "/about", label: menu.about },
    { href: "/contact", label: menu.contact },
  ];

  const mobileLinks = [
    { href: "/shop", label: menu.shop },
    ...CATEGORY_LINKS.filter((link) => visibleCategories.includes(link.category)).map((link) => ({
      href: link.href,
      label: categoryLabel(copy.site, link.category),
    })),
    { href: "/about", label: menu.about },
    { href: "/care", label: menu.care },
    { href: "/contact", label: menu.contact },
  ];

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // The shipping/returns strip above the menu. Not on the coming-soon page,
  // where there is nothing to ship yet.
  const showAnnouncement = pathname !== "/coming-soon";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm"
      >
        {showAnnouncement && <AnnouncementBar messages={announcement} />}
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-20 items-center justify-between">

            {/* Left group: mobile button (mobile) | nav links (desktop) */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`lg:hidden p-2 -ml-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 rounded-sm transition-colors duration-300 ${
                  isSolid ? "text-[#1A1A1A]" : "text-white"
                }`}
                aria-label={menu.openMenuAria}
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
              <div className="hidden lg:flex items-center space-x-8">
                {desktopLeftLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs font-sans uppercase tracking-[0.15em] hover:text-[#8D6553] transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 rounded-sm ${
                      isSolid ? "text-[#1A1A1A]" : "text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Logo - absolute-centered */}
            <Link
              href="/"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              aria-label={menu.homeAria}
            >
              <Image
                src="/yunik-wordmark.png"
                alt="Yunik"
                width={383}
                height={62}
                priority
                className="h-[22px] w-auto md:h-[26px] lg:h-[30px]"
              />
            </Link>

            {/* Right group: nav links + icons */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="hidden lg:flex items-center space-x-8 mr-4">
                {desktopRightLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs font-sans uppercase tracking-[0.15em] hover:text-[#8D6553] transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 rounded-sm ${
                      isSolid ? "text-[#1A1A1A]" : "text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              {/* Admin quick-access button */}
              {!isLoading && isAdmin && (
                <Link
                  href="/admin"
                  className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans uppercase tracking-[0.15em] border rounded-sm transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 ${
                    isSolid
                      ? "border-[#8D6553] text-[#8D6553] hover:bg-[#8D6553] hover:text-white"
                      : "border-white text-white hover:bg-white hover:text-[#1A1A1A]"
                  }`}
                  aria-label={menu.adminButtonAria}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {menu.adminButton}
                </Link>
              )}

              {/* User button/dropdown */}
              {!isLoading && (
                <div className="relative" ref={userMenuRef}>
                  {user ? (
                    <>
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className={`p-2 hover:text-[#8D6553] transition-colors duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 rounded-sm ${
                          isSolid ? "text-[#1A1A1A]" : "text-white"
                        }`}
                        aria-label={userMenu.buttonAria}
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
                                {userMenu.admin}
                              </Link>
                            )}
                            <Link
                              href="/account"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-100"
                            >
                              {userMenu.account}
                            </Link>
                            <Link
                              href="/account/orders"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-100"
                            >
                              {userMenu.orders}
                            </Link>
                            <button
                              onClick={handleSignOut}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600 cursor-pointer focus:outline-none focus-visible:bg-gray-100"
                            >
                              {userMenu.logout}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      className={`hidden lg:block text-xs font-sans uppercase tracking-[0.15em] hover:text-[#8D6553] transition-colors duration-300 ${
                        isSolid ? "text-[#1A1A1A]" : "text-white"
                      }`}
                    >
                      {userMenu.login}
                    </Link>
                  )}
                </div>
              )}

              {/* Cart button */}
              <button
                onClick={openCart}
                className={`relative p-2 -mr-2 lg:mr-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 rounded-sm transition-colors duration-300 ${
                  isSolid ? "text-[#1A1A1A]" : "text-white"
                }`}
                aria-label={menu.cartAria}
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
                  {hasHydrated && itemCount > 0 && (
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
      </header>
      {/* Pages leave 80px (pt-20) for the menu; this spacer covers the 2rem strip
          above it, so every page moves down with it. */}
      {showAnnouncement && <div aria-hidden="true" className="h-8" />}

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={mobileLinks}
      />

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
