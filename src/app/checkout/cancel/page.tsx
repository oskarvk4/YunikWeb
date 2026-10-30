import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { getCopy } from "@/lib/copy";

export default async function CheckoutCancelPage() {
  const text = (await getCopy()).checkout.cancel;

  return (
    <div className="pt-20">
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <div className="text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-[#F5F0EB] rounded-full flex items-center justify-center mx-auto mb-8">
              <svg
                className="w-10 h-10 text-[#1A1A1A]/40"
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
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A] mb-4">
              {text.heading}
            </h1>

            <p className="text-[#1A1A1A]/70 font-sans leading-relaxed mb-8 max-w-md mx-auto">
              {text.body}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/checkout">
                <Button variant="primary" size="lg">
                  {text.retry}
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" size="lg">
                  {text.continueShopping}
                </Button>
              </Link>
            </div>

            <div className="mt-12 p-6 bg-[#F5F0EB] rounded-sm">
              <h2 className="font-serif text-lg text-[#1A1A1A] mb-2">
                {text.helpHeading}
              </h2>
              <p className="text-[#1A1A1A]/70 font-sans text-sm mb-3">
                {text.helpBody}
              </p>
              <a
                href="/contact"
                className="text-[#8D6553] font-sans text-sm hover:underline"
              >
                {text.helpLink}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
