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
  footerSmall,
  footerText,
  h2,
  header,
  link,
  paragraph,
  tagline,
} from "./styles";
import Logo from "./Logo";
import EmailHead from "./EmailHead";

/**
 * The one "doors are open" mail the early-access list was promised in
 * EarlyAccessConfirmation. Sent by scripts/send-launch-email.ts.
 */

export const LAUNCH_SUBJECT = "Dørene er åbne hos Yunik";

export interface LaunchAnnouncementProps {
  /** Personal early-access link for this recipient. */
  accessUrl: string;
  contactEmail: string;
}

export function launchAnnouncementText({
  accessUrl,
  contactEmail,
}: LaunchAnnouncementProps): string {
  return (
    `Dørene er åbne.\n\n` +
    `Du skrev dig op til at høre det først. Nu kan du se kollektionen, før vi åbner for alle andre.\n\n` +
    `Kollektionen er håndlavede smykker i sølv og forgyldt sølv, formet ét ad gangen. ` +
    `Mange stykker findes kun i få eksemplarer, så det største udvalg er der lige nu.\n\n` +
    `Se kollektionen: ${accessUrl}\n\n` +
    `Linket er personligt og giver adgang i 30 dage, så del det helst ikke.\n\n` +
    `Gratis fragt i Danmark og 14 dages returret.\n\n` +
    `Har du spørgsmål, kan du svare direkte på denne mail eller skrive til ${contactEmail}.\n\n` +
    `Det her er den ene mail, vi lovede. Vil du ikke høre mere fra os, så svar "afmeld", så fjerner vi dig fra listen.\n\n` +
    `Venlig hilsen\nYunik`
  );
}

export default function LaunchAnnouncement({
  accessUrl,
  contactEmail,
}: LaunchAnnouncementProps) {
  return (
    <Html lang="da">
      <EmailHead />
      <Preview>Du skrev dig op til at høre det først. Nu kan du se kollektionen før alle andre.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Logo />
            <Text style={tagline}>Håndlavede smykker fra Danmark</Text>
          </Section>

          <Section style={card}>
            <Heading as="h2" style={h2}>
              Dørene er åbne
            </Heading>
            <Text style={paragraph}>
              Du skrev dig op til at høre det først. Nu kan du se
              kollektionen, før vi åbner for alle andre.
            </Text>
            <Text style={paragraph}>
              Kollektionen er håndlavede smykker i sølv og forgyldt sølv,
              formet ét ad gangen. Mange stykker findes kun i få eksemplarer,
              så det største udvalg er der lige nu.
            </Text>
            <Section style={buttonRow}>
              <Button href={accessUrl} style={button}>
                Se kollektionen
              </Button>
            </Section>
            <Text style={note}>
              Linket er personligt og giver adgang i 30 dage, så del det helst
              ikke.
            </Text>
            <Text style={paragraph}>
              Gratis fragt i Danmark og 14 dages returret.
            </Text>
            <Text style={paragraph}>
              Har du spørgsmål, kan du svare direkte på denne mail eller skrive
              til{" "}
              <a href={`mailto:${contactEmail}`} style={link}>
                {contactEmail}
              </a>
              .
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Håndlavede smykker med tidløs elegance.
            </Text>
            <Text style={footerSmall}>
              Det her er den ene mail, vi lovede. Vil du ikke høre mere fra os,
              så svar &quot;afmeld&quot;, så fjerner vi dig fra listen.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const note: React.CSSProperties = {
  color: "#8D6553",
  fontSize: "13px",
  lineHeight: "20px",
  textAlign: "center",
  margin: "-8px 0 20px",
};

const buttonRow: React.CSSProperties = {
  textAlign: "center",
  margin: "8px 0 20px",
};

// Dark text on the blush, matching the site's primary button.
const button: React.CSSProperties = {
  backgroundColor: "#D4A9A5",
  color: "#1A1A1A",
  fontSize: "15px",
  fontWeight: 500,
  letterSpacing: "0.04em",
  padding: "14px 32px",
  textDecoration: "none",
  display: "inline-block",
};
