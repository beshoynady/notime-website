/**
 * Serializes JSON-LD nodes into one script tag. `<` is escaped so a string in the data can
 * never close the script element (the pattern in Next's JSON-LD guide).
 */
export function JsonLd({ data }: { data: object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
