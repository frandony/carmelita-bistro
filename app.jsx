const { useState, useEffect, useRef, useMemo } = React;

// ====== Inline SVG logo (fetch para garantir animação CSS) ======
function InlineLogo() {
  const ref = useRef(null);
  useEffect(() => {
    fetch("assets/desenho-logo-png.svg")
      .then((r) => r.text())
      .then((svg) => {
        if (ref.current) ref.current.innerHTML = svg;
      });
  }, []);
  return <span ref={ref} className="hero-logo-mark" aria-hidden="true" />;
}

// ====== Reveal-on-scroll hook ======
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

// ====== Placeholder tiles ======
function Placeholder({ kind = "stripes", label, note }) {
  return (
    <div className={`ph ph-${kind}`}>
      <div style={{ textAlign: "center", padding: 16 }}>
        <div className="ph-meta">{label}</div>
        {note ? <div className="ph-meta" style={{ marginTop: 6, opacity: 0.55 }}>{note}</div> : null}
      </div>
    </div>
  );
}

// ====== Nav ======
function Nav({ route, go, onCta }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "home", label: "Início" },
    { id: "sobre", label: "Sobre" },
    { id: "cardapio", label: "Cardápio" },
    { id: "reservas", label: "Reservas" },
  ];

  return (
    <>
      <nav className={"nav" + (scrolled ? " scrolled" : "")}>
        <div className="nav-brand" onClick={() => go("home")}>
          <div className="nav-brand-mark">
            <img src="assets/carmelita-logo.png" alt="Carmelita" />
          </div>
          <div className="nav-brand-text">CARMELITA</div>
        </div>
        <div className="nav-links">
          {links.map((l) => (
            <a key={l.id}
               className={"nav-link" + (route === l.id ? " active" : "")}
               onClick={(e) => { e.preventDefault(); go(l.id); }}>
              {l.label}
            </a>
          ))}
        </div>
        <button className="nav-cta" onClick={onCta}>Reservar mesa</button>
        <button className="nav-burger" onClick={() => setMobile(true)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </nav>
      <div className={"mobile-menu" + (mobile ? " open" : "")}>
        <button className="mobile-close" onClick={() => setMobile(false)}>×</button>
        {links.map((l) => (
          <a key={l.id}
             className={"nav-link" + (route === l.id ? " active" : "")}
             onClick={(e) => { e.preventDefault(); go(l.id); setMobile(false); }}>
            {l.label}
          </a>
        ))}
        <button className="nav-cta" style={{ display: "inline-block", marginTop: 16 }}
                onClick={() => { onCta(); setMobile(false); }}>
          Reservar mesa
        </button>
      </div>
    </>
  );
}

// ====== Footer ======
function Footer({ go }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">CARMELITA</div>
            <p className="footer-tag">Restaurante & Bistrô intimista na Praia da Costa. Culinária autoral do Cheff Gastão, recebida pela Fernanda no salão.</p>
          </div>
          <div className="footer-col">
            <h4>Endereço</h4>
            <p>Rua Piratininga, 111 — Lj 1</p>
            <p>Praia da Costa · Vila Velha · ES</p>
          </div>
          <div className="footer-col">
            <h4>Horários</h4>
            <p>Ter–Sex · 19h às 23h30</p>
            <p>Sáb · 12h–15h e 19h–23h30</p>
            <p>Dom e Seg · Fechado</p>
          </div>
          <div className="footer-col">
            <h4>Contato</h4>
            <a href="tel:+5527997475391">(27) 99747-5391</a>
            <a href="https://instagram.com/carmelita_restaurante" target="_blank" rel="noopener">@carmelita_restaurante</a>
            <a href="https://facebook.com/carmelitaresto01" target="_blank" rel="noopener">Facebook · carmelitaresto01</a>
            <a href="https://www.tripadvisor.com.br" target="_blank" rel="noopener">TripAdvisor · 4,8 ★</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Carmelita Restaurante & Bistrô · Todos os direitos reservados</span>
          <span>Casa de família · arte na mesa</span>
        </div>
        <div className="footer-dev">
          <a className="nav-admin-btn" href="#admin">Admin</a>
          {" · "}Criado e desenvolvido por Francisco Gomes ·{" "}
          <a href="https://franciscogomes.com" target="_blank" rel="noopener">franciscogomes.com</a>
        </div>
      </div>
    </footer>
  );
}

// ====== Landing ======
function Landing({ go }) {
  useReveal();
  return (
    <div className="page page-enter">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <div className="hero-eyebrow reveal">Restaurante & Bistrô · Praia da Costa, Vila Velha</div>

          <InlineLogo />
          <h1 className="hero-wordmark reveal d2">Carmelita</h1>
          <p className="hero-tagline reveal d3">
            Cozinha autoral.<br/><em>Arte na mesa.</em>
          </p>
          <div className="hero-ctas reveal d4">
            <button className="btn btn-primary" onClick={() => go("reservas")}>Reservar mesa</button>
            <button className="btn btn-ghost" onClick={() => go("cardapio")}>Ver cardápio</button>
          </div>
        </div>

        <div className="hero-meta">
          <span className="hero-meta-item"><span className="dot"></span>Casa aberta · esta noite</span>
          <span className="hero-meta-item">Cheff Gastão · cozinha autoral</span>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="block diffs">
        <div className="container">
          <span className="block-eyebrow reveal"><span className="num">01 /</span>Diferenciais da casa</span>
          <h2 className="block-title reveal d1">Três coisas que <em>fazemos diferente</em>.</h2>
          <p className="block-sub reveal d2">Uma proposta para encantar com novidades e preços justos. Sempre.</p>

          <div className="diffs-grid">
            <div className="diff reveal d1">
              <span className="diff-num">i.</span>
              <div className="diff-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 3c-1 3-4 5-4 8a4 4 0 0 0 8 0c0-3-3-5-4-8z" strokeWidth="1.2"/>
                  <path d="M9 17v1a3 3 0 0 0 6 0v-1" strokeWidth="1.2"/>
                  <line x1="8" y1="21" x2="16" y2="21" strokeWidth="1.2"/>
                </svg>
              </div>
              <h3 className="diff-title">Cozinha autoral do Cheff Gastão.</h3>
              <p className="diff-text">Receitas exclusivas que unem técnica e criatividade: risoto caprese com camarão, ravióli de banana da terra, coxinha de rabada. Cardápio enxuto, mão segura.</p>
            </div>
            <div className="diff reveal d2">
              <span className="diff-num">ii.</span>
              <div className="diff-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" strokeWidth="1.2"/>
                  <path d="M16 3H8L6 7h12l-2-4z" strokeWidth="1.2"/>
                  <circle cx="12" cy="13" r="2" strokeWidth="1.2"/>
                </svg>
              </div>
              <h3 className="diff-title">Gestão de família, atendimento próximo.</h3>
              <p className="diff-text">A Fernanda recebe pessoalmente no salão. Casa pequena, atenção por nome. Os donos sempre presentes — e isso os clientes percebem e valorizam.</p>
            </div>
            <div className="diff reveal d3">
              <span className="diff-num">iii.</span>
              <div className="diff-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="14" rx="1" strokeWidth="1.2"/>
                  <path d="M3 8h18" strokeWidth="1.2"/>
                  <path d="M8 3v5M16 3v5" strokeWidth="1.2"/>
                  <circle cx="8.5" cy="13" r="1" fill="currentColor" stroke="none"/>
                  <circle cx="12" cy="13" r="1" fill="currentColor" stroke="none"/>
                  <circle cx="15.5" cy="13" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </div>
              <h3 className="diff-title">Ambiente intimista, arte na parede.</h3>
              <p className="diff-text">Decoração com referência a quadros de grandes artistas. Luz baixa, boa música, espaço contemporâneo e aconchegante. Um bistrô para ficar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MOOD GALLERY */}
      <section className="block mood">
        <div className="container">
          <span className="block-eyebrow reveal"><span className="num">02 /</span>A atmosfera da casa</span>
          <h2 className="block-title reveal d1">Arte, luz baixa e <em>cozinha de autor</em>.</h2>

          <div className="mood-grid">
            <div className="mood-tile t1 reveal d1">
              <Placeholder kind="warm" label="01 · Salão intimista" note="luz âmbar · arte na parede" />
              <span className="mood-label">Salão</span>
            </div>
            <div className="mood-tile t2 reveal d2">
              <Placeholder kind="deep" label="02 · Risoto caprese" note="camarão · manjericão" />
              <span className="mood-label">Prato</span>
            </div>
            <div className="mood-tile t3 reveal d3">
              <Placeholder kind="stripes" label="03 · Decoração" note="referência · quadros" />
              <span className="mood-label">Arte</span>
            </div>
            <div className="mood-tile t4 reveal d2">
              <Placeholder kind="pale" label="04 · Mise en place" note="mão do chef" />
              <span className="mood-label">Mise</span>
            </div>
            <div className="mood-tile t5 reveal d3">
              <Placeholder kind="warm" label="05 · Coxinha de rabada" note="autoral · banana da terra" />
              <span className="mood-label">Petisco</span>
            </div>
            <div className="mood-tile t6 reveal d4">
              <Placeholder kind="deep" label="06 · Bobozinho de camarão" note="porção bistrô" />
              <span className="mood-label">Bistrô</span>
            </div>
          </div>
        </div>
      </section>

      {/* PULL QUOTE TEASER */}
      <section className="pullquote">
        <div className="container">
          <span className="pullquote-mark reveal">"</span>
          <p className="pullquote-text reveal d1">
            A casa é pequena, <em>mas cabe a gente toda.</em>
          </p>
          <span className="pullquote-author reveal d2">Fernanda & Cheff Gastão</span>
        </div>
      </section>

      {/* EVENTOS ESPECIAIS */}
      <section className="block" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="container">
          <span className="block-eyebrow reveal"><span className="num">03 /</span>Eventos especiais</span>
          <h2 className="block-title reveal d1" style={{ margin: "0 0 24px" }}>Confrarias e <em>noites temáticas</em>.</h2>
          <p className="block-sub reveal d2" style={{ margin: "0 0 40px" }}>
            Às terças, abrimos a casa para confrarias e eventos gastronômicos. A Confraria Vinha Velha já fez história aqui. Agende o seu grupo e venha criar uma.
          </p>
          <div className="reveal d3">
            <a href="https://wa.me/5527997475391" target="_blank" rel="noopener" className="btn btn-ghost">
              Falar com a casa via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="block" style={{ paddingTop: 60, paddingBottom: 140 }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="block-eyebrow reveal"><span className="num">04 /</span>Sua mesa</span>
          <h2 className="block-title reveal d1" style={{ margin: "0 auto" }}>Reserve um lugar à <em>luz baixa</em>.</h2>
          <p className="block-sub reveal d2" style={{ margin: "22px auto 48px" }}>
            Casa pequena, lista curta. Recomendamos reservar com antecedência.
          </p>
          <div className="reveal d3" style={{ display: "inline-flex", gap: 18, flexWrap: "wrap", justifyContent: "center" }}>
            <button className="btn btn-primary" onClick={() => go("reservas")}>Reservar agora</button>
            <button className="btn btn-ghost" onClick={() => go("sobre")}>Conhecer a história</button>
          </div>
        </div>
      </section>

      <Footer go={go} />
    </div>
  );
}

// ====== Sobre ======
function Sobre({ go }) {
  useReveal();

  const reconhecimentos = [
    { num: "4,8", label: "no TripAdvisor", sub: "19 avaliações · nota máxima" },
    { num: "Top 10%", label: "de Vila Velha", sub: "Travellers' Choice · TripAdvisor" },
    { num: "4.622", label: "seguidores", sub: "@carmelita_restaurante · Instagram" },
  ];

  return (
    <div className="page page-enter">
      <section className="sobre-hero">
        <div className="container">
          <div className="sobre-grid">
            <div>
              <span className="block-eyebrow reveal"><span className="num">A /</span>A casa</span>
              <h1 className="sobre-hero-title reveal d1">
                A casa onde os <em>donos te recebem.</em>
              </h1>
            </div>
            <p className="sobre-hero-lead reveal d2">
              O Carmelita é um restaurante e bistrô gerido pelos próprios donos. A Fernanda recebe no salão; o Cheff Gastão assina a cozinha. Casa pequena, criação autoral, ambiente intimista com referência a quadros de grandes artistas.
            </p>
          </div>
        </div>
      </section>

      <section className="block" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div className="container">
          <div className="sobre-editorial">
            <div className="chef-photo reveal">
              <Placeholder kind="warm" label="Cheff Gastão · cozinha" note="criação autoral · Vila Velha" />
              <div className="chef-photo-caption">
                Cozinha
                <span className="small">Cheff Gastão</span>
              </div>
            </div>
            <div className="sobre-prose reveal d1">
              <p>
                A Fernanda e o Gastão não abriram apenas um restaurante — abriram uma extensão da própria casa. Ela acolhe no salão com calor humano e simpatia que os clientes não esquecem. Ele cria na cozinha com liberdade e técnica, assinando pratos que surpreendem a cada visita.
              </p>
              <p>
                A proposta do Carmelita é encantar com novidades e preços justos. Mistura de restaurante com bistrô, a casa une culinária elaborada a um ambiente intimista: decoração com referência a quadros de grandes artistas, luz certa, boa música e uma conversa fácil.
              </p>
              <p>
                Os clientes percebem — e valorizam — o fato de os donos estarem sempre presentes e atentos. Isso não é detalhe: é o coração do Carmelita.
              </p>
              <div className="signature">— Fernanda & Gastão, proprietários</div>
            </div>
          </div>
        </div>
      </section>

      <section className="pullquote">
        <div className="container">
          <span className="pullquote-mark reveal">"</span>
          <p className="pullquote-text reveal d1">
            Aqui, a gente <em>cozinha pra quem volta.</em>
          </p>
          <span className="pullquote-author reveal d2">Filosofia da casa</span>
        </div>
      </section>

      <section className="timeline">
        <div className="container">
          <span className="block-eyebrow reveal"><span className="num">B /</span>Reconhecimento</span>
          <h2 className="block-title reveal d1">Uma casa <em>que os clientes escolhem de volta.</em></h2>

          <div className="timeline-track">
            {reconhecimentos.map((r, i) => (
              <div className={`tl-item reveal d${i+1}`} key={r.num}>
                <div className="tl-dot"></div>
                <div className="tl-year" style={{ fontSize: "2rem" }}>{r.num}</div>
                <div className="tl-tag">{r.label}</div>
                <div className="tl-text">{r.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" style={{ paddingTop: 60, paddingBottom: 140, textAlign: "center" }}>
        <div className="container">
          <h2 className="block-title reveal d1" style={{ margin: "0 auto" }}>Venha conhecer a casa.</h2>
          <div className="reveal d2" style={{ marginTop: 40 }}>
            <button className="btn btn-primary" onClick={() => go("reservas")}>Reservar uma mesa</button>
          </div>
        </div>
      </section>

      <Footer go={go} />
    </div>
  );
}

// ====== Cardápio ======
function Cardapio({ go }) {
  useReveal();
  const data = useMemo(() => {
    try {
      const stored = localStorage.getItem("carmelita-menu-v1");
      if (stored) return JSON.parse(stored);
    } catch {}
    try { return JSON.parse(document.getElementById("menu-data").textContent); }
    catch { return { categories: [], items: [] }; }
  }, []);
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => (
    active === "all" ? data.items : data.items.filter((i) => i.cat === active)
  ), [active, data.items]);

  const counts = useMemo(() => {
    const c = { all: data.items.length };
    data.items.forEach((i) => { c[i.cat] = (c[i.cat] || 0) + 1; });
    return c;
  }, [data.items]);

  const catLabel = (cat) => (data.categories.find((c) => c.id === cat) || {}).label || cat;

  return (
    <div className="page page-enter">
      <section className="menu-hero">
        <div className="container">
          <div className="menu-hero-row">
            <div>
              <span className="block-eyebrow reveal"><span className="num">C /</span>Cardápio da casa</span>
              <h1 className="block-title reveal d1">Cozinha autoral do <em>Cheff Gastão.</em></h1>
            </div>
            <div className="menu-hero-meta reveal d2">
              <span className="em">Cardápio enxuto e criterioso</span>
              <span>Pratos autorais e criações do chef. Produto sazonal, mão segura.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        {/* Featured */}
        <div className="featured reveal">
          <div className="featured-img">
            <Placeholder kind="warm" label="Prato da casa · vista superior" note="risoto · camarão · caprese" />
          </div>
          <div className="featured-body">
            <span className="featured-badge">Destaque da Casa</span>
            <h2 className="featured-title">Risoto Caprese com <em>Camarão Salteado</em>.</h2>
            <p className="featured-desc">
              Risoto cremoso de tomate e mussarela de búfala, finalizado com camarões salteados na manteiga e manjericão fresco. Uma das criações autorais mais elogiadas do Cheff Gastão — sofisticação e sabor em equilíbrio perfeito.
            </p>
            <div className="featured-bottom">
              <div className="featured-price"><span className="price-tba">Consultar</span></div>
              <div className="featured-meta">Prato autoral · Cheff Gastão</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-row reveal">
          {data.categories.map((c) => (
            <button key={c.id}
                    className={"filter-tab" + (active === c.id ? " active" : "")}
                    onClick={() => setActive(c.id)}>
              {c.label}<span className="count">{counts[c.id] || 0}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="menu-grid">
          {filtered.map((it, i) => (
            <div className={`menu-item reveal d${(i % 4) + 1}`} key={it.name}>
              <div>
                <div className="menu-item-header">
                  <h3 className="menu-item-name">{it.name}</h3>
                  {it.tag ? <span className="menu-item-tag">{it.tag}</span> : null}
                </div>
                <p className="menu-item-desc">{it.desc}</p>
                <div className="menu-item-cat">{catLabel(it.cat)}</div>
              </div>
              <div className="menu-item-price">
                {it.price ? <><span className="currency">R$</span>{it.price}</> : <span className="price-tba">Consultar</span>}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "80px 0 60px", textAlign: "center" }}>
          <p className="block-sub reveal" style={{ margin: "0 auto 32px" }}>
            Trabalhamos com produto sazonal. Cardápio sujeito a variações conforme o mercado.
          </p>
          <div className="reveal d1">
            <button className="btn btn-primary" onClick={() => go("reservas")}>Reservar para esta noite</button>
          </div>
        </div>
      </section>

      <Footer go={go} />
    </div>
  );
}

// ====== Reservas ======
function Reservas({ go }) {
  useReveal();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    data: "",
    horario: "20:00",
    pessoas: "2",
    ocasiao: "",
    obs: "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setSubmitted(false);
    setForm({ nome: "", email: "", data: "", horario: "20:00", pessoas: "2", ocasiao: "", obs: "" });
  };

  const fmtDate = (d) => {
    if (!d) return "—";
    const [y, m, day] = d.split("-");
    return `${day}.${m}.${y.slice(2)}`;
  };

  return (
    <div className="page page-enter">
      <section className="reservas-wrap">
        <div className="container">
          <div className="reservas-grid">
            <div className="reservas-side">
              <span className="block-eyebrow reveal"><span className="num">D /</span>Mesa reservada</span>
              <h2 className="reveal d1">Uma mesa<br/><em>à luz baixa.</em></h2>
              <p className="reveal d2">
                O Carmelita é uma casa pequena e acolhedora. Reservas confirmadas pela Fernanda em até duas horas. Para grupos, fale diretamente conosco.
              </p>
              <p className="reveal d3" style={{ fontStyle: "italic", color: "var(--bege-areia)" }}>
                Tolerância de 15 minutos · Após esse tempo, sua mesa retorna à fila da noite.
              </p>

              <div className="reservas-info reveal d4">
                <div>
                  <div className="ri-label">Endereço</div>
                  <div className="ri-value">Rua Piratininga, 111 — Lj 1<span className="small">Praia da Costa · Vila Velha · ES</span></div>
                </div>
                <div>
                  <div className="ri-label">Contato direto</div>
                  <div className="ri-value"><a href="tel:+5527997475391">(27) 99747-5391</a><span className="small">WhatsApp disponível</span></div>
                </div>
                <div>
                  <div className="ri-label">Horários</div>
                  <div className="ri-value">Ter–Sex · 19h às 23h30<span className="small">Sáb · 12h–15h e 19h–23h30</span></div>
                </div>
                <div>
                  <div className="ri-label">Fechado</div>
                  <div className="ri-value">Dom e Seg<span className="small">Terças abertas para eventos/confrarias</span></div>
                </div>
              </div>
            </div>

            <div className="reveal d2">
              <div className="form-card">
                {!submitted ? (
                  <form onSubmit={onSubmit}>
                    <div className="form-eyebrow">Formulário · Reserva</div>
                    <div className="form-title">Diga-nos quando<br/>e quantos.</div>

                    <div className="form-row">
                      <div className="form-field">
                        <label htmlFor="nome">Nome</label>
                        <input id="nome" type="text" required value={form.nome}
                               onChange={set("nome")} placeholder="Como te chamar?" />
                      </div>
                      <div className="form-field">
                        <label htmlFor="email">E-mail</label>
                        <input id="email" type="email" required value={form.email}
                               onChange={set("email")} placeholder="seu@email.com" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-field">
                        <label htmlFor="data">Data</label>
                        <input id="data" type="date" required value={form.data}
                               onChange={set("data")} min={new Date().toISOString().slice(0,10)} />
                      </div>
                      <div className="form-field">
                        <label htmlFor="horario">Horário</label>
                        <select id="horario" value={form.horario} onChange={set("horario")}>
                          {["19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00"].map((h) => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-field">
                        <label htmlFor="pessoas">Número de pessoas</label>
                        <select id="pessoas" value={form.pessoas} onChange={set("pessoas")}>
                          {[1,2,3,4,5,6].map((n) => (
                            <option key={n} value={n}>{n} {n === 1 ? "pessoa" : "pessoas"}</option>
                          ))}
                          <option value="6+">Mais de 6 (contatar a casa)</option>
                        </select>
                      </div>
                      <div className="form-field">
                        <label htmlFor="ocasiao">Ocasião especial <span style={{ color: "rgba(216,199,174,0.45)", letterSpacing: "0.18em" }}>· opcional</span></label>
                        <select id="ocasiao" value={form.ocasiao} onChange={set("ocasiao")}>
                          <option value="">—</option>
                          <option value="Aniversário">Aniversário</option>
                          <option value="Encontro">Encontro</option>
                          <option value="Negócios">Negócios</option>
                          <option value="Comemoração">Comemoração</option>
                          <option value="Sem ocasião">Apenas porque sim</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-field full">
                        <label htmlFor="obs">Observações <span style={{ color: "rgba(216,199,174,0.45)", letterSpacing: "0.18em" }}>· opcional</span></label>
                        <input id="obs" type="text" value={form.obs}
                               onChange={set("obs")} placeholder="Restrições, mesa preferida, surpresa para alguém…" />
                      </div>
                    </div>

                    <button type="submit" className="form-submit">Confirmar reserva</button>
                  </form>
                ) : (
                  <div className="confirm-screen">
                    <div className="confirm-seal">
                      <svg viewBox="0 0 120 120">
                        <circle className="ring" cx="60" cy="60" r="57" />
                        <circle cx="60" cy="60" r="48" stroke="rgba(138,106,68,0.3)" strokeWidth="1" fill="none" strokeDasharray="2 4" />
                        <path className="check" d="M40 62 L54 76 L82 46" />
                      </svg>
                    </div>
                    <h3 className="confirm-title">Mesa <em>reservada.</em></h3>
                    <p className="confirm-sub">
                      Obrigado, {form.nome.split(" ")[0] || "visitante"}. A Fernanda vai confirmar em até duas horas. Até lá!
                    </p>

                    <div className="confirm-ticket">
                      <div>
                        <div className="ct-label">Data</div>
                        <div className="ct-value">{fmtDate(form.data)}</div>
                      </div>
                      <div>
                        <div className="ct-label">Horário</div>
                        <div className="ct-value">{form.horario}</div>
                      </div>
                      <div>
                        <div className="ct-label">Pessoas</div>
                        <div className="ct-value">{form.pessoas}</div>
                      </div>
                    </div>

                    <div style={{ display: "inline-flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                      <button className="confirm-cta" onClick={reset}>Nova reserva</button>
                      <button className="confirm-cta" onClick={() => go("cardapio")}>Ver cardápio</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer go={go} />
    </div>
  );
}

// ====== Admin ======
const ADMIN_PASS = "carmelita2026";
const MENU_KEY   = "carmelita-menu-v1";
const PRESETS_KEY = "carmelita-presets-v1";
const ACTIVE_KEY  = "carmelita-active-v1";

function loadDefaultMenu() {
  try { return JSON.parse(document.getElementById("menu-data").textContent); }
  catch { return { categories: [], items: [] }; }
}

function getDefaultPresets() {
  const base = loadDefaultMenu();
  const entradas = base.items.filter(it => it.cat === "entradas");
  return [
    {
      id: "padrao",
      name: "Cardápio Padrão",
      categories: base.categories,
      items: base.items,
    },
    {
      id: "sabado",
      name: "Cardápio de Sábado",
      categories: base.categories,
      items: base.items, // mesmo menu; feijoada já tem tag "Sábados"
    },
    {
      id: "eventos",
      name: "Cardápio de Eventos",
      categories: [
        { id: "all", label: "Tudo" },
        { id: "entradas", label: "Entradas & Petiscos" },
      ],
      items: entradas,
    },
  ];
}

function Admin() {
  const [authed, setAuthed]   = useState(false);
  const [pass, setPass]       = useState("");
  const [passErr, setPassErr] = useState(false);

  const [presets, setPresets] = useState(() => {
    try { const s = localStorage.getItem(PRESETS_KEY); if (s) return JSON.parse(s); } catch {}
    return getDefaultPresets();
  });
  const [activeId, setActiveId] = useState(() => localStorage.getItem(ACTIVE_KEY) || "padrao");
  const [editingId, setEditingId] = useState(() => localStorage.getItem(ACTIVE_KEY) || "padrao");

  const [editItem, setEditItem]   = useState(null);
  const [editForm, setEditForm]   = useState({});
  const [addingItem, setAddingItem] = useState(false);
  const [newItem, setNewItem]     = useState({ cat: "", name: "", desc: "", price: "", tag: "" });
  const [saveStatus, setSaveStatus] = useState("idle");
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal]   = useState("");

  const editingPreset = presets.find(p => p.id === editingId) || presets[0];

  // Auto-save com debounce
  useEffect(() => {
    if (!authed) return;
    setSaveStatus("saving");
    const t = setTimeout(() => {
      try {
        localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
        localStorage.setItem(ACTIVE_KEY, activeId);
        const active = presets.find(p => p.id === activeId);
        if (active) localStorage.setItem(MENU_KEY, JSON.stringify({ categories: active.categories, items: active.items }));
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch { setSaveStatus("idle"); }
    }, 800);
    return () => clearTimeout(t);
  }, [presets, activeId, authed]);

  const manualSave = () => {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
    localStorage.setItem(ACTIVE_KEY, activeId);
    const active = presets.find(p => p.id === activeId);
    if (active) localStorage.setItem(MENU_KEY, JSON.stringify({ categories: active.categories, items: active.items }));
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const login = (e) => {
    e.preventDefault();
    if (pass === ADMIN_PASS) { setAuthed(true); setPassErr(false); }
    else setPassErr(true);
  };

  // Preset operations
  const activatePreset = (id) => {
    setActiveId(id);
  };

  const editPreset = (id) => {
    setEditingId(id);
    setEditItem(null);
    setAddingItem(false);
  };

  const duplicatePreset = (id) => {
    const src = presets.find(p => p.id === id);
    if (!src) return;
    const nid = "p_" + Date.now();
    setPresets(ps => [...ps, { ...src, id: nid, name: src.name + " (cópia)" }]);
  };

  const deletePreset = (id) => {
    if (presets.length <= 1) { alert("Não é possível excluir o único cardápio."); return; }
    if (!confirm("Excluir este cardápio predefinido?")) return;
    const remaining = presets.filter(p => p.id !== id);
    setPresets(remaining);
    if (editingId === id) setEditingId(remaining[0].id);
    if (activeId  === id) setActiveId(remaining[0].id);
  };

  const startRename = (id, name) => { setRenamingId(id); setRenameVal(name); };
  const saveRename  = () => {
    setPresets(ps => ps.map(p => p.id === renamingId ? { ...p, name: renameVal } : p));
    setRenamingId(null);
  };

  const newPreset = () => {
    const nid = "p_" + Date.now();
    setPresets(ps => [...ps, { id: nid, name: "Novo Cardápio", categories: editingPreset.categories, items: [] }]);
    setEditingId(nid);
    setEditItem(null);
    setAddingItem(false);
  };

  // Item operations on editingPreset
  const updateEditing = (patch) =>
    setPresets(ps => ps.map(p => p.id === editingId ? { ...p, ...patch } : p));

  const removeItem = (idx) =>
    updateEditing({ items: editingPreset.items.filter((_, i) => i !== idx) });

  const startEditItem = (idx) => { setEditItem(idx); setEditForm({ ...editingPreset.items[idx] }); };

  const saveEditItem = () => {
    updateEditing({ items: editingPreset.items.map((it, i) => i === editItem ? { ...editForm } : it) });
    setEditItem(null);
  };

  const addItem = () => {
    if (!newItem.name.trim() || !newItem.cat) return;
    updateEditing({ items: [...editingPreset.items, { ...newItem }] });
    setNewItem({ cat: "", name: "", desc: "", price: "", tag: "" });
    setAddingItem(false);
  };

  const ef = (k) => (e) => setEditForm(f => ({ ...f, [k]: e.target.value }));
  const nf = (k) => (e) => setNewItem(f => ({ ...f, [k]: e.target.value }));

  if (!authed) {
    return (
      <div className="page page-enter admin-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ width: "100%", maxWidth: 360, padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="footer-brand" style={{ marginBottom: 12 }}>CARMELITA</div>
            <p style={{ opacity: 0.6, fontSize: "0.95rem" }}>Área restrita · Gestão do cardápio</p>
          </div>
          <form onSubmit={login} className="admin-form">
            <div className="form-field" style={{ marginBottom: 16 }}>
              <label htmlFor="admin-pass">Senha de acesso</label>
              <input id="admin-pass" type="password" value={pass}
                     onChange={(e) => setPass(e.target.value)} placeholder="••••••••" autoFocus />
            </div>
            {passErr && <p style={{ color: "#c0392b", fontSize: "0.9rem", marginBottom: 12 }}>Senha incorreta.</p>}
            <button type="submit" className="form-submit" style={{ width: "100%" }}>Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-enter">
      <div className="admin-page container">

        {/* ── Cabeçalho ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 48 }}>
          <div>
            <div className="block-eyebrow" style={{ marginBottom: 8 }}>Gestão do Cardápio</div>
            <h1 className="block-title" style={{ margin: 0 }}>Painel <em>Admin</em>.</h1>
          </div>
          <div className="admin-actions">
            <span className="admin-autosave-status" style={{ marginLeft: "auto" }}>
              {saveStatus === "saving" && "Salvando…"}
              {(saveStatus === "saved" || saveStatus === "idle") && "Salvo automaticamente ✓"}
            </span>
          </div>
        </div>

        {/* ── Cardápios Predefinidos ── */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
            <div>
              <h2 className="block-title" style={{ margin: 0, fontSize: "1.6rem" }}>Selecione e <em>edite</em>.</h2>
            </div>
            <button className="btn btn-ghost" onClick={newPreset}>+ Novo cardápio</button>
          </div>

          <div className="presets-grid">
            {presets.map(p => (
              <div key={p.id} className={
                "preset-card" +
                (p.id === activeId  ? " preset-active"  : "") +
                (p.id === editingId ? " preset-editing" : "")
              }>
                <div className="preset-badges">
                  {p.id === activeId  && <span className="badge-active">● Ativo (público)</span>}
                  {p.id === editingId && p.id !== activeId && <span className="badge-editing">Em edição</span>}
                </div>

                {renamingId === p.id ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "8px 0 12px" }}>
                    <input
                      className="preset-rename-input"
                      value={renameVal}
                      onChange={e => setRenameVal(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") saveRename(); if (e.key === "Escape") setRenamingId(null); }}
                      autoFocus
                    />
                    <button className="btn btn-primary" style={{ padding: "6px 14px", fontSize: "0.85rem" }} onClick={saveRename}>OK</button>
                    <button className="btn btn-ghost" style={{ padding: "6px 10px", fontSize: "0.85rem" }} onClick={() => setRenamingId(null)}>✕</button>
                  </div>
                ) : (
                  <div className="preset-name">{p.name}</div>
                )}

                <div className="preset-count">{p.items.length} {p.items.length === 1 ? "prato" : "pratos"}</div>

                <div className="preset-actions">
                  {p.id !== activeId && (
                    <button className="btn btn-primary" style={{ padding: "7px 16px", fontSize: "0.85rem" }}
                            onClick={() => activatePreset(p.id)}>
                      Ativar
                    </button>
                  )}
                  <button className="btn btn-ghost" style={{ padding: "7px 16px", fontSize: "0.85rem" }}
                          onClick={() => editPreset(p.id)}>
                    {p.id === editingId ? "Editando ↓" : "Editar itens"}
                  </button>
                  <button className="btn btn-ghost" style={{ padding: "7px 14px", fontSize: "0.85rem" }}
                          onClick={() => startRename(p.id, p.name)}>
                    Renomear
                  </button>
                  <button className="btn btn-ghost" style={{ padding: "7px 14px", fontSize: "0.85rem" }}
                          onClick={() => duplicatePreset(p.id)}>
                    Duplicar
                  </button>
                  {presets.length > 1 && (
                    <button className="btn btn-ghost" style={{ padding: "7px 14px", fontSize: "0.85rem", opacity: 0.45 }}
                            onClick={() => deletePreset(p.id)}>
                      Excluir
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Editor de itens ── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
            <div>
              <h2 className="block-title" style={{ margin: 0, fontSize: "1.6rem" }}>
                <em>{editingPreset?.name}</em>
                {editingId === activeId && <span className="badge-active" style={{ marginLeft: 16, fontSize: "0.7rem" }}>Ativo</span>}
              </h2>
            </div>
            <button className="btn btn-primary" onClick={() => setAddingItem(true)}>+ Adicionar prato</button>
          </div>

          {addingItem && (
            <div className="admin-edit-form">
              <h3 style={{ marginBottom: 16, fontSize: "1.1rem" }}>Novo prato</h3>
              <div className="admin-form-grid">
                <div className="form-field">
                  <label>Categoria</label>
                  <select value={newItem.cat} onChange={nf("cat")}>
                    <option value="">— escolher —</option>
                    {editingPreset.categories.filter(c => c.id !== "all").map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>Nome do prato</label>
                  <input type="text" value={newItem.name} onChange={nf("name")} placeholder="Ex: Risoto de Camarão" />
                </div>
                <div className="form-field" style={{ gridColumn: "1 / -1" }}>
                  <label>Descrição</label>
                  <textarea value={newItem.desc} onChange={nf("desc")} rows={2} placeholder="Ingredientes e preparo..." />
                </div>
                <div className="form-field">
                  <label>Preço (R$) — vazio = "Consultar"</label>
                  <input type="text" value={newItem.price} onChange={nf("price")} placeholder="Ex: 58" />
                </div>
                <div className="form-field">
                  <label>Tag (opcional)</label>
                  <input type="text" value={newItem.tag} onChange={nf("tag")} placeholder="Ex: Autoral, Casa, Sábados" />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <button className="btn btn-primary" onClick={addItem}>Adicionar</button>
                <button className="btn btn-ghost" onClick={() => setAddingItem(false)}>Cancelar</button>
              </div>
            </div>
          )}

          {editingPreset.items.length === 0 && !addingItem && (
            <p style={{ opacity: 0.45, fontStyle: "italic", padding: "32px 0" }}>Nenhum prato neste cardápio. Clique em "+ Adicionar prato" para começar.</p>
          )}

          <div className="admin-items-list">
            {editingPreset.items.map((it, idx) => (
              <div key={idx} className="admin-item-row">
                {editItem === idx ? (
                  <div className="admin-edit-form" style={{ width: "100%" }}>
                    <div className="admin-form-grid">
                      <div className="form-field">
                        <label>Categoria</label>
                        <select value={editForm.cat} onChange={ef("cat")}>
                          {editingPreset.categories.filter(c => c.id !== "all").map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-field">
                        <label>Nome</label>
                        <input type="text" value={editForm.name} onChange={ef("name")} />
                      </div>
                      <div className="form-field" style={{ gridColumn: "1 / -1" }}>
                        <label>Descrição</label>
                        <textarea value={editForm.desc} onChange={ef("desc")} rows={2} />
                      </div>
                      <div className="form-field">
                        <label>Preço (vazio = Consultar)</label>
                        <input type="text" value={editForm.price} onChange={ef("price")} />
                      </div>
                      <div className="form-field">
                        <label>Tag</label>
                        <input type="text" value={editForm.tag || ""} onChange={ef("tag")} />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                      <button className="btn btn-primary" onClick={saveEditItem}>Salvar</button>
                      <button className="btn btn-ghost" onClick={() => setEditItem(null)}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="admin-item-info">
                      <span className="menu-item-tag" style={{ marginBottom: 4, display: "inline-block" }}>
                        {(editingPreset.categories.find(c => c.id === it.cat) || {}).label || it.cat}
                      </span>
                      <strong style={{ display: "block", fontSize: "1.05rem" }}>{it.name}</strong>
                      <span style={{ opacity: 0.6, fontSize: "0.9rem" }}>{it.desc}</span>
                    </div>
                    <div className="admin-item-price">
                      {it.price ? `R$ ${it.price}` : <span className="price-tba">Consultar</span>}
                      {it.tag && <span className="menu-item-tag" style={{ marginLeft: 8 }}>{it.tag}</span>}
                    </div>
                    <div className="admin-item-actions">
                      <button className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: "0.85rem" }} onClick={() => startEditItem(idx)}>Editar</button>
                      <button className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: "0.85rem", opacity: 0.5 }} onClick={() => removeItem(idx)}>Remover</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ====== App shell ======
function App() {
  const [route, setRoute] = useState(() => {
    const h = (window.location.hash || "").replace("#", "");
    return ["home","sobre","cardapio","reservas","admin"].includes(h) ? h : "home";
  });

  const go = (r) => {
    setRoute(r);
    window.location.hash = r;
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  useEffect(() => {
    const onHash = () => {
      const h = (window.location.hash || "").replace("#", "");
      if (["home","sobre","cardapio","reservas","admin"].includes(h)) setRoute(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <>
      {route !== "admin" && <Nav route={route} go={go} onCta={() => go("reservas")} />}
      {route === "home" && <Landing go={go} />}
      {route === "sobre" && <Sobre go={go} />}
      {route === "cardapio" && <Cardapio go={go} />}
      {route === "reservas" && <Reservas go={go} />}
      {route === "admin" && <Admin />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
