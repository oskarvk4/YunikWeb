interface BadgeProps {
  variant?: "new" | "bestseller" | "sale";
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  variant = "new",
  children,
  className = "",
}: BadgeProps) {
  const variants = {
    new: "bg-[#1A1A1A] text-white",
    bestseller: "bg-[#D4A9A5] text-white",
    sale: "bg-red-500 text-white",
  };

  return (
    <span
      className={`inline-block px-2 py-1 text-[10px] font-sans font-medium uppercase tracking-wider ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
