import nodemailer from "nodemailer";

type ContactEmailData = {
  name: string;
  surname: string;
  email: string;
  fullPhone: string;
  message: string;
};

const ADMIN_EMAILS = ["viky.srnkova@seznam.cz", "viky.srnkova16@gmail.com"];

const transporter = nodemailer.createTransport({
  host: "smtp.zoner.com",
  port: 465,
  secure: true,
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
  const ADMIN_URL = process.env.ADMIN_URL;
  await transporter.sendMail({
    from: '"CanarexReal" <no-reply@canarexreal.com>',
    to: ADMIN_EMAILS.join(","),
    subject: "Nový formulář z webu",
    html: `
      <h2>Nový kontakt formulář</h2>

      <ul>
        <li><b>Jméno:</b> ${data.name} ${data.surname}</li>
        <li><b>Email:</b> ${data.email}</li>
        <li><b>Telefon:</b> ${data.fullPhone}</li>
        <li><b>Zpráva:</b> ${data.message}</li>
      </ul>

      <hr />

      <p>
        👉 <a href="${ADMIN_URL}/forms">Otevřít administraci</a>
      </p>
    `,
  });
};
