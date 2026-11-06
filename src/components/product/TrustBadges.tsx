"use client";

import type { ReactNode } from "react";
import { useCopy } from "@/components/CopyProvider";

// Outline icons (Tabler shapes), the same set as the homepage trust bar.
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5 shrink-0 text-[#8D6553]"
    >
      {children}
    </svg>
  );
}

const LockIcon = (
  <Icon>
    <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
    <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
  </Icon>
);
const TruckIcon = (
  <Icon>
    <path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" />
  </Icon>
);
const PinIcon = (
  <Icon>
    <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
  </Icon>
);
const ReturnIcon = (
  <Icon>
    <path d="M9 14l-4 -4l4 -4" />
    <path d="M5 10h11a4 4 0 1 1 0 8h-1" />
  </Icon>
);

/** A payment method shown as a small white card, the way checkouts usually show them. */
function PaymentCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span
      role="img"
      aria-label={label}
      className="inline-flex h-[42px] w-[73px] items-center justify-center overflow-hidden rounded-[5px] border border-[#1A1A1A]/10 bg-white"
    >
      {children}
    </span>
  );
}

// Brand marks. Visa's shape is from Simple Icons (CC0); Mastercard is its two
// circles; MobilePay and Klarna are their coloured name badges.
const PAYMENT_METHODS = [
  {
    label: "Visa",
    mark: (
      <svg viewBox="0 7.9 24 8.2" className="h-[14px] w-auto" aria-hidden="true">
        <path fill="#1A1F71" d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" />
      </svg>
    ),
  },
  {
    label: "Mastercard",
    mark: (
      <svg viewBox="0 0 32 20" className="h-[26px] w-auto" aria-hidden="true">
        <circle cx="10" cy="10" r="9" fill="#EB001B" />
        <circle cx="22" cy="10" r="9" fill="#F79E1B" />
        <path d="M16 3.292A9 9 0 0 1 16 16.708A9 9 0 0 1 16 3.292Z" fill="#FF5F00" />
      </svg>
    ),
  },
  {
    label: "MobilePay",
    mark: (
      <span className="flex h-full w-full items-center justify-center bg-[#5A78FF] font-sans text-[12px] font-semibold tracking-tight text-white">
        MobilePay
      </span>
    ),
  },
  {
    label: "Klarna",
    mark: (
      <span className="flex h-full w-full items-center justify-center bg-[#FFB3C7] font-sans text-[14px] font-bold tracking-tight text-[#0A0B09]">
        Klarna.
      </span>
    ),
  },
];

export default function TrustBadges() {
  const { trust } = useCopy().product;

  const promises = [
    { icon: LockIcon, text: trust.secure },
    { icon: TruckIcon, text: trust.freeShipping },
    { icon: PinIcon, text: trust.shipsFromDk },
    { icon: ReturnIcon, text: trust.returns },
  ];

  return (
    <div className="border-t border-[#1A1A1A]/10 pt-6 mt-6">
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
        {promises.map((promise) => (
          <li key={promise.text} className="flex items-center gap-2 text-[#1A1A1A]/70">
            {promise.icon}
            <span className="text-xs font-sans">{promise.text}</span>
          </li>
        ))}
      </ul>

      {/* Payment methods */}
      <div className="flex flex-wrap items-center justify-start gap-2 mt-6 pt-4 border-t border-[#1A1A1A]/10">
        {/* Own line on phones, so the four cards stay together in one row. */}
        <span className="w-full text-left sm:w-auto sm:mr-1 text-xs text-[#1A1A1A]/50 font-sans">
          {trust.paymentMethods}
        </span>
        {PAYMENT_METHODS.map((method) => (
          <PaymentCard key={method.label} label={method.label}>
            {method.mark}
          </PaymentCard>
        ))}
      </div>
    </div>
  );
}
