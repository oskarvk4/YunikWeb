import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface ContactConfirmationProps {
  customerName: string;
  subjectLabel: string;
  message: string;
  contactEmail: string;
}

export default function ContactConfirmation({
  customerName,
  subjectLabel,
  message,
  contactEmail,
}: ContactConfirmationProps) {
  const preview = `Vi har modtaget din besked om "${subjectLabel}"`;

  return (
    <Html lang="da">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={eyebrow}>YUNIK</Text>
            <Heading style={heroTitle}>Vi har modtaget din besked</Heading>
            <Text style={heroText}>
              Tak for din henvendelse. Vi vender tilbage hurtigst muligt, som
              regel inden for 24 timer på hverdage.
            </Text>
          </Section>

          <Section style={card}>
            <Text style={paragraph}>Hej {customerName},</Text>
            <Text style={paragraph}>
              Din besked er landet sikkert hos os under emnet{" "}
              <strong>{subjectLabel}</strong>.
            </Text>

            <Section style={messageBox}>
              <Text style={label}>Din besked</Text>
              <Text style={messageText}>{message}</Text>
            </Section>

            <Text style={paragraph}>
              Hvis du har yderligere oplysninger, kan du bare svare direkte på
              denne email eller skrive til{" "}
              <a href={`mailto:${contactEmail}`} style={link}>
                {contactEmail}
              </a>
              .
            </Text>
          </Section>

          <Section style={ctaSection}>
            <Button href="https://yunik.dk/shop" style={ctaButton}>
              Se vores kollektion
            </Button>
          </Section>

          <Section style={footer}>
            <Text style={footerTitle}>Yunik</Text>
            <Text style={footerText}>
              Håndlavede smykker med tidløs elegance.
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
  padding: "24px 16px 40px",
};

const header: React.CSSProperties = {
  backgroundColor: "#1A1A1A",
  color: "#FFFFFF",
  padding: "36px 32px",
  textAlign: "center",
};

const eyebrow: React.CSSProperties = {
  color: "#D4A9A5",
  fontSize: "12px",
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  margin: "0 0 16px",
};

const heroTitle: React.CSSProperties = {
  color: "#FFFFFF",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "34px",
  fontWeight: 400,
  lineHeight: "1.2",
  margin: "0 0 14px",
};

const heroText: React.CSSProperties = {
  color: "rgba(255,255,255,0.78)",
  fontSize: "15px",
  lineHeight: "24px",
  margin: 0,
};

const card: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  padding: "28px 28px 24px",
};

const paragraph: React.CSSProperties = {
  color: "#1A1A1A",
  fontSize: "15px",
  lineHeight: "25px",
  margin: "0 0 16px",
};

const messageBox: React.CSSProperties = {
  backgroundColor: "#FAF8F6",
  border: "1px solid #E8DDD3",
  padding: "18px 18px 4px",
  margin: "12px 0 20px",
};

const label: React.CSSProperties = {
  color: "#8D6553",
  fontSize: "11px",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  margin: "0 0 10px",
};

const messageText: React.CSSProperties = {
  color: "#1A1A1A",
  fontSize: "14px",
  lineHeight: "24px",
  whiteSpace: "pre-wrap",
  margin: 0,
};

const link: React.CSSProperties = {
  color: "#8D6553",
  textDecoration: "underline",
};

const ctaSection: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  padding: "0 28px 28px",
  textAlign: "center",
};

const ctaButton: React.CSSProperties = {
  backgroundColor: "#1A1A1A",
  color: "#FFFFFF",
  fontSize: "12px",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  padding: "14px 32px",
  textDecoration: "none",
  display: "inline-block",
};

const footer: React.CSSProperties = {
  textAlign: "center",
  padding: "24px 16px 0",
};

const footerTitle: React.CSSProperties = {
  color: "#1A1A1A",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "20px",
  letterSpacing: "0.22em",
  margin: "0 0 8px",
};

const footerText: React.CSSProperties = {
  color: "#6F625A",
  fontSize: "13px",
  margin: 0,
};
