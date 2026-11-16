import { Body, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";

/** The team's copy of a submission (D102): every field as label → value, in English. */
export function TeamEmail({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{title}</Preview>
      <Body style={{ backgroundColor: "#F5E9D3", fontFamily: "Arial, sans-serif", color: "#2E2017" }}>
        <Container style={{ maxWidth: 560, padding: "24px", backgroundColor: "#ffffff" }}>
          <Heading as="h1" style={{ fontSize: 20, margin: "0 0 16px" }}>
            {title}
          </Heading>
          {rows.map(([label, value]) => (
            <Section key={label} style={{ borderTop: "1px solid #EAD4AB", padding: "8px 0" }}>
              <Text style={{ margin: 0, fontSize: 12, color: "#634731", textTransform: "uppercase", letterSpacing: 1 }}>{label}</Text>
              <Text style={{ margin: "2px 0 0", fontSize: 15, whiteSpace: "pre-wrap" }}>{value}</Text>
            </Section>
          ))}
        </Container>
      </Body>
    </Html>
  );
}
