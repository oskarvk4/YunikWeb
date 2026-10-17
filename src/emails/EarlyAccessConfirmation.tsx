import {
  Body,
  Container,
  Head,
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
            <Logo />
            <Text style={tagline}>Håndlavede smykker fra Danmark</Text>
          </Section>

          <Section style={card}>
            <Heading as="h2" style={h2}>
              Du er på listen
            </Heading>
            <Text style={paragraph}>
              Tak fordi du vil være blandt de første. Vi giver dig besked,
              inden kollektionen åbner for alle andre.
            </Text>
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
            <Text style={footerText}>
              Håndlavede smykker med tidløs elegance.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
