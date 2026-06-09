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

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const FRONTEND_URL = process.env.VITE_API_URL; //zmen zpet
  await transporter.sendMail({
    from: '"CanarexReal" <no-reply@canarexreal.com>',
    to: email,
    subject: "Resetování hesla",
    html: `
      <h2>Resetování hesla</h2>
      <p>Klikněte na níže uvedené odkaz pro resetování vašeho hesla:</p>
     <a href="${FRONTEND_URL}/cs/reset-password?token=${token}" target="_blank">Resetovat heslo</a>
      <p>Tento odkaz vyprší za 1 hodinu.</p>
    `,
  });
};
export const sendRegistrationThanksEmail = async (email: string) => {
  await transporter.sendMail({
    from: '"CanarexReal" <no-reply@canarexreal.com>',
    to: email,
    subject: "Vítejte v CanarexReal ",

    html: `
      <div style="font-family: Arial, sans-serif; background:#f9f9f9; padding:24px;">
        <div style="max-width:600px; margin:0 auto; background:#ffffff; padding:24px; border-radius:12px;">

          <h1 style="margin-bottom:16px; color:#222;">
            Vítejte v CanarexReal 
          </h1>

          <p style="font-size:16px; color:#444; line-height:1.5;">
            Děkujeme za registraci! Jsme rádi, že jste s námi.
          </p>

          <p style="font-size:16px; color:#444; line-height:1.5;">
            Váš účet je nyní aktivní a můžete začít prohlížet nabídky, ukládat oblíbené nemovitosti a spravovat svůj profil.
          </p>

          <div style="margin:24px 0;">
            <a href="${process.env.FRONTEND_URL}"
               style="
                 display:inline-block;
                 padding:12px 20px;
                 background:#1f6feb;
                 color:#fff;
                 text-decoration:none;
                 border-radius:8px;
                 font-weight:bold;
               ">
              Přejít na web
            </a>
          </div>

          <hr style="border:none; border-top:1px solid #eee; margin:24px 0;" />

          <h3 style="margin-bottom:8px; color:#222;">
           Newsletter
          </h3>

          <p style="font-size:14px; color:#555;">
            Chcete dostávat nové nabídky a tipy jako první?
          </p>

          <a href="#"
             style="
               display:inline-block;
               padding:10px 16px;
               background:#111;
               color:#fff;
               text-decoration:none;
               border-radius:8px;
               font-size:14px;
             ">
            Přihlásit se k odběru (zatím neaktivní)
          </a>

          <p style="margin-top:24px; font-size:12px; color:#999;">
            CanarexReal © ${new Date().getFullYear()}
          </p>

        </div>
      </div>
    `,
  });
};
