import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components";

export interface OrderEmailItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderEmailAddress {
  name?: string | null;
  line1?: string | null;
  line2?: string | null;
  postal_code?: string | null;
  city?: string | null;
  country?: string | null;
}

export interface OrderConfirmationProps {
  orderId: string;
  customerEmail: string;
  customerName?: string | null;
  items: OrderEmailItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  currency: string;
  shippingAddress?: OrderEmailAddress | null;
  shippingOption: string;
  contactEmail: string;
}

const formatPrice = (amount: number, currency: string) =>
  `${amount.toLocaleString("da-DK")} ${currency}`;

export default function OrderConfirmation({
  orderId,
  customerName,
  items,
  subtotal,
  shippingCost,
  total,
  currency,
  shippingAddress,
  shippingOption,
  contactEmail,
}: OrderConfirmationProps) {
  const shortId = orderId.slice(0, 8).toUpperCase();
  const greeting = customerName ? `Kære ${customerName}` : "Kære kunde";

  return (
    <Html lang="da">
      <Head />
      <Preview>Tak for din ordre hos Yunik — ordrenummer {shortId}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={brand}>YUNIK</Heading>
            <Text style={tagline}>Håndlavede smykker fra Danmark</Text>
          </Section>

          <Section style={card}>
            <Heading as="h2" style={h2}>
              Tak for din ordre
            </Heading>
            <Text style={paragraph}>{greeting},</Text>
            <Text style={paragraph}>
              Vi har modtaget din ordre og er i gang med at pakke den med
              omhu. Du modtager en ny mail, så snart pakken er sendt afsted.
            </Text>
            <Text style={meta}>
              Ordrenummer: <strong>{shortId}</strong>
            </Text>
          </Section>

          <Section style={card}>
            <Heading as="h3" style={h3}>
              Din ordre
            </Heading>
            {items.map((item) => (
              <Row key={item.id} style={itemRow}>
                {item.image ? (
                  <Column style={imageCol}>
                    <Img
                      src={item.image}
                      width="64"
                      height="64"
                      alt={item.name}
                      style={itemImage}
                    />
                  </Column>
                ) : null}
                <Column style={itemCol}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemMeta}>Antal: {item.quantity}</Text>
                </Column>
                <Column style={itemPriceCol}>
                  <Text style={itemPrice}>
                    {formatPrice(item.price * item.quantity, currency)}
                  </Text>
                </Column>
              </Row>
            ))}

            <Hr style={hr} />

            <Row>
              <Column>
                <Text style={totalsLabel}>Subtotal</Text>
              </Column>
              <Column style={totalsValueCol}>
                <Text style={totalsValue}>{formatPrice(subtotal, currency)}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={totalsLabel}>
                  Fragt ({shippingOption === "express" ? "Express" : "Standard"})
                </Text>
              </Column>
              <Column style={totalsValueCol}>
                <Text style={totalsValue}>
                  {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost, currency)}
                </Text>
              </Column>
            </Row>
            <Hr style={hr} />
            <Row>
              <Column>
                <Text style={grandTotalLabel}>I alt</Text>
              </Column>
              <Column style={totalsValueCol}>
                <Text style={grandTotalValue}>{formatPrice(total, currency)}</Text>
              </Column>
            </Row>
          </Section>

          {shippingAddress ? (
            <Section style={card}>
              <Heading as="h3" style={h3}>
                Leveringsadresse
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
              Spørgsmål? Skriv til os på{" "}
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

const body: React.CSSProperties = {
  backgroundColor: "#F5F0EB",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  margin: 0,
  padding: 0,
};

const container: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
  padding: "32px 16px",
};

const header: React.CSSProperties = {
  textAlign: "center" as const,
  padding: "24px 0 32px",
};

const brand: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "32px",
  letterSpacing: "0.3em",
  color: "#1A1A1A",
  margin: 0,
  fontWeight: 400,
};

const tagline: React.CSSProperties = {
  fontSize: "12px",
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  color: "#8D6553",
  margin: "8px 0 0",
};

const card: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  borderRadius: "8px",
  padding: "28px 24px",
  marginBottom: "16px",
};

const h2: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "24px",
  color: "#1A1A1A",
  margin: "0 0 16px",
  fontWeight: 400,
};

const h3: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "18px",
  color: "#1A1A1A",
  margin: "0 0 16px",
  fontWeight: 400,
};

const paragraph: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#1A1A1A",
  margin: "0 0 12px",
};

const meta: React.CSSProperties = {
  fontSize: "14px",
  color: "#8D6553",
  margin: "16px 0 0",
};

const itemRow: React.CSSProperties = {
  marginBottom: "12px",
};

const imageCol: React.CSSProperties = {
  width: "72px",
  verticalAlign: "top" as const,
};

const itemImage: React.CSSProperties = {
  borderRadius: "6px",
  objectFit: "cover" as const,
  display: "block",
};

const itemCol: React.CSSProperties = {
  verticalAlign: "top" as const,
  paddingLeft: "8px",
};

const itemName: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 500,
  color: "#1A1A1A",
  margin: "0 0 4px",
};

const itemMeta: React.CSSProperties = {
  fontSize: "13px",
  color: "#6b6b6b",
  margin: 0,
};

const itemPriceCol: React.CSSProperties = {
  textAlign: "right" as const,
  verticalAlign: "top" as const,
  whiteSpace: "nowrap" as const,
};

const itemPrice: React.CSSProperties = {
  fontSize: "14px",
  color: "#1A1A1A",
  margin: 0,
};

const hr: React.CSSProperties = {
  borderColor: "#EDE5DC",
  margin: "16px 0",
};

const totalsLabel: React.CSSProperties = {
  fontSize: "14px",
  color: "#1A1A1A",
  margin: "4px 0",
};

const totalsValueCol: React.CSSProperties = {
  textAlign: "right" as const,
};

const totalsValue: React.CSSProperties = {
  fontSize: "14px",
  color: "#1A1A1A",
  margin: "4px 0",
};

const grandTotalLabel: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#1A1A1A",
  margin: "4px 0",
};

const grandTotalValue: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#1A1A1A",
  margin: "4px 0",
};

const addressLine: React.CSSProperties = {
  fontSize: "14px",
  color: "#1A1A1A",
  margin: "2px 0",
  lineHeight: "20px",
};

const footer: React.CSSProperties = {
  textAlign: "center" as const,
  padding: "24px 0",
};

const footerText: React.CSSProperties = {
  fontSize: "13px",
  color: "#1A1A1A",
  margin: "0 0 8px",
};

const footerSmall: React.CSSProperties = {
  fontSize: "12px",
  color: "#8D6553",
  margin: 0,
};

const link: React.CSSProperties = {
  color: "#8D6553",
  textDecoration: "underline",
};
