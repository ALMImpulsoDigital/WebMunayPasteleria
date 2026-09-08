import "../styles/WhatsAppButton.css";

export default function WhatsAppButton() {
  // 👉 Reemplazá este número por el de tu clienta (formato internacional sin + ni espacios)
  const phone = "5493541587914";

  const message = "Hola! Tengo una consulta sobre Pastelería Munay 😊";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      className="whatsapp-button"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        alt="WhatsApp Pastelería Munay"
        className="whatsapp-icon"
        src="/assets/icons/whatsapp.webp"
        width="111"
        height="112"
        decoding="async"
      />
      <span className="whatsapp-tooltip">¿Tenés dudas? ¡Consultá acá!</span>
    </a>
  );
}
