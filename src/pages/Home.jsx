import "../styles/home.css";

export default function Home() {
  return (
    <main className="home">
      {/* BLOQUE ROSA + HERO COOKIES */}
      <section className="block-pink block-pink--first">
        <div className="block-pink__inner">
          {/* HEADER SUPERIOR */}
          <header className="cta__header">
            <h2 className="cta__title">COMPRAR</h2>
            <p className="cta__subtitle">COOKIES</p>
          </header>

          <div className="hero hero--cookies">
            <img
              className="hero__img"
              src="/assets/hero-cookies.png"
              alt="Cookies"
            />
            <div className="hero__overlay" />
            <div className="hero__content">
              <div className="hero__actions">
                <a className="btn btn--light" href="/cookies">
                  Ver catálogo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE ROSA + HERO TORTAS */}
      <section className="block-pink block-pink--next">
        <div className="block-pink__inner">
          <header className="cta__header">
            <h2 className="cta__title">PRESUPUESTAR</h2>
            <p className="cta__subtitle">TARTAS PERSONALIZADAS Y EVENTOS</p>
          </header>

          <div className="hero hero--tortas">
            <img
              className="hero__img"
              src="/assets/hero-tortas.png"
              alt="Torta"
            />
            <div className="hero__overlay" />
            <div className="hero__content">
              <a className="btn btn--primary" href="/presupuesto">
                Pedir presupuesto
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
