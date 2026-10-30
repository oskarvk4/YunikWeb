import Image from "next/image";
import Container from "@/components/ui/Container";
import Lines from "@/components/ui/Lines";
import type { Copy } from "@/content/copy";

/**
 * Our physical shops: a centred note on the shops, the shop window and a photo
 * from one of our stands side by side, then a centred note on the fairs. Texts
 * come from /admin/copy (home.shops).
 */
export default function ShopWindow({ content }: { content: Copy["home"]["shops"] }) {
  return (
    <section aria-labelledby="butikker-heading" className="py-14 md:py-28 bg-[#F5F0EB]">
      <Container>
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="text-sm font-sans uppercase tracking-[0.3em] text-[#8D6553] mb-3">
            {content.kicker}
          </p>
          <h2
            id="butikker-heading"
            className="font-serif text-2xl md:text-3xl lg:text-4xl font-light text-[#1A1A1A] leading-tight mb-4"
          >
            <Lines text={content.headline} />
          </h2>
          <div className="space-y-3 text-[#1A1A1A]/70 font-sans leading-relaxed">
            <p>{content.paragraph1}</p>
            {content.paragraph2 && <p>{content.paragraph2}</p>}
          </div>
        </div>

        {/* The shop window and the stand, side by side at the same size on every screen.
            Both are square crops: the window's 3:2 photo keeps its centre (the YUNIK
            letters and the counter), the stand photo loses a little top and bottom.
            From md the row also shrinks on short screens, so the text above and both
            photos fit in one view below the 7rem header: about 23.5rem goes to the header
            and the text, the rest to the photos' height (= width), twice plus the gap. */}
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 md:gap-6 md:max-w-[min(56rem,calc((100svh_-_23.5rem)_*_2_+_1.5rem))]">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src="/butik/butik-vindue-3x2.webp"
              alt={content.windowImageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 440px"
            />
          </div>
          <div className="relative aspect-square overflow-hidden">
            <Image
              src="/butik/ole-stand.webp"
              alt={content.standImageAlt}
              fill
              className="object-cover object-[50%_35%]"
              sizes="(max-width: 768px) 50vw, 440px"
            />
          </div>
        </div>

        <div className="mx-auto mt-8 md:mt-10 max-w-2xl text-center">
          <h3 className="font-serif text-2xl md:text-3xl font-light text-[#1A1A1A] leading-tight mb-4">
            {content.fairsHeadline}
          </h3>
          <div className="space-y-3 text-[#1A1A1A]/70 font-sans leading-relaxed">
            <p>{content.fairsParagraph1}</p>
            {content.fairsParagraph2 && <p>{content.fairsParagraph2}</p>}
          </div>
        </div>
      </Container>
    </section>
  );
}
