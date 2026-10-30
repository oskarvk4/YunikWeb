import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import RichText from "@/components/ui/RichText";
import { getCopy } from "@/lib/copy";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = (await getCopy()).returns;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/returns" },
  };
}

export default async function ReturnsPage() {
  const copy = (await getCopy()).returns;

  const steps = [
    { title: copy.steps.step1Title, body: copy.steps.step1Body },
    { title: copy.steps.step2Title, body: copy.steps.step2Body },
    { title: copy.steps.step3Title, body: copy.steps.step3Body },
    { title: copy.steps.step4Title, body: copy.steps.step4Body },
  ];
  const acceptedItems = [
    copy.accepted.item1,
    copy.accepted.item2,
    copy.accepted.item3,
    copy.accepted.item4,
  ];
  const rejectedItems = [
    copy.rejected.item1,
    copy.rejected.item2,
    copy.rejected.item3,
    copy.rejected.item4,
  ];

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-[#F5F0EB] py-16 md:py-20">
        <Container size="narrow">
          <FadeIn inView={false} duration={0.6} className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4">
              {copy.header.headline}
            </h1>
            <p className="text-[#1A1A1A]/60 font-sans">
              {copy.header.subhead}
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <Container size="narrow">
          <FadeIn inView={false} duration={0.6} delay={0.2} className="space-y-12">
            {/* 14 Day Return */}
            <div className="p-8 bg-[#F5F0EB] rounded-sm text-center">
              <p className="text-5xl font-serif text-[#8D6553] mb-2">{copy.banner.number}</p>
              <p className="font-serif text-xl text-[#1A1A1A] mb-2">{copy.banner.label}</p>
              <p className="text-[#1A1A1A]/60 font-sans text-sm">
                {copy.banner.note}
              </p>
            </div>

            {/* How to Return */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-6">
                {copy.steps.headline}
              </h2>
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8D6553] text-white flex items-center justify-center font-serif">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">{step.title}</h3>
                      <p className="text-[#1A1A1A]/70 font-sans">
                        {step.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditions */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-6">
                {copy.conditions.headline}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 border border-[#1A1A1A]/10 rounded-sm">
                  <h3 className="font-serif text-lg text-[#1A1A1A] mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {copy.accepted.title}
                  </h3>
                  <ul className="space-y-2 text-[#1A1A1A]/70 font-sans text-sm">
                    {acceptedItems.map((item, index) => (
                      <li key={index}>{`• ${item}`}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 border border-[#1A1A1A]/10 rounded-sm">
                  <h3 className="font-serif text-lg text-[#1A1A1A] mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {copy.rejected.title}
                  </h3>
                  <ul className="space-y-2 text-[#1A1A1A]/70 font-sans text-sm">
                    {rejectedItems.map((item, index) => (
                      <li key={index}>{`• ${item}`}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Exchange */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-4">
                {copy.exchange.headline}
              </h2>
              <div className="space-y-4">
                <RichText
                  text={copy.exchange.body}
                  className="text-[#1A1A1A]/70 font-sans leading-relaxed"
                />
              </div>
            </div>

            {/* Refund */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-4">
                {copy.refund.headline}
              </h2>
              <div className="space-y-4">
                <RichText
                  text={copy.refund.body}
                  className="text-[#1A1A1A]/70 font-sans leading-relaxed"
                />
              </div>
            </div>

            {/* Warranty */}
            <div className="p-6 bg-[#1A1A1A] text-white rounded-sm">
              <h2 className="font-serif text-xl font-light mb-3">
                {copy.warranty.headline}
              </h2>
              <p className="text-white/70 font-sans mb-4">
                {copy.warranty.body}
              </p>
              <a
                href="/contact"
                className="inline-block text-[#D4A9A5] font-sans text-sm hover:underline"
              >
                {copy.warranty.link}
              </a>
            </div>

            {/* FAQ Link */}
            <div className="text-center">
              <p className="text-[#1A1A1A]/60 font-sans mb-2">
                {copy.faq.question}
              </p>
              <a
                href="/faq"
                className="inline-block text-[#8D6553] font-sans hover:underline"
              >
                {copy.faq.link}
              </a>
            </div>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}
