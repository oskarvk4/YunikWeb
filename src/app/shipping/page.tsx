import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import {
  SHIPPING_OPTION_LIST,
  formatDeliveryEstimate,
  formatShippingPrice,
  shippingTexts,
} from "@/constants/shipping";
import { getCopy } from "@/lib/copy";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = (await getCopy()).shipping;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/shipping" },
  };
}

export default async function ShippingPage() {
  const allCopy = await getCopy();
  const copy = allCopy.shipping;
  // Names, prices and descriptions of the delivery options are edited under Checkout – Levering.
  const delivery = allCopy.checkout.delivery;
  const packagingItems = [copy.packaging.item1, copy.packaging.item2, copy.packaging.item3];

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
            {/* Shipping Options */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-6">
                {copy.options.headline}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {SHIPPING_OPTION_LIST.map((option) => (
                  <div key={option.key} className="p-6 bg-[#F5F0EB] rounded-sm">
                    <h3 className="font-serif text-lg font-medium text-[#1A1A1A] mb-2">
                      {shippingTexts(delivery, option.key).label}
                    </h3>
                    <p className="text-3xl font-serif text-[#8D6553] mb-2">
                      {formatShippingPrice(option, delivery)}
                    </p>
                    <p className="text-[#1A1A1A]/60 font-sans text-sm">
                      {shippingTexts(delivery, option.key).description}
                    </p>
                    <p className="text-[#1A1A1A]/60 font-sans text-sm mt-1">
                      {formatDeliveryEstimate(option, delivery)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-6 bg-[#1A1A1A] text-white rounded-sm">
                <p className="font-serif text-lg mb-1">{copy.options.freeTitle}</p>
                <p className="text-white/70 font-sans text-sm">
                  {copy.options.freeBody}
                </p>
              </div>
            </div>

            {/* Delivery Times */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-6">
                {copy.table.headline}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full font-sans text-sm">
                  <thead>
                    <tr className="border-b border-[#1A1A1A]/10">
                      <th className="text-left py-3 font-medium text-[#1A1A1A]">{copy.table.columnOption}</th>
                      <th className="text-left py-3 font-medium text-[#1A1A1A]">{copy.table.columnPrice}</th>
                      <th className="text-left py-3 font-medium text-[#1A1A1A]">{copy.table.columnTime}</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#1A1A1A]/70">
                    {SHIPPING_OPTION_LIST.map((option) => (
                      <tr
                        key={option.key}
                        className="border-b border-[#1A1A1A]/10"
                      >
                        <td className="py-3">{shippingTexts(delivery, option.key).label}</td>
                        <td className="py-3">{formatShippingPrice(option, delivery)}</td>
                        <td className="py-3">
                          {formatDeliveryEstimate(option, delivery)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-[#1A1A1A]/60 font-sans">
                {copy.table.note}
              </p>
            </div>

            {/* Parcel shop */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-4">
                {copy.pickup.headline}
              </h2>
              <p className="text-[#1A1A1A]/70 font-sans leading-relaxed">
                {copy.pickup.body}
              </p>
            </div>

            {/* Tracking */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-4">
                {copy.tracking.headline}
              </h2>
              <p className="text-[#1A1A1A]/70 font-sans leading-relaxed">
                {copy.tracking.body}
              </p>
            </div>

            {/* Packaging */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-4">
                {copy.packaging.headline}
              </h2>
              <p className="text-[#1A1A1A]/70 font-sans leading-relaxed mb-4">
                {copy.packaging.intro}
              </p>
              <ul className="space-y-2 text-[#1A1A1A]/70 font-sans">
                {packagingItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-[#8D6553]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Questions */}
            <div className="p-6 bg-[#F5F0EB] rounded-sm">
              <h2 className="font-serif text-xl font-light text-[#1A1A1A] mb-3">
                {copy.questions.headline}
              </h2>
              <p className="text-[#1A1A1A]/70 font-sans mb-4">
                {copy.questions.body}
              </p>
              <a
                href="/contact"
                className="inline-block text-[#8D6553] font-sans text-sm hover:underline"
              >
                {copy.questions.link}
              </a>
            </div>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}
