/** Renders one or more schema.org objects as a JSON-LD <script>. Server-component safe. */
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Escape "<" so product text can never close the script tag early.
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
