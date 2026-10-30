import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Lines from "@/components/ui/Lines";
import RichText from "@/components/ui/RichText";
import { getCopy } from "@/lib/copy";

export async function generateMetadata(): Promise<Metadata> {
  const copy = (await getCopy()).terms.page;
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: { canonical: "/terms" },
    robots: { index: false },
  };
}

function Heading({ text }: { text: string }) {
  return (
    <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
      {text}
    </h2>
  );
}

/** A long editable text: paragraphs and bullet lists. */
function Body({ text }: { text: string }) {
  return <RichText text={text} listClassName="" />;
}

export default async function TermsPage() {
  const copy = (await getCopy()).terms;
  const { page, s1, s3, s10 } = copy;

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-[#F5F0EB] py-16 md:py-20">
        <Container size="narrow">
          <FadeIn inView={false} duration={0.6} className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4">
              {page.title}
            </h1>
            <p className="text-[#1A1A1A]/60 font-sans">
              {page.updated}
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <Container size="narrow">
          <FadeIn
            inView={false}
            duration={0.6}
            delay={0.2}
            className="prose prose-lg max-w-none font-sans text-[#1A1A1A]/80"
          >
            <Heading text={s1.heading} />
            <p>
              <strong>{s1.companyLabel}</strong> {s1.company}<br />
              <strong>{s1.cvrLabel}</strong> {s1.cvr}<br />
              <strong>{s1.addressLabel}</strong> {s1.address}<br />
              <strong>{s1.emailLabel}</strong> {s1.email}<br />
              <strong>{s1.phoneLabel}</strong> {s1.phone}
            </p>

            <Heading text={copy.s2.heading} />
            <Body text={copy.s2.body} />

            <Heading text={s3.heading} />
            <p>
              {s3.intro}
            </p>
            <p>
              <strong>{s3.ratesLabel}</strong>
            </p>
            <Body text={s3.rates} />
            <p>
              {s3.trackingNote}
            </p>

            <Heading text={copy.s4.heading} />
            <Body text={copy.s4.body} />

            <Heading text={copy.s5.heading} />
            <Body text={copy.s5.body} />

            <Heading text={copy.s6.heading} />
            <Body text={copy.s6.body} />

            <Heading text={copy.s7.heading} />
            <Body text={copy.s7.body} />

            <Heading text={copy.s8.heading} />
            <Body text={copy.s8.body} />

            <Heading text={copy.s9.heading} />
            <Body text={copy.s9.body} />

            <Heading text={s10.heading} />
            <p>
              {s10.intro}
            </p>
            <p>
              <strong>{s10.authorityName}</strong><br />
              <Lines text={s10.authorityAddress} />
            </p>
            <p>
              {s10.outro}
            </p>

            <Heading text={copy.s11.heading} />
            <Body text={copy.s11.body} />
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}
