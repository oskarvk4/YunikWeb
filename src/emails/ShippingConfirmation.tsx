import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { OrderEmailAddress, OrderEmailItem } from "./OrderConfirmation";
import type { PickupPointSnapshot } from "@/constants/shipping";
import {
  addressLine,
  body,
  brand,
  card,
  container,
  footer,
  footerSmall,
  footerText,
  h2,
  h3,
  header,
  link,
  mark,
  MARK_URL,
  meta,
  paragraph,
  tagline,
} from "./styles";

export interface ShippingConfirmationProps {
  orderId: string;
  customerName?: string | null;
  items: OrderEmailItem[];
  shippingAddress?: OrderEmailAddress | null;
  shippingOption: string;
  carrierLabel: string;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  pickupPoint?: PickupPointSnapshot | null;
  contactEmail: string;
}

export default function ShippingConfirmation({
  orderId,
  customerName,
  items,
  shippingAddress,
  shippingOption,
  carrierLabel,
  trackingNumber,
  trackingUrl,
  pickupPoint,
  contactEmail,
}: ShippingConfirmationProps) {
  const shortId = orderId.slice(0, 8).toUpperCase();
  const greeting = customerName ? `Kære ${customerName}` : "Kære kunde";
  const estimate =
    shippingOption === "express" ? "1-2 hverdage" : "2-5 hverdage";

  return (
    <Html lang="da">
      <Head />
      <Preview>Din ordre {shortId} er sendt afsted</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src={MARK_URL}
              alt=""
              width={56}
              height={56}
              style={mark}
            />
            <Heading style={brand}>YUNIK</Heading>
            <Text style={tagline}>Håndlavede smykker fra Danmark</Text>
          </Section>

          <Section style={card}>
            <Heading as="h2" style={h2}>
              Din pakke er på vej
            </Heading>
            <Text style={paragraph}>{greeting},</Text>
            <Text style={paragraph}>
              {pickupPoint
                ? `Din ordre er pakket og sendt afsted med ${carrierLabel}. Du kan hente den i din valgte pakkeshop, typisk inden for ${estimate} — du får besked fra ${carrierLabel}, når den er klar.`
                : `Din ordre er pakket og sendt afsted med ${carrierLabel}. Den er typisk hos dig inden for ${estimate}.`}
            </Text>
            <Text style={meta}>
              Ordrenummer: <strong>{shortId}</strong>
            </Text>
          </Section>

          {trackingNumber || trackingUrl ? (
            <Section style={card}>
              <Heading as="h3" style={h3}>
                Følg din pakke
              </Heading>
              {trackingNumber ? (
                <Text style={trackingCode}>{trackingNumber}</Text>
              ) : null}
              <Text style={paragraph}>
                {carrierLabel} opdaterer sporingen, når pakken er scannet
                første gang. Der kan gå et par timer, før den vises.
              </Text>
              {trackingUrl ? (
                <Button href={trackingUrl} style={button}>
                  Spor din pakke
                </Button>
              ) : null}
            </Section>
          ) : null}

          {items.length > 0 ? (
            <Section style={card}>
              <Heading as="h3" style={h3}>
                Indhold
              </Heading>
              {items.map((item, index) => (
                <Text key={`${item.id}-${index}`} style={addressLine}>
                  {item.quantity} × {item.name}
                </Text>
              ))}
            </Section>
          ) : null}

          {pickupPoint ? (
            <Section style={card}>
              <Heading as="h3" style={h3}>
                Afhentes hos
              </Heading>
              <Text style={addressLine}>{pickupPoint.name}</Text>
              {pickupPoint.address ? (
                <Text style={addressLine}>{pickupPoint.address}</Text>
              ) : null}
              {pickupPoint.zipcode || pickupPoint.city ? (
                <Text style={addressLine}>
                  {[pickupPoint.zipcode, pickupPoint.city]
                    .filter(Boolean)
                    .join(" ")}
                </Text>
              ) : null}
            </Section>
          ) : shippingAddress ? (
            <Section style={card}>
              <Heading as="h3" style={h3}>
                Sendt til
              </Heading>
              {shippingAddress.name ? (
                <Text style={addressLine}>{shippingAddress.name}</Text>
              ) : null}
              {shippingAddress.line1 ? (
                <Text style={addressLine}>{shippingAddress.line1}</Text>
              ) : null}
              {shippingAddress.line2 ? (
                <Text style={addressLine}>{shippingAddress.line2}</Text>
              ) : null}
              {shippingAddress.postal_code || shippingAddress.city ? (
                <Text style={addressLine}>
                  {[shippingAddress.postal_code, shippingAddress.city]
                    .filter(Boolean)
                    .join(" ")}
                </Text>
              ) : null}
              {shippingAddress.country ? (
                <Text style={addressLine}>{shippingAddress.country}</Text>
              ) : null}
            </Section>
          ) : null}

          <Section style={footer}>
            <Text style={footerText}>
              Er der noget galt med pakken? Skriv til os på{" "}
              <a href={`mailto:${contactEmail}`} style={link}>
                {contactEmail}
              </a>
            </Text>
            <Text style={footerSmall}>
              © Yunik · Håndlavede smykker fra Danmark
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const trackingCode: React.CSSProperties = {
  fontFamily: "'SFMono-Regular', Menlo, Consolas, monospace",
  fontSize: "18px",
  letterSpacing: "0.05em",
  color: "#1A1A1A",
  backgroundColor: "#F5F0EB",
  borderRadius: "6px",
  padding: "12px 16px",
  margin: "0 0 16px",
};

const button: React.CSSProperties = {
  backgroundColor: "#1A1A1A",
  color: "#FFFFFF",
  fontSize: "14px",
  fontWeight: 500,
  textDecoration: "none",
  textAlign: "center" as const,
  borderRadius: "6px",
  padding: "12px 24px",
  display: "inline-block",
};
