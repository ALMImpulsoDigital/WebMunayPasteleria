import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../../styles/admin.css";

const ADMIN_EMAIL = "ana17.molina.am@gmail.com";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError("");

    try {
      setEnviando(true);
      const cred = await signInWithEmailAndPassword(auth, email, password);

      if (cred.user.email !== ADMIN_EMAIL) {
        setMensajeError(
          "No tenés permisos para acceder al panel de administración.",
        );
        await signOut(auth);
        return;
      }

      navigate("/admin/pedidos");
    } catch (err) {
      console.error(err);
      setMensajeError("Email o contraseña incorrectos.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="adminPage">
      <div className="adminShell">
        <div className="adminLoginCard">
          <div className="adminLoginHeader">
            <div className="adminBadge">Munay</div>
            <h2 className="adminTitle">Administración</h2>
            <p className="adminSubtitle">
              Ingresá con tu email y contraseña para gestionar pedidos.
            </p>
          </div>

          <form className="adminForm" onSubmit={handleSubmit}>
            {mensajeError && (
              <div className="adminAlert" role="alert">
                {mensajeError}
              </div>
            )}

            <label className="adminLabel">
              Email
              <input
                className="adminInput"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="tuemail@munay.com"
              />
            </label>

            <label className="adminLabel">
              Contraseña
              <input
                className="adminInput"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </label>

            <button
              className="adminBtnPrimary"
              type="submit"
              disabled={enviando}
            >
              {enviando ? "Ingresando..." : "Entrar"}
            </button>

            <p className="adminHint">Pestaña solo para uso interno 👩‍🍳</p>
          </form>
        </div>
      </div>
    </section>
  );
}
