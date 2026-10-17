import {
  Body,
  Button,
  Container,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import {
  body,
  card,
  container,
  footer,
  footerText,
  h2,
  header,
  link,
  paragraph,
  tagline,
} from "./styles";
import Logo from "./Logo";
import EmailHead from "./EmailHead";

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
      <EmailHead />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Logo />
            <Text style={tagline}>Håndlavede smykker fra Danmark</Text>
          </Section>

          <Section style={card}>
            <Heading as="h2" style={h2}>
              Vi har modtaget din besked
            </Heading>
            <Text style={paragraph}>Hej {customerName},</Text>
            <Text style={paragraph}>
              Tak for din henvendelse. Din besked er landet sikkert hos os under
              emnet <strong>{subjectLabel}</strong>, og vi vender tilbage
              hurtigst muligt, som regel inden for 24 timer på hverdage.
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

            <Section style={ctaSection}>
              <Button href="https://www.yunik.dk/shop" style={ctaButton}>
                Se vores kollektion
              </Button>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Håndlavede smykker med tidløs elegance.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

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

const ctaSection: React.CSSProperties = {
  textAlign: "center",
  padding: "12px 0 4px",
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
