import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Lines from "@/components/ui/Lines";
import RichText from "@/components/ui/RichText";
import { getCopy } from "@/lib/copy";

export async function generateMetadata(): Promise<Metadata> {
  const copy = (await getCopy()).privacy.page;
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: { canonical: "/privacy" },
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

/** A bullet list where each item starts with a bold label. */
function LabelList({ items }: { items: [string, string][] }) {
  return (
    <ul>
      {items.map(([label, text], i) => (
        <li key={i}><strong>{label}</strong> {text}</li>
      ))}
    </ul>
  );
}

export default async function PrivacyPage() {
  const copy = (await getCopy()).privacy;
  const { page, s1, s2, s4, s6, s10 } = copy;

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
              {s1.intro}
            </p>
            <p>
              <strong>{s1.companyLabel}</strong> {s1.company}<br />
              <strong>{s1.cvrLabel}</strong> {s1.cvr}<br />
              <strong>{s1.addressLabel}</strong> {s1.address}<br />
              <strong>{s1.emailLabel}</strong> {s1.email}
            </p>

            <Heading text={s2.heading} />
            <p>{s2.intro}</p>
            <LabelList
              items={[
                [s2.item1Label, s2.item1],
                [s2.item2Label, s2.item2],
                [s2.item3Label, s2.item3],
                [s2.item4Label, s2.item4],
              ]}
            />

            <Heading text={copy.s3.heading} />
            <Body text={copy.s3.body} />

            <Heading text={s4.heading} />
            <p>{s4.intro}</p>
            <LabelList
              items={[
                [s4.item1Label, s4.item1],
                [s4.item2Label, s4.item2],
                [s4.item3Label, s4.item3],
                [s4.item4Label, s4.item4],
              ]}
            />

            <Heading text={copy.s5.heading} />
            <Body text={copy.s5.body} />

            <Heading text={s6.heading} />
            <p>{s6.intro}</p>
            <LabelList
              items={[
                [s6.item1Label, s6.item1],
                [s6.item2Label, s6.item2],
                [s6.item3Label, s6.item3],
                [s6.item4Label, s6.item4],
                [s6.item5Label, s6.item5],
                [s6.item6Label, s6.item6],
              ]}
            />
            <p>
              {s6.outro}
            </p>

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

            <Heading text={copy.s11.heading} />
            <Body text={copy.s11.body} />
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}
