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

// ====== Fundo da hero — carrossel com crossfade suave ======
const HERO_BG_IMAGES = [
  "assets/Parte de fundo do site do carmelita.png",
  "assets/feijoada da fe.jpeg",
  "assets/panela mar e terra camarao salteados fritas com parmesao e mignon com chimichurri foto 1.jpg",
  "assets/risole de camarao com molho tartaro.jpeg",
];

function HeroBg() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // não fica trocando imagem sozinho para quem pediu menos movimento
    const t = setInterval(() => setIndex((i) => (i + 1) % HERO_BG_IMAGES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="hero-bg">
      {HERO_BG_IMAGES.map((src, i) => (
        <div key={src}
             className={"hero-bg-slide" + (i === index ? " active" : "")}
             style={{ backgroundImage: `url("${encodeURI(src)}")` }} />
      ))}
      <div className="hero-bg-tint"></div>
    </div>
  );
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
  const [overHero, setOverHero] = useState(route === "home");
  const [mobile, setMobile] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const hero = document.querySelector(".hero");
      setOverHero(hero ? hero.getBoundingClientRect().bottom > 120 : false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [route]);

  // Fecha o menu ao trocar de página
  useEffect(() => { setMobile(false); }, [route]);

  // Fecha ao clicar fora ou apertar Esc — sem precisar de um fundo escurecendo a tela
  useEffect(() => {
    if (!mobile) return;
    const onClick = (e) => {
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      if (burgerRef.current && burgerRef.current.contains(e.target)) return;
      setMobile(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setMobile(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [mobile]);

  const links = [
    { id: "home", label: "Início" },
    { id: "sobre", label: "Sobre" },
    { id: "cardapio", label: "Cardápio" },
    { id: "reservas", label: "Reservas" },
  ];

  return (
    <>
      <nav className={"nav" + (scrolled ? " scrolled" : "")}>
        <div className={"nav-brand" + (overHero ? " discreet" : "")} onClick={() => go("home")}>
          <span className="nav-brand-text">Carmelita</span>
          <span className="nav-brand-resto">Restô</span>
        </div>
        <div className="nav-menu">
          <div className="nav-links">
            {links.map((l) => (
              <a key={l.id}
                 className={"nav-link" + (route === l.id ? " active" : "")}
                 onClick={(e) => { e.preventDefault(); go(l.id); }}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="nav-right">
            <a className="nav-phone" href="tel:+5527997475391">(27) 99747-5391</a>
            <button className="nav-cta" onClick={onCta}>Reservas</button>
          </div>
        </div>
        <button className={"nav-burger" + (mobile ? " open" : "")}
                ref={burgerRef}
                onClick={() => setMobile((m) => !m)}
                aria-label="Menu" aria-expanded={mobile}>
          <span></span><span></span><span></span>
        </button>
        <div className={"mobile-menu-backdrop" + (mobile ? " open" : "")} aria-hidden="true"></div>
        <div className={"mobile-menu" + (mobile ? " open" : "")} ref={menuRef}>
          <div className="mobile-menu-brand">
            <span className="nav-brand-text">Carmelita</span>
            <span className="nav-brand-resto">Restô</span>
          </div>
          {links.map((l) => (
            <a key={l.id}
               className={"mobile-menu-link" + (route === l.id ? " active" : "")}
               onClick={(e) => { e.preventDefault(); go(l.id); setMobile(false); }}>
              {l.label}
            </a>
          ))}
          <div className="mobile-menu-divider"></div>
          <a className="mobile-menu-phone" href="tel:+5527997475391">(27) 99747-5391</a>
          <div className="mobile-menu-hours">
            Qui & Sex · 19h–23h<br />Sáb & Dom · 12h–16h
          </div>
        </div>
      </nav>
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
            <p>Qui e Sex · 19h às 23h</p>
            <p>Sáb e Dom · 12h às 16h</p>
            <p>Seg a Qua · Fechado</p>
          </div>
          <div className="footer-col">
            <h4>Contato</h4>
            <a href="tel:+5527997475391">(27) 99747-5391 · Reservas por ligação</a>
            <a href="https://instagram.com/carmelita_restaurante" target="_blank" rel="noopener">@carmelita_restaurante</a>
            <a href="https://facebook.com/carmelitaresto01" target="_blank" rel="noopener">Facebook · carmelitaresto01</a>
            <a href="https://www.tripadvisor.com/Restaurant_Review-g303319-d8228154" target="_blank" rel="noopener">TripAdvisor · 4,8 ★</a>
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
        <HeroBg />
        <div className="hero-content">
          <div className="hero-eyebrow reveal">Restaurante & Bistrô · Praia da Costa, Vila Velha</div>

          <div className="hero-logo-group">
            <InlineLogo />
            <div className="hero-text-stack">
              <h1 className="hero-wordmark reveal d2">Carmelita</h1>
              <p className="hero-resto reveal d3">RESTÔ</p>
            </div>
          </div>
          <p className="hero-tagline reveal d4">
            Cozinha autoral.
          </p>
          <p className="hero-verse reveal d5">
            A gente não quer só comida, a gente quer bebida, diversão, balé<br/>
            A gente não quer só comida, a gente quer a vida como a vida quer.
            <span className="hero-verse-author">Titãs</span>
          </p>
          <div className="hero-ctas reveal d6">
            <button className="btn btn-primary" onClick={() => go("reservas")}>Reservar mesa</button>
            <button className="btn btn-ghost" onClick={() => go("cardapio")}>Ver cardápio</button>
          </div>
        </div>

        <div className="hero-meta">
          <span className="hero-meta-item"><span className="dot"></span>Qui a Dom · Reservas por ligação</span>
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
              <img className="mood-photo" src="assets/Parte de fundo do site do carmelita.png"
                   alt="Salão do Carmelita — mesas de madeira e quadros de músicos na parede" loading="lazy" />
              <span className="mood-label">Salão</span>
            </div>
            <div className="mood-tile t2 reveal d2">
              <img className="mood-photo" src={encodeURI("assets/panela mar e terra camarao salteados fritas com parmesao e mignon com chimichurri foto 1.jpg")}
                   alt="Panela Mar e Terra — camarões salteados, fritas com parmesão e mignon ao chimichurri" loading="lazy" />
              <span className="mood-label">Prato</span>
            </div>
            <div className="mood-tile t3 reveal d3">
              <Placeholder kind="stripes" label="03 · Decoração" note="referência · quadros" />
              <span className="mood-label">Arte</span>
            </div>
            <div className="mood-tile t4 reveal d2">
              <img className="mood-photo" src={encodeURI("assets/feijoada da fe.jpeg")}
                   alt="Feijoada da Fê — feita por Fernanda Bezzi, servida aos sábados e domingos" loading="lazy" />
              <span className="mood-label">Fim de semana</span>
            </div>
            <div className="mood-tile t5 reveal d3">
              <Placeholder kind="warm" label="05 · Coxinha de rabada" note="autoral · banana da terra" />
              <span className="mood-label">Petisco</span>
            </div>
            <div className="mood-tile t6 reveal d4">
              <img className="mood-photo" src={encodeURI("assets/risole de camarao com molho tartaro.jpeg")}
                   alt="Rissole de camarão com molho tártaro" loading="lazy" />
              <span className="mood-label">Entrada</span>
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
            Em dias de casa fechada, abrimos para confrarias e eventos gastronômicos. A Confraria Vinha Velha já fez história aqui. Agende o seu grupo e venha criar a sua.
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
    { num: "4,8", label: "no TripAdvisor", sub: "19 avaliações · #62 de 700 restaurantes em Vila Velha" },
    { num: "4,6", label: "no Google", sub: "32 avaliações" },
    { num: "5,0", label: "no Facebook", sub: "25 avaliações · nota máxima" },
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
              <img className="chef-photo-img" src="assets/Parte de fundo do site do carmelita.png"
                   alt="Salão do Carmelita — quadros de músicos na parede e mesas postas" loading="lazy" />
              <div className="chef-photo-caption">
                O salão
                <span className="small">quadros de músicos · mesas postas</span>
              </div>
            </div>
            <div className="sobre-prose reveal d1">
              <p>
                A Fernanda e o Gastão não abriram apenas um restaurante — abriram uma extensão da própria casa. Ela acolhe no salão com calor humano e simpatia que os clientes não esquecem. Ele cria na cozinha com liberdade e técnica, assinando pratos que surpreendem a cada visita.
              </p>
              <p>
                A proposta do Carmelita é encantar com novidades e preços justos. Mistura de restaurante com bistrô, a casa une culinária elaborada a um ambiente intimista: quadros de grandes músicos na parede, luz certa, boa música e uma conversa fácil.
              </p>
              <p>
                Nos fins de semana, o almoço tem assinatura própria: a Feijoada da Fê, feita pela própria Fernanda Bezzi, com arroz, torresmo, couve, farofinha e laranja. Os clientes percebem — e valorizam — o fato de os donos estarem sempre presentes e atentos. Isso não é detalhe: é o coração do Carmelita.
              </p>
              <div className="signature">— Fernanda Bezzi & Cheff Gastão, proprietários</div>
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

// ====== Supabase (login do admin + cardápio compartilhado) ======
const SUPABASE_URL = "https://cjxhpbqurgephxyemjlv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqeGhwYnF1cmdlcGh4eWVtamx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NzM4NTQsImV4cCI6MjEwNTI0OTg1NH0.xKwGHWfI3KiverKvn0JK1XTvnpzRKg0DSTrnyB6qXIw";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ====== Dados dos cardápios (tabela site_menus no Supabase > menu.json > bloco inline) ======
function normalizeMenus(d) {
  return d && Array.isArray(d.menus) ? d : null;
}

// Leitura instantânea (offline-safe) usada só como 1º paint, antes do Supabase responder.
function loadMenusData() {
  try {
    const d = normalizeMenus(JSON.parse(document.getElementById("menu-data").textContent));
    if (d) return d;
  } catch {}
  return { menus: [] };
}

function fetchPublishedMenus() {
  return supabase.from("site_menus").select("data").eq("id", "principal").single()
    .then(({ data: row, error }) => {
      if (error || !row) throw error || new Error("sem dados");
      const n = normalizeMenus(row.data);
      if (!n) throw new Error("formato inválido");
      return n;
    });
}

// ====== Cardápio ======
function MenuPrice({ price }) {
  return price
    ? <span className="menu-row-price"><span className="currency">R$ </span>{price}</span>
    : <span className="menu-row-price price-tba">Consultar</span>;
}

function Cardapio({ go }) {
  useReveal();
  const [data, setData] = useState(loadMenusData);

  // Supabase é a fonte publicada e compartilhada; menu.json entra só se o banco estiver fora do ar.
  useEffect(() => {
    let cancelled = false;
    fetchPublishedMenus()
      .catch(() => fetch("menu.json").then((r) => (r.ok ? r.json() : null)).then(normalizeMenus))
      .then((n) => { if (n && !cancelled) setData(n); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const menus = data.menus.filter((m) => m.public !== false);
  const [menuId, setMenuId] = useState(null);
  const menu = menus.find((m) => m.id === menuId) || menus[0] || { categories: [], items: [] };

  const sections = useMemo(() => {
    const cats = menu.categories.filter((c) => c.id !== "all");
    const known = new Set(cats.map((c) => c.id));
    const list = cats
      .map((c) => ({ ...c, items: menu.items.filter((i) => i.cat === c.id) }))
      .filter((c) => c.items.length > 0);
    const orphans = menu.items.filter((i) => !known.has(i.cat));
    if (orphans.length) list.push({ id: "_outros", label: "Outros pratos", items: orphans });
    return list;
  }, [menu]);

  // ── Índice de categorias: pula pra seção e marca a ativa ao rolar ──
  const [activeCat, setActiveCat] = useState(null);
  const sectionRefs = useRef({});

  useEffect(() => { setActiveCat(sections[0]?.id || null); }, [menu.id]);

  useEffect(() => {
    const els = Object.values(sectionRefs.current).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveCat(e.target.dataset.catId);
        });
      },
      { rootMargin: "-160px 0px -65% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  const jumpToCat = (catId) => {
    const el = sectionRefs.current[catId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Detecta o instante em que o índice gruda no topo, pra animar a chegada ──
  const [catnavStuck, setCatnavStuck] = useState(false);
  const catnavSentinelRef = useRef(null);

  useEffect(() => {
    const el = catnavSentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setCatnavStuck(!entry.isIntersecting),
      { rootMargin: "-65px 0px 0px 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [sections]);

  // ── Lightbox: expande a foto do prato ao clicar ──
  const [lightbox, setLightbox] = useState(null); // { src, alt } | null

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => { if (e.key === "Escape") setLightbox(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <div className="page page-enter">
      <section className="menu-hero">
        <div className="container">
          <span className="block-eyebrow reveal"><span className="num">C /</span>Cardápio da casa</span>
          <h1 className="block-title reveal d1">Cozinha autoral do <em>Cheff Gastão.</em></h1>
          <p className="block-sub reveal d2">
            Cardápio enxuto e criterioso — produto sazonal, mão segura. Preços sob consulta na casa.
          </p>
        </div>
      </section>

      <section className="container menu-editorial">
        {menus.length > 1 && (
          <div className="menu-switch reveal">
            {menus.map((m) => (
              <button key={m.id}
                      className={"menu-tab" + (m.id === menu.id ? " active" : "")}
                      onClick={() => setMenuId(m.id)}>
                <span className="menu-tab-name">{m.name}</span>
                {m.subtitle ? <span className="menu-tab-sub">{m.subtitle}</span> : null}
              </button>
            ))}
          </div>
        )}

        {menus.length === 1 && menu.subtitle && (
          <div className="menu-single-sub reveal">{menu.subtitle}</div>
        )}

        {sections.length > 1 && (
          <>
            <div ref={catnavSentinelRef} className="menu-catnav-sentinel" aria-hidden="true"></div>
            <div className={"menu-catnav-wrap" + (catnavStuck ? " is-stuck" : "")}>
              <nav className="menu-catnav" aria-label="Categorias do cardápio">
                {sections.map((sec) => (
                  <button key={sec.id}
                          className={"menu-catnav-btn" + (activeCat === sec.id ? " active" : "")}
                          onClick={() => jumpToCat(sec.id)}>
                    {sec.label}
                  </button>
                ))}
              </nav>
            </div>
          </>
        )}

        {sections.map((sec, si) => (
          <div className={`menu-section reveal d${(si % 3) + 1}`} key={menu.id + sec.id}
               data-cat-id={sec.id}
               ref={(el) => { sectionRefs.current[sec.id] = el; }}>
            <div className="menu-section-head">
              <h2 className="menu-section-title">{sec.label}</h2>
              <span className="menu-section-rule"></span>
            </div>
            <div className="menu-list">
              {sec.items.map((it) => (
                <div className={"menu-row" + (it.img ? " has-photo" : "")} key={it.name}>
                  {it.img && (
                    <button className="menu-row-thumb" aria-label={`Ampliar foto de ${it.name}`}
                            onClick={() => setLightbox({ src: encodeURI(`assets/${it.img}`), alt: it.name })}>
                      <img src={encodeURI(`assets/${it.img}`)} alt={it.name} loading="lazy" />
                    </button>
                  )}
                  <div className="menu-row-body">
                    <div className="menu-row-top">
                      <h3 className="menu-row-name">{it.name}</h3>
                      {it.tag ? <span className="menu-item-tag">{it.tag}</span> : null}
                      <span className="menu-row-leader"></span>
                      <MenuPrice price={it.price} />
                    </div>
                    {it.desc ? <p className="menu-row-desc">{it.desc}</p> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <p className="block-sub reveal" style={{ margin: "40px auto", textAlign: "center" }}>
            Cardápio em atualização — ligue para a casa: (27) 99747-5391.
          </p>
        )}

        <div style={{ padding: "60px 0 90px", textAlign: "center" }}>
          <p className="block-sub reveal" style={{ margin: "0 auto 32px" }}>
            Trabalhamos com produto sazonal — o cardápio muda conforme o mercado. Reservas somente por ligação.
          </p>
          <div className="reveal d1">
            <button className="btn btn-primary" onClick={() => go("reservas")}>Reservar por telefone</button>
          </div>
        </div>
      </section>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" aria-label="Fechar" onClick={() => setLightbox(null)}>×</button>
          <img className="lightbox-img" src={lightbox.src} alt={lightbox.alt}
               onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <Footer go={go} />
    </div>
  );
}

// ====== Reservas ======
function Reservas({ go }) {
  useReveal();
  return (
    <div className="page page-enter">
      <section className="reservas-wrap">
        <div className="container">
          <div className="reservas-grid">
            <div className="reservas-side">
              <span className="block-eyebrow reveal"><span className="num">D /</span>Sua mesa</span>
              <h2 className="reveal d1">Uma mesa<br/><em>à luz baixa.</em></h2>
              <p className="reveal d2">
                O Carmelita é uma casa pequena e acolhedora — e a agenda é curta. Reservas são feitas somente por ligação: a Fernanda atende, confere a agenda e confirma sua mesa na hora.
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
                  <div className="ri-label">Reservas</div>
                  <div className="ri-value"><a href="tel:+5527997475391">(27) 99747-5391</a><span className="small">somente por ligação</span></div>
                </div>
                <div>
                  <div className="ri-label">Horários</div>
                  <div className="ri-value">Qui e Sex · 19h às 23h<span className="small">Sáb e Dom · 12h às 16h</span></div>
                </div>
                <div>
                  <div className="ri-label">Fechado</div>
                  <div className="ri-value">Seg a Qua<span className="small">casa aberta para eventos e confrarias sob agendamento</span></div>
                </div>
              </div>
            </div>

            <div className="reveal d2">
              <div className="form-card call-card">
                <div className="form-eyebrow">Reservas · Somente por ligação</div>
                <div className="form-title">Ligue e garanta<br/>sua mesa.</div>
                <p className="call-text">
                  Sem formulário, sem espera. A reserva do Carmelita é feita por telefone, direto com a casa — do nosso jeito, com conversa.
                </p>
                <a className="form-submit call-btn" href="tel:+5527997475391">
                  Ligar · (27) 99747-5391
                </a>
                <div className="call-hours">
                  <span>Qui e Sex · 19h às 23h</span>
                  <span>Sáb e Dom · 12h às 16h</span>
                </div>
                <p className="call-alt">
                  Grupos, confrarias e eventos:{" "}
                  <a href="https://wa.me/5527997475391" target="_blank" rel="noopener">WhatsApp da casa</a>
                </p>
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
function slugify(s) {
  return s.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || ("c_" + Date.now());
}

function Admin() {
  const [session, setSession] = useState(undefined); // undefined = verificando · null = deslogado
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [authErr, setAuthErr] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  const [data, setData]       = useState(null); // null enquanto carrega do Supabase
  const [loadError, setLoadError] = useState(false);
  const skipNextSave = useRef(true); // evita regravar no banco logo após o carregamento inicial

  const [selId, setSelId] = useState(null);
  const [view, setView]   = useState("list"); // "list" = escolher cardápio · "edit" = editar cardápio
  const sel = data ? data.menus.find(m => m.id === selId) || null : null;

  const [editItem, setEditItem]     = useState(null);
  const [editForm, setEditForm]     = useState({});
  const [addingCat, setAddingCat]   = useState(null); // id da categoria onde está adicionando prato
  const [newItem, setNewItem]       = useState({ name: "", desc: "", price: "", tag: "" });
  const [newCat, setNewCat]         = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const importRef = useRef(null);

  // ── Sessão (login) ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // ── Carregar o cardápio publicado assim que loga ──
  useEffect(() => {
    if (!session) { setData(null); return; }
    setLoadError(false);
    skipNextSave.current = true;
    fetchPublishedMenus()
      .then((n) => setData(n))
      .catch(() => setLoadError(true));
  }, [session]);

  // Auto-save com debounce — grava direto na tabela do Supabase (visível pra todo mundo)
  useEffect(() => {
    if (!session || !data) return;
    if (skipNextSave.current) { skipNextSave.current = false; return; }
    setSaveStatus("saving");
    const t = setTimeout(() => {
      supabase.from("site_menus").upsert({ id: "principal", data }).then(({ error }) => {
        setSaveStatus(error ? "error" : "saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      });
    }, 700);
    return () => clearTimeout(t);
  }, [data, session]);

  const login = async (e) => {
    e.preventDefault();
    setAuthErr("");
    setAuthBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    setAuthBusy(false);
    if (error) setAuthErr("E-mail ou senha incorretos.");
  };

  const logout = () => supabase.auth.signOut();

  const openMenu = (id) => {
    setSelId(id);
    setView("edit");
    setEditItem(null);
    setAddingCat(null);
  };

  const backToList = () => {
    setView("list");
    setEditItem(null);
    setAddingCat(null);
  };

  // ── Operações de cardápio ──
  const updateSel = (patch) =>
    setData(d => ({ menus: d.menus.map(m => m.id === sel.id ? { ...m, ...patch } : m) }));

  const addMenu = () => {
    const nid = "m_" + Date.now();
    setData(d => ({ menus: [...d.menus, {
      id: nid, name: "Novo cardápio", subtitle: "", public: false,
      categories: [{ id: "pratos", label: "Pratos" }], items: [],
    }] }));
    openMenu(nid);
  };

  const duplicateMenu = () => {
    const nid = "m_" + Date.now();
    setData(d => ({ menus: [...d.menus, { ...sel, id: nid, name: sel.name + " (cópia)", public: false }] }));
    openMenu(nid);
  };

  const deleteMenu = () => {
    if (data.menus.length <= 1) { alert("Este é o único cardápio — não dá para apagá-lo."); return; }
    if (!confirm(`Apagar o cardápio "${sel.name}"?\n\nEssa ação não pode ser desfeita.`)) return;
    const remaining = data.menus.filter(m => m.id !== sel.id);
    setData({ menus: remaining });
    backToList();
  };

  // ── Categorias ──
  const addCategory = () => {
    const label = newCat.trim();
    if (!label) return;
    const id = slugify(label);
    if (sel.categories.some(c => c.id === id)) { setNewCat(""); return; }
    updateSel({ categories: [...sel.categories, { id, label }] });
    setNewCat("");
  };

  const removeCategory = (id) => {
    const hasItems = sel.items.some(it => it.cat === id);
    if (hasItems && !confirm("Ainda existem pratos nesta seção. Eles vão aparecer em \"Outros pratos\" até você movê-los.\n\nApagar a seção mesmo assim?")) return;
    updateSel({ categories: sel.categories.filter(c => c.id !== id) });
  };

  // ── Pratos ──
  const removeItem = (idx) => {
    const it = sel.items[idx];
    if (!confirm(`Remover o prato "${it.name}" deste cardápio?`)) return;
    updateSel({ items: sel.items.filter((_, i) => i !== idx) });
  };

  const startEditItem = (idx) => {
    setEditItem(idx);
    setEditForm({ ...sel.items[idx] });
    setAddingCat(null);
  };

  const saveEditItem = () => {
    if (!(editForm.name || "").trim()) { alert("O prato precisa de um nome."); return; }
    updateSel({ items: sel.items.map((it, i) => i === editItem ? { ...editForm } : it) });
    setEditItem(null);
  };

  const startAddItem = (catId) => {
    setAddingCat(catId);
    setNewItem({ name: "", desc: "", price: "", tag: "" });
    setEditItem(null);
  };

  const saveNewItem = () => {
    if (!newItem.name.trim()) { alert("Escreva pelo menos o nome do prato."); return; }
    updateSel({ items: [...sel.items, { cat: addingCat, ...newItem }] });
    setNewItem({ name: "", desc: "", price: "", tag: "" });
    setAddingCat(null);
  };

  // ── Exportar / Importar / Restaurar ──
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2) + "\n"], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "menu.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const d = normalizeMenus(JSON.parse(reader.result));
        if (!d) throw new Error();
        setData(d);
        backToList();
        alert("Arquivo carregado com sucesso!");
      } catch { alert("Este arquivo não parece ser um cardápio válido.\nUse um arquivo baixado pelo botão \"Baixar arquivo do cardápio\"."); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const reloadFromServer = () => {
    if (!confirm("Recarregar o cardápio do banco? Mudanças feitas nos últimos segundos (ainda não salvas) serão perdidas.")) return;
    skipNextSave.current = true;
    fetchPublishedMenus().then(setData).catch(() => alert("Não foi possível recarregar agora — verifique sua internet."));
    backToList();
  };

  const ef = (k) => (e) => setEditForm(f => ({ ...f, [k]: e.target.value }));
  const nf = (k) => (e) => setNewItem(f => ({ ...f, [k]: e.target.value }));

  // Pratos agrupados por categoria (mantendo o índice original de cada prato)
  const grouped = sel ? (() => {
    const withIdx = sel.items.map((it, idx) => ({ it, idx }));
    const cats = sel.categories.filter(c => c.id !== "all");
    const known = new Set(cats.map(c => c.id));
    const groups = cats.map(c => ({ cat: c, entries: withIdx.filter(x => x.it.cat === c.id) }));
    const orphans = withIdx.filter(x => !known.has(x.it.cat));
    if (orphans.length) groups.push({ cat: { id: "_outros", label: "Outros pratos" }, entries: orphans });
    return groups;
  })() : [];

  if (session === undefined) {
    return (
      <div className="page page-enter admin-page" style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <p style={{ opacity: 0.6 }}>Carregando…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="page page-enter admin-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ width: "100%", maxWidth: 360, padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="footer-brand" style={{ marginBottom: 12 }}>CARMELITA</div>
            <p style={{ opacity: 0.6, fontSize: "0.95rem" }}>Área restrita · Gestão do cardápio</p>
          </div>
          <form onSubmit={login} className="admin-form">
            <div className="form-field" style={{ marginBottom: 16 }}>
              <label htmlFor="admin-email">E-mail</label>
              <input id="admin-email" type="email" value={email} autoComplete="username"
                     onChange={(e) => setEmail(e.target.value)} placeholder="seuemail@exemplo.com" autoFocus />
            </div>
            <div className="form-field" style={{ marginBottom: 16 }}>
              <label htmlFor="admin-pass">Senha</label>
              <input id="admin-pass" type="password" value={pass} autoComplete="current-password"
                     onChange={(e) => setPass(e.target.value)} placeholder="••••••••" />
            </div>
            {authErr && <p style={{ color: "#c0392b", fontSize: "0.9rem", marginBottom: 12 }}>{authErr}</p>}
            <button type="submit" className="form-submit" style={{ width: "100%" }} disabled={authBusy}>
              {authBusy ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="page page-enter admin-page container" style={{ textAlign: "center", paddingTop: 160 }}>
        <p style={{ marginBottom: 20 }}>Não foi possível carregar o cardápio do banco agora. Verifique sua internet e tente de novo.</p>
        <button className="adm-btn adm-btn-line" onClick={logout}>Sair</button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page page-enter admin-page" style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <p style={{ opacity: 0.6 }}>Carregando cardápio…</p>
      </div>
    );
  }

  // ─────────────── TELA 1 · Meus cardápios ───────────────
  if (view === "list" || !sel) {
    return (
      <div className="page page-enter">
        <div className="admin-page container">

          <div className="adm-head">
            <div>
              <div className="block-eyebrow" style={{ marginBottom: 8 }}>Área da casa</div>
              <h1 className="block-title" style={{ margin: 0 }}>Meus <em>cardápios</em>.</h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span className="adm-status">
                {saveStatus === "saving" ? "Guardando…" : saveStatus === "error" ? "⚠ Erro ao publicar" : "✓ Publicado no site"}
              </span>
              <button className="adm-btn adm-btn-line" onClick={logout}>Sair</button>
            </div>
          </div>

          <div className="adm-help">
            <strong>Como funciona:</strong> toque em <em>Editar</em> no cardápio que você quer mexer.
            Tudo o que mudar aparece <em>sozinho, em segundos</em>, para qualquer visitante do site.
          </div>

          <div className="adm-grid">
            {data.menus.map(m => (
              <div key={m.id} className="adm-card">
                <span className={"adm-badge" + (m.public !== false ? " on" : " off")}>
                  {m.public !== false ? "● Aparece no site" : "○ Escondido do site"}
                </span>
                <div className="adm-card-name">{m.name}</div>
                {m.subtitle ? <div className="adm-card-sub">{m.subtitle}</div> : null}
                <div className="adm-card-count">{m.items.length} {m.items.length === 1 ? "prato" : "pratos"}</div>
                <button className="adm-btn adm-btn-gold" onClick={() => openMenu(m.id)}>✏️ Editar este cardápio</button>
              </div>
            ))}
            <button className="adm-card adm-card-new" onClick={addMenu}>
              <span className="adm-card-new-plus">+</span>
              <span>Criar novo cardápio</span>
            </button>
          </div>

          <div className="adm-publish">
            <div className="adm-publish-title">🌐 Já está no ar</div>
            <p>
              Suas edições são publicadas <strong>automaticamente</strong>, para todo mundo,
              assim que você para de digitar. Não precisa baixar nem enviar nada pra ninguém.
            </p>
            <button className="adm-btn adm-btn-gold" onClick={exportJson}>⬇️ Baixar cópia de segurança</button>

            <details className="adm-advanced">
              <summary>Opções avançadas</summary>
              <div className="adm-advanced-row">
                <button className="adm-btn adm-btn-line" onClick={() => importRef.current && importRef.current.click()}>
                  Restaurar de um arquivo de cardápio
                </button>
                <button className="adm-btn adm-btn-line adm-btn-danger" onClick={reloadFromServer}>
                  Recarregar o cardápio do banco
                </button>
              </div>
              <input ref={importRef} type="file" accept="application/json,.json" style={{ display: "none" }} onChange={importJson} />
            </details>
          </div>

          <div style={{ marginTop: 28 }}>
            <a className="adm-btn adm-btn-line" href="#home">← Voltar para o site</a>
          </div>

        </div>
      </div>
    );
  }

  // ─────────────── TELA 2 · Editando um cardápio ───────────────
  return (
    <div className="page page-enter">
      <div className="admin-page container">

        <div className="adm-head">
          <button className="adm-back" onClick={backToList}>← Voltar aos cardápios</button>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span className="adm-status">
              {saveStatus === "saving" ? "Guardando…" : saveStatus === "error" ? "⚠ Erro ao publicar" : "✓ Publicado no site"}
            </span>
            <button className="adm-btn adm-btn-line" onClick={logout}>Sair</button>
          </div>
        </div>

        <h1 className="block-title" style={{ margin: "0 0 6px" }}>{sel.name}</h1>
        <p className="adm-help" style={{ marginBottom: 34 }}>
          Tudo o que você mudar aqui é publicado sozinho, pra todo mundo — não precisa apertar nenhum botão de salvar.
        </p>

        {/* ── Passo 1: informações ── */}
        <div className="adm-box">
          <div className="adm-box-title">1 · Informações do cardápio</div>
          <div className="admin-form-grid">
            <div className="form-field">
              <label>Nome do cardápio</label>
              <input type="text" value={sel.name} onChange={e => updateSel({ name: e.target.value })} />
              <span className="adm-hint">Ex.: Jantar · Almoço de Fim de Semana</span>
            </div>
            <div className="form-field">
              <label>Dias e horário</label>
              <input type="text" value={sel.subtitle || ""} placeholder="Ex.: Sábado & Domingo · 12h às 16h"
                     onChange={e => updateSel({ subtitle: e.target.value })} />
              <span className="adm-hint">Aparece embaixo do nome, no site</span>
            </div>
          </div>

          <label className="adm-switch-row">
            <span className="adm-switch">
              <input type="checkbox" checked={sel.public !== false}
                     onChange={e => updateSel({ public: e.target.checked })} />
              <span className="adm-switch-slider"></span>
            </span>
            <span className="adm-switch-label">
              {sel.public !== false
                ? <>Este cardápio <strong className="on">está aparecendo</strong> no site</>
                : <>Este cardápio <strong className="off">está escondido</strong> do site</>}
            </span>
          </label>
        </div>

        {/* ── Passo 2: pratos, agrupados por seção ── */}
        <div className="adm-box">
          <div className="adm-box-title">2 · Pratos</div>

          {grouped.map(g => (
            <div key={g.cat.id} className="adm-cat">
              <div className="adm-cat-head">
                <h3 className="adm-cat-title">{g.cat.label}</h3>
                {g.cat.id !== "_outros" && (
                  <button className="adm-x" title="Apagar esta seção" onClick={() => removeCategory(g.cat.id)}>×</button>
                )}
              </div>

              {g.entries.length === 0 && addingCat !== g.cat.id && (
                <p className="adm-empty">Nenhum prato aqui ainda.</p>
              )}

              {g.entries.map(({ it, idx }) => (
                editItem === idx ? (
                  <div key={idx} className="adm-dish-form">
                    <div className="adm-dish-form-title">Editando "{it.name}"</div>
                    <div className="admin-form-grid">
                      <div className="form-field">
                        <label>Nome do prato</label>
                        <input type="text" value={editForm.name} onChange={ef("name")} />
                      </div>
                      <div className="form-field">
                        <label>Preço (só o número)</label>
                        <input type="text" value={editForm.price} onChange={ef("price")} placeholder="Deixe vazio para mostrar Consultar" />
                      </div>
                      <div className="form-field" style={{ gridColumn: "1 / -1" }}>
                        <label>Descrição (opcional)</label>
                        <textarea value={editForm.desc} onChange={ef("desc")} rows={2} />
                      </div>
                      <div className="form-field">
                        <label>Etiqueta (opcional)</label>
                        <input type="text" value={editForm.tag || ""} onChange={ef("tag")} placeholder="Ex.: Autoral, Sáb & Dom" />
                      </div>
                      <div className="form-field">
                        <label>Seção onde aparece</label>
                        <select value={editForm.cat} onChange={ef("cat")}>
                          {sel.categories.filter(c => c.id !== "all").map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="adm-form-btns">
                      <button className="adm-btn adm-btn-gold" onClick={saveEditItem}>✓ Salvar prato</button>
                      <button className="adm-btn adm-btn-line" onClick={() => setEditItem(null)}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div key={idx} className="adm-dish">
                    <div className="adm-dish-info">
                      <div className="adm-dish-name">
                        {it.name}
                        {it.tag ? <span className="menu-item-tag" style={{ marginLeft: 10 }}>{it.tag}</span> : null}
                      </div>
                      {it.desc ? <div className="adm-dish-desc">{it.desc}</div> : null}
                    </div>
                    <div className="adm-dish-price">{it.price ? `R$ ${it.price}` : "Consultar"}</div>
                    <div className="adm-dish-actions">
                      <button className="adm-btn adm-btn-line" onClick={() => startEditItem(idx)}>Editar</button>
                      <button className="adm-btn adm-btn-line adm-btn-danger" onClick={() => removeItem(idx)}>Remover</button>
                    </div>
                  </div>
                )
              ))}

              {addingCat === g.cat.id ? (
                <div className="adm-dish-form">
                  <div className="adm-dish-form-title">Novo prato em "{g.cat.label}"</div>
                  <div className="admin-form-grid">
                    <div className="form-field">
                      <label>Nome do prato</label>
                      <input type="text" value={newItem.name} onChange={nf("name")} placeholder="Ex.: Risoto de Camarão" autoFocus />
                    </div>
                    <div className="form-field">
                      <label>Preço (só o número)</label>
                      <input type="text" value={newItem.price} onChange={nf("price")} placeholder="Deixe vazio para mostrar Consultar" />
                    </div>
                    <div className="form-field" style={{ gridColumn: "1 / -1" }}>
                      <label>Descrição (opcional)</label>
                      <textarea value={newItem.desc} onChange={nf("desc")} rows={2} placeholder="Ingredientes, acompanhamentos…" />
                    </div>
                    <div className="form-field">
                      <label>Etiqueta (opcional)</label>
                      <input type="text" value={newItem.tag} onChange={nf("tag")} placeholder="Ex.: Autoral, Sáb & Dom" />
                    </div>
                  </div>
                  <div className="adm-form-btns">
                    <button className="adm-btn adm-btn-gold" onClick={saveNewItem}>✓ Adicionar prato</button>
                    <button className="adm-btn adm-btn-line" onClick={() => setAddingCat(null)}>Cancelar</button>
                  </div>
                </div>
              ) : (
                g.cat.id !== "_outros" && (
                  <button className="adm-add-dish" onClick={() => startAddItem(g.cat.id)}>
                    + Adicionar prato em "{g.cat.label}"
                  </button>
                )
              )}
            </div>
          ))}

          <div className="adm-new-cat">
            <input type="text" value={newCat} placeholder="Nome da nova seção (ex.: Bebidas)"
                   onChange={e => setNewCat(e.target.value)}
                   onKeyDown={e => { if (e.key === "Enter") addCategory(); }} />
            <button className="adm-btn adm-btn-line" onClick={addCategory}>+ Criar seção</button>
          </div>
        </div>

        {/* ── Mais opções ── */}
        <details className="adm-advanced">
          <summary>Mais opções deste cardápio</summary>
          <div className="adm-advanced-row">
            <button className="adm-btn adm-btn-line" onClick={duplicateMenu}>Fazer uma cópia deste cardápio</button>
            <button className="adm-btn adm-btn-line adm-btn-danger" onClick={deleteMenu}>Apagar este cardápio</button>
          </div>
        </details>

        <div style={{ marginTop: 32 }}>
          <button className="adm-btn adm-btn-gold" onClick={backToList}>✓ Terminei — voltar aos cardápios</button>
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
