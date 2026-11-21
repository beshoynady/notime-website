import { Body, Container, Head, Html, Preview, Text } from "@react-email/components";
import type { Locale } from "@/content/types";
import type { MailKind } from "@/lib/forms/mailer";
import { autoReplyCopy as c, fillMail } from "./copy";

/** The visitor's confirmation, in their language and direction (D102). */
export function AutoReply({ kind, locale, vars }: { kind: MailKind; locale: Locale; vars: Record<string, string> }) {
  const dir = locale === "ar" ? "rtl" : "ltr";
  const body = fillMail(c.body[kind][locale], vars);
  const font = locale === "ar" ? "Tahoma, Arial, sans-serif" : "Arial, sans-serif";
  return (
    <Html lang={locale} dir={dir}>
      <Head />
      <Preview>{body}</Preview>
      <Body style={{ backgroundColor: "#F5E9D3", fontFamily: font, color: "#2E2017" }}>
        <Container style={{ maxWidth: 560, padding: "28px", backgroundColor: "#ffffff", direction: dir, textAlign: locale === "ar" ? "right" : "left" }}>
          <Text style={{ fontSize: 16 }}>{fillMail(c.greeting[locale], vars)}</Text>
          <Text style={{ fontSize: 16, lineHeight: "26px" }}>{body}</Text>
          <Text style={{ fontSize: 13, color: "#634731" }}>{c.note[locale]}</Text>
          <Text style={{ fontSize: 13, color: "#634731", marginTop: 24 }}>{c.signoff[locale]}</Text>
        </Container>
      </Body>
    </Html>
  );
}
