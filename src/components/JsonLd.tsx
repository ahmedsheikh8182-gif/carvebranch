interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Renders structured data as a JSON-LD script tag.
 * Place on any page that benefits from rich search results.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data is serialised from JS objects, not user input
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
