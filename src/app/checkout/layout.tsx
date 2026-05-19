export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://js.stripe.com" />
      <link rel="dns-prefetch" href="https://js.stripe.com" />
      {children}
    </>
  );
}
