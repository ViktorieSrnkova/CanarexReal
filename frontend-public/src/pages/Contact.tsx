import ContactForm from "../components/Forms/BaseForm";
import "../styles/pages/contact.css";
function Contact() {
  return (
    <div className="contact">
      <ContactForm from={1} what={3} />
    </div>
  );
}

export default Contact;
