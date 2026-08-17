import Container from "@/components/ui/Container";
import ContactForm from "@/components/contact/ContactForm";
import { getCopy } from "@/lib/copy";
import FadeIn from "@/components/ui/FadeIn";

export default async function ContactPage() {
  const copy = (await getCopy()).contact;

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-[#F5F0EB] py-16 md:py-20">
        <Container size="narrow">
          <FadeIn inView={false} className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4">
              {copy.header.headline}
            </h1>
            <p className="text-[#1A1A1A]/60 font-sans">{copy.header.subhead}</p>
          </FadeIn>
        </Container>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <FadeIn direction="left" delay={0.2}>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-6">
                {copy.info.headline}
              </h2>
              <p className="text-[#1A1A1A]/70 font-sans leading-relaxed mb-8">
                {copy.info.body}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F5F0EB] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#8D6553]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">
                      {copy.info.emailLabel}
                    </h3>
                    <a
                      href={`mailto:${copy.info.email}`}
                      className="text-[#8D6553] font-sans hover:underline"
                    >
                      {copy.info.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F5F0EB] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#8D6553]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">
                      {copy.info.responseLabel}
                    </h3>
                    <p className="text-[#1A1A1A]/70 font-sans">
                      {copy.info.responseBody}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F5F0EB] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#8D6553]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">
                      {copy.info.addressLabel}
                    </h3>
                    <p className="text-[#1A1A1A]/70 font-sans">
                      {copy.info.addressLine1}
                      <br />
                      {copy.info.addressLine2}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-[#F5F0EB] rounded-sm">
                <h3 className="font-serif text-lg text-[#1A1A1A] mb-2">
                  {copy.faqBox.title}
                </h3>
                <p className="text-[#1A1A1A]/70 font-sans text-sm mb-3">
                  {copy.faqBox.body}
                </p>
                <a
                  href="/faq"
                  className="text-[#8D6553] font-sans text-sm hover:underline"
                >
                  {copy.faqBox.cta}
                </a>
              </div>
            </FadeIn>

            {/* Contact Form */}
            <ContactForm copy={copy.form} />
          </div>
        </Container>
      </section>
    </div>
  );
}
