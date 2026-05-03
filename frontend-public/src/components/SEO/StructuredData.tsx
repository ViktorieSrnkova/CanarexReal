import { Helmet } from "react-helmet-async";

type Props = {
  name: string;
  description: string;
  price?: number;
  currency?: string;
  image?: string;
};

export default function StructuredData({
  name,
  description,
  price,
  currency = "EUR",
  image,
}: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    offers: price
      ? {
          "@type": "Offer",
          price,
          priceCurrency: currency,
        }
      : undefined,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
