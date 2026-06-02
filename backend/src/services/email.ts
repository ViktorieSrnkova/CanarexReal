import nodemailer from "nodemailer";

type ContactEmailData = {
  name: string;
  surname: string;
  email: string;
  fullPhone: string;
  message: string;
  type?: number[];
  priceFrom?: number;
  priceTo?: number;
  sizeFrom?: number;
  sizeTo?: number;
  bedrooms?: number[];
  bathrooms?: number[];
  date?: string;
  listingId?: number;
  vi_prilet?: boolean;
};

function typeIDsToNames(typeIds: number[] | undefined): string[] | undefined {
  if (!typeIds) return undefined;

  const typeMap: Record<number, string> = {
    1: "Apartmán",
    2: "Dům",
    3: "Vila",
    4: "Garsonka",
    5: "Pozemek",
  };

  return typeIds.map((id) => typeMap[id] || `Neznámý typ (${id})`);
}

export const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString();

export const formatMoneyEUR = (amount: number) =>
  new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
const ADMIN_EMAILS = ["viky.srnkova@seznam.cz", "viky.srnkova16@gmail.com"];

const transporter = nodemailer.createTransport({
  host: "smtp.zoner.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendContactEmail = async (
  email: string,
  data: ContactEmailData,
) => {
  await transporter.sendMail({
    from: '"CanarexReal" <no-reply@canarexreal.com>',
    to: email,
    subject: "Děkujeme za kontakt",
    html: `
      <h2>Děkujeme za váš kontakt</h2>
      <p>Shrnutí vašeho formuláře:</p>

      <ul>
        <li><b>Jméno:</b> ${data.name} ${data.surname}</li>
        <li><b>Email:</b> ${data.email}</li>
        <li><b>Telefon:</b> ${data.fullPhone}</li>
        <br>
        ${data.type ? `<li><b>Typ:</b> ${typeIDsToNames(data.type)}</li>` : ""}
        ${data.priceFrom && data.priceTo ? `<li><b>Cenové rozpětí:</b> ${formatMoneyEUR(data.priceFrom)} - ${formatMoneyEUR(data.priceTo)} </li>` : ""}
        ${data.sizeFrom && data.sizeTo ? `<li><b>Velikost:</b> ${data.sizeFrom} m² - ${data.sizeTo} m²</li>` : ""}
        ${data.bedrooms ? `<li><b>Ložnice:</b> ${data.bedrooms.join(", ")}</li>` : ""}
        ${data.bathrooms ? `<li><b>Koupelny:</b> ${data.bathrooms.join(", ")}</li>` : ""}
        ${data.vi_prilet ? `${data.date ? `<li><b>Datum:</b> ${formatDate(data.date)}</li>` : `<li><b>Datum:</b> Nevím</li>`}` : ""}
        
        ${data.listingId ? `<li><b>ID inzerce:</b> ${data.listingId}</li>` : ""}
      <br>
        <li><b>Zpráva:</b> ${data.message}</li>
        </ul>

      <p>Ozveme se co nejdřív 👍</p>
    `,
  });
};

export const testSMTP = async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP connection OK");
  } catch (err) {
    console.error("❌ SMTP connection failed:", err);
  }
};

export const sendAdminNotificationEmail = async (data: ContactEmailData) => {
  const VITE_ADMIN_URL = process.env.VITE_ADMIN_URL;
  await transporter.sendMail({
    from: '"CanarexReal" <no-reply@canarexreal.com>',
    to: ADMIN_EMAILS.join(","),
    subject: "Nový formulář z webu",
    html: `
      <h2>Nový kontaktní formulář</h2>

      <ul>
        <li><b>Jméno:</b> ${data.name} ${data.surname}</li>
        <li><b>Email:</b> ${data.email}</li>
        <li><b>Telefon:</b> ${data.fullPhone}</li>
       <br>
         ${data.type ? `<li><b>Typ:</b> ${typeIDsToNames(data.type)}</li>` : ""}
         ${data.priceFrom && data.priceTo ? `<li><b>Cenové rozpětí:</b> ${formatMoneyEUR(data.priceFrom)} - ${formatMoneyEUR(data.priceTo)} </li>` : ""}
        ${data.sizeFrom && data.sizeTo ? `<li><b>Velikost:</b> ${data.sizeFrom} m² - ${data.sizeTo} m²</li>` : ""}
        ${data.bedrooms ? `<li><b>Ložnice:</b> ${data.bedrooms.join(", ")}</li>` : ""}
        ${data.bathrooms ? `<li><b>Koupelny:</b> ${data.bathrooms.join(", ")}</li>` : ""}
        ${data.vi_prilet ? `${data.date ? `<li><b>Datum:</b> ${formatDate(data.date)}</li>` : `<li><b>Datum:</b> Nevím</li>`}` : ""}
        ${data.listingId ? `<li><b>ID inzerce:</b> ${data.listingId}</li>` : ""}
      <br>
         <li><b>Zpráva:</b> ${data.message}</li>
        </ul>

      <hr />

      <p>
        👉 <a href="${VITE_ADMIN_URL}/forms">Otevřít administraci</a>
      </p>
    `,
  });
};
