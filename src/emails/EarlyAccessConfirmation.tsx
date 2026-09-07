import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { MARK_BEIGE_URL } from "./styles";

export interface EarlyAccessConfirmationProps {
  contactEmail: string;
}

export default function EarlyAccessConfirmation({
  contactEmail,
}: EarlyAccessConfirmationProps) {
  return (
    <Html lang="da">
      <Head />
      <Preview>Du er på listen — vi skriver, når Yunik åbner</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src={MARK_BEIGE_URL}
              alt="Yunik"
              width={64}
              height={64}
              style={markImg}
            />
            <Heading style={heroTitle}>Du er på listen</Heading>
            <Text style={heroText}>
              Tak fordi du vil være blandt de første. Vi giver dig besked,
              inden kollektionen åbner for alle andre.
            </Text>
          </Section>

          <Section style={card}>
            <Text style={paragraph}>
              Yunik er håndlavede smykker, formet ét ad gangen. Vi pudser de
              sidste stykker færdige nu, og når de er klar, lander der en mail
              fra os — ikke en nyhedsstrøm, bare beskeden om at dørene er åbne.
            </Text>
            <Text style={paragraph}>
              Har du spørgsmål i mellemtiden, kan du svare direkte på denne
              mail eller skrive til{" "}
              <a href={`mailto:${contactEmail}`} style={link}>
                {contactEmail}
              </a>
              .
            </Text>
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

// Outlook blocks images by default and Gmail does for unfamiliar senders, so
// the type styling stays on the element — a blocked mark falls back to the alt
// text rendered as the blush wordmark this header used to carry.
const markImg: React.CSSProperties = {
  display: "block",
  margin: "0 auto 18px",
  color: "#D4A9A5",
  fontSize: "12px",
  letterSpacing: "0.32em",
  textTransform: "uppercase",
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
  padding: "28px 28px 12px",
};

const paragraph: React.CSSProperties = {
  color: "#1A1A1A",
  fontSize: "15px",
  lineHeight: "25px",
  margin: "0 0 16px",
};

const link: React.CSSProperties = {
  color: "#8D6553",
  textDecoration: "underline",
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
