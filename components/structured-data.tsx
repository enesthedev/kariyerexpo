import { site } from "@/lib/content"

/**
 * A native <script>, not next/script: this is structured data, not executable
 * code. The `<` escape is required even with hardcoded copy -- JSON.stringify
 * does not sanitise for HTML context.
 *
 * No Event node while the date is unknown. Schema.org Events want a startDate,
 * and publishing one without it would be asserting something we do not know.
 * It appears automatically once site.date is filled in.
 */
function StructuredData() {
  const organization = {
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    email: site.email,
    description: site.description,
    // The icon route, not the source PNG: it is flattened onto the brand
    // ground, so it survives the crawlers that composite onto white.
    logo: `${site.url}/icon.png`,
  }

  const website = {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    inLanguage: "tr-TR",
    publisher: { "@id": `${site.url}/#organization` },
    image: `${site.url}/opengraph-image.png`,
  }

  const event = site.date
    ? [
        {
          "@type": "Event",
          name: `${site.name} ${site.edition}`,
          startDate: site.date,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          organizer: { "@id": `${site.url}/#organization` },
          location: {
            "@type": "Place",
            name: site.venue.name ?? site.venue.city,
            address: {
              "@type": "PostalAddress",
              addressLocality: site.venue.city,
              addressCountry: "TR",
            },
          },
        },
      ]
    : []

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [organization, website, ...event],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  )
}

export { StructuredData }
