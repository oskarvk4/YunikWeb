import Container from "@/components/ui/Container";
import { getCopy } from "@/lib/copy";
import FAQAccordion, { type FAQItem } from "./FAQAccordion";

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export default async function FAQPage() {
  const copy = (await getCopy()).faq;

  const faqData: FAQCategory[] = [
    {
      title: copy.delivery.headline,
      items: [
        { question: copy.delivery.q1, answer: copy.delivery.a1 },
        { question: copy.delivery.q2, answer: copy.delivery.a2 },
        { question: copy.delivery.q3, answer: copy.delivery.a3 },
        { question: copy.delivery.q4, answer: copy.delivery.a4 },
        { question: copy.delivery.q5, answer: copy.delivery.a5 },
      ],
    },
    {
      title: copy.returns.headline,
      items: [
        { question: copy.returns.q1, answer: copy.returns.a1 },
        { question: copy.returns.q2, answer: copy.returns.a2 },
        { question: copy.returns.q3, answer: copy.returns.a3 },
        { question: copy.returns.q4, answer: copy.returns.a4 },
      ],
    },
    {
      title: copy.products.headline,
      items: [
        { question: copy.products.q1, answer: copy.products.a1 },
        { question: copy.products.q2, answer: copy.products.a2 },
        { question: copy.products.q3, answer: copy.products.a3 },
        { question: copy.products.q4, answer: copy.products.a4 },
      ],
    },
    {
      title: copy.payment.headline,
      items: [
        { question: copy.payment.q1, answer: copy.payment.a1 },
        { question: copy.payment.q2, answer: copy.payment.a2 },
        { question: copy.payment.q3, answer: copy.payment.a3 },
      ],
    },
  ];

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-[#F5F0EB] py-16 md:py-20">
        <Container size="narrow">
          <div className="text-center animate-fade-in-up">
            <h1 className="font-serif text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4">
              {copy.header.headline}
            </h1>
            <p className="text-[#1A1A1A]/60 font-sans">
              {copy.header.subhead}
            </p>
          </div>
        </Container>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-20">
        <Container size="narrow">
          <div
            className="space-y-12 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-6">
                  {category.title}
                </h2>
                <div>
                  {category.items.map((item, index) => (
                    <FAQAccordion key={index} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div
            className="mt-16 text-center p-8 bg-[#F5F0EB] rounded-sm animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <h3 className="font-serif text-xl text-[#1A1A1A] mb-3">
              {copy.contact.headline}
            </h3>
            <p className="text-[#1A1A1A]/70 font-sans mb-6">
              {copy.contact.body}
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-[#1A1A1A] text-white font-sans text-sm uppercase tracking-wider hover:bg-[#333] transition-colors"
            >
              {copy.contact.button}
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}
