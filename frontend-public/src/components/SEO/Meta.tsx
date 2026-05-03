import { Helmet } from "react-helmet-async";

type JsonLd =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonLd }
  | JsonLd[];

type Props = {
  title: string;
  description: string;
  noindex?: boolean;
  schema?: JsonLd;
};

export default function SEO({ title, description, noindex, schema }: Props) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
