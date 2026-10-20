import Image from "next/image";
import Container from "@/components/ui/Container";

/**
 * Our physical shops, in two rows: the shop window with a note on the shops,
 * then a note on the people behind them with a photo from one of our stands.
 * Phones stack everything in reading order.
 */
export default function ShopWindow() {
  return (
    <section aria-labelledby="butikker-heading" className="py-14 md:py-28 bg-[#F5F0EB]">
      <Container>
        <div className="mb-12 md:mb-16 max-w-2xl">
          <p className="text-sm font-sans uppercase tracking-[0.3em] text-[#8D6553] mb-4">
            Vores butikker
          </p>
          <h2
            id="butikker-heading"
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#1A1A1A] leading-tight mb-6"
          >
            Først i butikken,
            <br />
            nu også online
          </h2>
          <div className="space-y-3 text-[#1A1A1A]/70 font-sans leading-relaxed">
            <p>I over 30 år har vores kunder fundet os i butikkerne i Aarhus og på Bornholm.</p>
            <p>Der har de kunnet se smykkerne i virkeligheden, prøve dem på og spørge os til råds.</p>
          </div>
        </div>

        <div className="relative aspect-[3/2] w-full md:w-1/2 overflow-hidden mb-12 md:mb-20">
          <Image
            src="/butik/butik-vindue-3x2.webp"
            alt="Yuniks butik om aftenen, set udefra gennem vinduet"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 640px"
          />
        </div>

        <div className="mt-12 md:mt-20 grid gap-8 md:grid-cols-12 md:gap-12 lg:gap-16 md:items-center">
          <div className="md:col-span-6 md:col-start-2 lg:col-span-5 lg:col-start-2">
            <h3 className="font-serif text-2xl md:text-3xl font-light text-[#1A1A1A] leading-tight mb-4">
              Også på messer
            </h3>
            <div className="space-y-3 text-[#1A1A1A]/70 font-sans leading-relaxed">
              <p>Du har måske også mødt os ved vores stand på en messe, med smykker, sten og krystaller.</p>
              <p>Webshoppen har de samme smykker og de samme mennesker bag.</p>
            </div>
          </div>

          <div className="relative aspect-[4/5] w-64 md:w-full md:max-w-[22rem] md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-8 overflow-hidden">
            <Image
              src="/butik/ole-stand.webp"
              alt="Manden bag Yunik ved sin stand med sten og smykker"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 16rem, 22rem"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
