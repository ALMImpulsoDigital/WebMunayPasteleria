// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer
      style={{
        padding: "1rem 2rem",
        textAlign: "center",
        borderTop: "1px solid #f3c5cd",
        backgroundColor: "#fff7f9",
        fontSize: "0.9rem",
      }}
    >
      © {new Date().getFullYear()} Pastelería Munay · Hecho con ♥
    </footer>
  );
}
