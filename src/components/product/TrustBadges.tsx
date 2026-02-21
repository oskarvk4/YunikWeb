"use client";

export default function TrustBadges() {
  return (
    <div className="border-t border-[#1A1A1A]/10 pt-6 mt-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Secure Checkout */}
        <div className="flex items-center gap-2 text-[#1A1A1A]/60">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-xs font-sans">Sikker betaling</span>
        </div>

        {/* Free Shipping */}
        <div className="flex items-center gap-2 text-[#1A1A1A]/60">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span className="text-xs font-sans">Gratis fragt 500+</span>
        </div>

        {/* Ships from Denmark */}
        <div className="flex items-center gap-2 text-[#1A1A1A]/60">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs font-sans">Sendes fra DK</span>
        </div>

        {/* 14 Day Returns */}
        <div className="flex items-center gap-2 text-[#1A1A1A]/60">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-xs font-sans">14 dages retur</span>
        </div>
      </div>

      {/* Payment Icons */}
      <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-[#1A1A1A]/10">
        <span className="text-xs text-[#1A1A1A]/40 font-sans">Betalingsmetoder:</span>
        {/* Visa */}
        <svg className="h-6 w-auto text-[#1A1A1A]/40" viewBox="0 0 50 16" fill="currentColor">
          <path d="M19.5 1.5l-3.3 13h-2.7l3.3-13h2.7zm11.3 8.4l1.4-3.9.8 3.9h-2.2zm3 4.6h2.5l-2.2-13h-2.3c-.5 0-1 .3-1.2.8l-4.2 12.2h2.9l.6-1.6h3.6l.3 1.6zm-7.3-4.2c0-3.4-4.7-3.6-4.7-5.1 0-.5.5-.9 1.4-.9.8 0 1.5.1 2.1.4l.4-1.8c-.6-.2-1.4-.4-2.4-.4-2.5 0-4.3 1.3-4.3 3.2 0 1.4 1.3 2.2 2.2 2.6 1 .5 1.3.8 1.3 1.2 0 .7-.8 1-1.5 1-.9 0-1.8-.2-2.5-.5l-.4 1.9c.6.3 1.6.5 2.7.5 2.7 0 4.5-1.3 4.5-3.3l-.8.2zM10 1.5l-4.2 13H2.9L.8 4.2c-.1-.4-.2-.5-.5-.7C.1 3.4-.1 3.3-.3 3.2l.1-.7h4.7c.6 0 1.1.4 1.2 1.1l1.2 6.2 2.9-7.3H10z"/>
        </svg>
        {/* Mastercard */}
        <svg className="h-6 w-auto text-[#1A1A1A]/40" viewBox="0 0 32 20" fill="currentColor">
          <circle cx="10" cy="10" r="9" fillOpacity="0.6"/>
          <circle cx="22" cy="10" r="9" fillOpacity="0.4"/>
        </svg>
        {/* MobilePay */}
        <span className="text-xs font-sans text-[#1A1A1A]/40">MobilePay</span>
      </div>
    </div>
  );
}
