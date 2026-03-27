import "../styles/home.css";

export default function Home() {
  return (
    <main className="home">
      {/* BLOQUE ROSA + HERO TORTAS */}
      <section className="block-pink block-pink--first">
        <div className="block-pink__inner">
          <header className="cta__header">
            <p className="cta__subtitle">TORTAS PERSONALIZADAS</p>
          </header>

          <div className="hero hero--cookies">
            <img
              className="hero__img"
              src="/assets/hero-tortas.png"
              alt="Tortas personalizadas"
            />
            <div className="hero__overlay" />
            <div className="hero__content">
              <div className="hero__actions">
                <a className="btn btn--light" href="/tortas">
                  Ver tortas
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE ROSA + HERO RESTO DE PRODUCTOS */}
      <section className="block-pink block-pink--next">
        <div className="block-pink__inner">
          <header className="cta__header">
            <p className="cta__subtitle">TARTAS, BUDINES, ALFAJORES Y MÁS</p>
          </header>

          <div className="hero hero--tortas">
            <img
              className="hero__img"
              src="/assets/hero-productos-varios.png"
              alt="Productos de pastelería"
            />
            <div className="hero__overlay" />
            <div className="hero__content">
              <a className="btn btn--primary" href="/productos">
                Ver productos
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
