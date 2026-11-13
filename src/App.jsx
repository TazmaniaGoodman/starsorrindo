import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, ClipboardList, HeartHandshake,
  MapPin, Maximize2, Menu, MessageCircle, Navigation, Phone, Plus, ScanLine, X,
} from 'lucide-react';
import BookingDialog from './BookingDialog.jsx';
import ImplantArt from './ImplantArt.jsx';
import { clinic, faq, maps, photos, reviews, services } from './clinic.js';
import { useDialog } from './useDialog.js';

const nav = [
  ['inicio', 'Início'], ['sobre', 'Sobre nós'], ['implantes', 'Implantes'],
  ['clinica', 'Nossa clínica'], ['avaliacoes', 'Avaliações'], ['localizacao', 'Localização'],
];

const implantInfo = [
  [ScanLine, 'O que são implantes dentários?', 'São estruturas colocadas no osso para substituir a raiz de um dente ausente e servir de suporte para uma prótese.'],
  [ClipboardList, 'Como funciona uma avaliação?', 'O dentista examina sua saúde bucal, conversa sobre suas necessidades e pode solicitar exames para avaliar as opções.'],
  [HeartHandshake, 'Por que planejar caso a caso?', 'As condições da boca e do osso variam de pessoa para pessoa. O planejamento ajuda a definir se o implante é indicado e quais etapas considerar.'],
];

function Brand({ onClick }) {
  return <a href="#inicio" onClick={onClick} className="brand" aria-label="Star Sorrindo Itajubá — início"><picture><source type="image/webp" srcSet="/media/marca.webp"/><img src="/media/marca.png" width="625" height="214" alt="Star Sorrindo Implantes"/></picture></a>;
}

function Tag({ children, number }) {
  return <p className="eyebrow">{number ? <span className="section-no">{number}</span> : <i/>}{children}</p>;
}

function BookButton({ children = 'Agendar avaliação', onBook, service, variant = 'dark', compact = false, calendar = false }) {
  return <button className={`btn btn-${variant}${compact ? ' btn-compact' : ''}`} type="button" onClick={() => onBook(service)} aria-haspopup="dialog">
    {calendar && <CalendarDays size={17}/>}<span>{children}</span>{!calendar && <ArrowUpRight size={18}/>}
  </button>;
}

function External({ href, children, className }) {
  return <a href={href} className={className} target="_blank" rel="noopener noreferrer">{children}</a>;
}

function Photo({ photo, sizes, priority = false }) {
  const [useJpeg, setUseJpeg] = useState(false);
  return <picture>{!useJpeg && <source type="image/webp" sizes={sizes} srcSet={photo.srcset.split(', ').map(item => '/media/' + item).join(', ')}/>}
    <img src={`/media/${photo.key}.jpg`} alt={photo.alt} width={photo.width} height={photo.height}
      onError={useJpeg ? undefined : () => setUseJpeg(true)}
      fetchPriority={priority ? 'high' : undefined} loading={priority ? 'eager' : 'lazy'} decoding="async"/>
  </picture>;
}

function GoogleMark() {
  return <svg width="19" height="19" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#4285F4" d="M43.6 24.5c0-1.5-.1-2.9-.4-4.2H24v8h11a9.4 9.4 0 0 1-4.1 6.2v5.2h6.7c3.9-3.6 6-8.9 6-15.2Z"/>
    <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.2c-1.8 1.2-4.1 1.9-6.8 1.9-5.3 0-9.7-3.6-11.3-8.4H5.8v5.4A20.4 20.4 0 0 0 24 44Z"/>
    <path fill="#FBBC05" d="M12.7 27.4a12.1 12.1 0 0 1 0-7V15H5.8a20 20 0 0 0 0 17.8Z"/>
    <path fill="#EA4335" d="M24 12.2c3 0 5.6 1 7.8 3l5.8-5.8A19.4 19.4 0 0 0 24 4 20.4 20.4 0 0 0 5.8 15l6.9 5.4c1.6-4.8 6-8.2 11.3-8.2Z"/>
  </svg>;
}

function Header({ onBook }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('inicio');
  const ref = useRef(null);
  const toggle = useRef(null);
  const menuId = 'main-navigation';
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const stop = ref.current?.getBoundingClientRect().bottom + 100;
      const items = nav.map(([id]) => document.getElementById(id)).filter(Boolean);
      const current = items.filter(item => item.getBoundingClientRect().top <= stop).at(-1);
      setActive(current?.id || 'inicio');
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const escape = e => { if (e.key === 'Escape') { setOpen(false); toggle.current.focus(); } };
    const outside = e => { if (!ref.current.contains(e.target)) setOpen(false); };
    window.addEventListener('keydown', escape);
    document.addEventListener('pointerdown', outside);
    return () => { window.removeEventListener('keydown', escape); document.removeEventListener('pointerdown', outside); };
  }, [open]);
  return <header className="header" ref={ref}>
    <div className="shell header-inner">
      <Brand onClick={() => setOpen(false)}/>
      <button ref={toggle} type="button" className="icon-button menu-toggle" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      <nav id={menuId} className={open ? 'site-nav is-open' : 'site-nav'} aria-label="Navegação principal">
        {nav.map(([id, label]) => <a key={id} className={active === id ? 'active' : undefined} aria-current={active === id ? 'location' : undefined} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
        <div className="mobile-menu-action"><BookButton onBook={() => { toggle.current.focus(); setOpen(false); onBook(); }}/></div>
      </nav>
      <div className="header-action"><BookButton onBook={onBook} compact variant="outline"/></div>
    </div>
  </header>;
}

function Hero({ onBook, showPhoto }) {
  return <>
    <section id="inicio" className="hero shell">
      <div className="hero-copy">
        <Tag>Odontologia · Itajubá, MG</Tag>
        <h1>Seu sorriso<br className="desktop-break"/> merece um<br className="desktop-break"/> <em>novo começo.</em></h1>
        <p className="hero-lead">Na Star Sorrindo, em Itajubá, você encontra atendimento odontológico com foco em implantes e cuidado com o seu sorriso.</p>
        <div className="hero-actions"><BookButton onBook={onBook}>Agendar minha avaliação</BookButton><a className="text-link" href="#clinica">Conheça nossa clínica <ArrowDown size={16}/></a></div>
        <div className="hero-note"><span className="tiny-mark"><GoogleMark/></span><a href="#avaliacoes">{clinic.reviewCount} avaliações no Google</a></div>
      </div>
      <figure className="hero-visual">
        <div className="hero-frame">
          <button className="hero-photo" type="button" onClick={() => showPhoto(0)} aria-label="01 / 02 Recepção Star Sorrindo — ampliar foto" aria-haspopup="dialog">
            <Photo photo={photos[0]} sizes="(max-width: 767px) 92vw, (max-width: 1199px) 49vw, 640px" priority/>
            <span className="hero-image-label"><span>01 / 02</span> RECEPÇÃO STAR SORRINDO</span>
            <span className="hero-zoom"><Maximize2 size={17}/></span>
          </button>
          <div className="hero-location"><MapPin size={19}/><div><strong>Itajubá <b>·</b> MG</strong><span>No Centro da cidade</span></div></div>
        </div>
        <figcaption><span/> Interior da clínica <span className="hero-line"/></figcaption>
      </figure>
    </section>
    <div className="trust"><ul className="shell trust-grid">
      {[[ScanLine, 'Foco em implantes', 'Odontologia'], [MapPin, 'Centro de Itajubá', 'Nossa localização'], [Phone, 'Contato facilitado', 'Fale com a clínica'], [CalendarDays, 'Solicitação online', 'Escolha uma data']].map(([Icon, title, sub]) =>
        <li key={title}><Icon size={22} strokeWidth={1.45}/><div><strong>{title}</strong><span>{sub}</span></div></li>)}
    </ul></div>
  </>;
}

function Implants({ onBook }) {
  return <section id="implantes" className="section implant-section"><div className="shell implant-layout">
    <div className="implant-copy" data-reveal>
      <Tag number="01">Nosso foco</Tag>
      <h2>Implantes dentários: um novo capítulo <em>para o seu sorriso.</em></h2>
      <p>Quando falta um dente, o implante pode servir de base para uma prótese e ajudar a recuperar a função mastigatória. A indicação começa com uma avaliação odontológica.</p>
      <BookButton onBook={onBook} service={services[0]} variant="light">Quero solicitar uma avaliação</BookButton>
    </div>
    <ImplantArt/>
    <div className="implant-info" data-reveal>
      {implantInfo.map(([Icon, title, body]) => <article key={title}><Icon size={23} strokeWidth={1.5}/><h3>{title}</h3><p>{body}</p></article>)}
    </div>
  </div></section>;
}

function ClinicSpace({ onPhoto }) {
  return <section className="section space-section" id="sobre">
    <div className="shell">
      <div className="space-heading" data-reveal>
        <div><Tag number="02">Sobre a Star Sorrindo</Tag><h2>Um espaço para cuidar <em>do seu sorriso.</em></h2></div>
        <div><p>Na Avenida Cel. Carneiro Júnior, no Centro de Itajubá, a Star Sorrindo recebe quem busca uma avaliação odontológica ou quer entender as possibilidades de tratamento com implantes.</p><a href="#localizacao" className="text-link">Veja onde estamos <ArrowUpRight size={17}/></a></div>
      </div>
      <div id="clinica" className="gallery-block" data-reveal>
        <div className="gallery-heading"><Tag number="03">Nossa clínica</Tag><h3>Conheça nosso espaço.</h3></div>
        <div className="gallery">
          {photos.map((photo, index) => <figure key={photo.key} className={`gallery-photo gallery-${photo.key}`}>
            <button type="button" onClick={() => onPhoto(index)} aria-label={`Ampliar: ${photo.label}`} aria-haspopup="dialog">
              <Photo photo={photo} sizes={index === 0 ? '(max-width: 767px) 92vw, 710px' : '(max-width: 767px) 92vw, 470px'}/>
              <span className="zoom"><Maximize2 size={18}/></span>
            </button>
            <figcaption><span className="photo-no">0{index + 1}</span><span><strong>{photo.label}</strong><small>{photo.detail}</small></span></figcaption>
          </figure>)}
        </div>
      </div>
    </div>
  </section>;
}

function Lightbox({ index, onChange, onClose }) {
  const ref = useRef(null);
  const photo = index !== null ? photos[index] : null;
  const close = useDialog(ref, Boolean(photo), onClose);
  const step = (direction) => onChange((index + direction + photos.length) % photos.length);
  return <dialog ref={ref} className="lightbox" aria-labelledby="lightbox-caption" onClick={e => { if (e.target === e.currentTarget) close(); }}
    onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); step(e.key === 'ArrowRight' ? 1 : -1); } }}>
    {photo && <div className="lightbox-body">
      <button autoFocus type="button" className="icon-button lightbox-close" onClick={close} aria-label="Fechar foto"><X size={22}/></button>
      <img key={photo.key} src={`/media/${photo.full}`} onError={e => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = `/media/${photo.key}.jpg`; }} alt={photo.alt}/>
      <div className="lightbox-controls">
        <button type="button" className="icon-button" aria-label="Foto anterior" onClick={() => step(-1)}><ArrowLeft size={20}/></button>
        <p id="lightbox-caption" aria-live="polite">{photo.label} <span>{index + 1} / {photos.length}</span></p>
        <button type="button" className="icon-button" aria-label="Próxima foto" onClick={() => step(1)}><ArrowRight size={20}/></button>
      </div>
    </div>}
  </dialog>;
}

function Reviews() {
  return <section id="avaliacoes" className="section reviews-section"><div className="shell">
    <div className="reviews-heading" data-reveal><div><Tag number="04">Avaliações</Tag><h2>Quem já esteve <em>por aqui.</em></h2></div>
      <External className="google-badge" href={maps.listing}><span className="tiny-mark"><GoogleMark/></span><span><strong>{clinic.reviewCount} avaliações no Google</strong><small>Ver no Google Maps</small></span><ArrowUpRight size={18}/></External>
    </div>
    <div className="reviews-grid" data-reveal>{reviews.map(({ name, initials, quote }) => <figure className="review" key={name}>
      <span className="quote-mark" aria-hidden="true">“</span><blockquote>{quote}</blockquote>
      <figcaption><span className="avatar" aria-hidden="true">{initials}</span><span><strong>{name}</strong><small>Avaliação no Google</small></span></figcaption>
    </figure>)}</div>
  </div></section>;
}

function BookingSection({ onBook }) {
  const steps = [
    [ClipboardList, 'Escolha o atendimento', 'Selecione uma avaliação ou consulte a disponibilidade para outros assuntos.'],
    [CalendarDays, 'Informe seus dados e a data desejada', 'Preencha seu nome, telefone e a data em que gostaria de ser atendido.'],
    [MessageCircle, 'Envie sua solicitação e aguarde o retorno', 'A clínica informa a disponibilidade. O envio da mensagem não confirma a consulta.'],
  ];
  return <section className="section schedule-section" id="agendamento"><div className="shell">
    <div className="schedule-banner" data-reveal>
      <div><Tag number="05">Agendamento</Tag><h2>Seu primeiro passo <em>é uma avaliação.</em></h2><p>Escolha o atendimento e indique uma data para consultar a disponibilidade da clínica.</p></div>
      <BookButton onBook={onBook} variant="light" calendar>Agendar avaliação</BookButton>
    </div>
    <div className="steps-heading"><Tag>Como funciona</Tag><h3>Da escolha da data ao retorno da clínica.</h3></div>
    <ol className="steps" data-reveal>{steps.map(([Icon, title, copy], index) => <li key={title}>
      <span className="step-icon"><Icon size={22} strokeWidth={1.5}/><small>0{index + 1}</small></span>
      <div><h3>{title}</h3><p>{copy}</p></div>
    </li>)}</ol>
  </div></section>;
}

function FAQ({ onBook }) {
  const [open, setOpen] = useState(0);
  return <section className="section faq-section" id="duvidas"><div className="shell faq-layout">
    <div data-reveal><Tag number="06">Perguntas frequentes</Tag><h2>Antes da sua <em>primeira visita.</em></h2><a className="text-link" href={`tel:${clinic.phoneE164}`}>Fale com a clínica <Phone size={16}/></a></div>
    <div className="faq-list" data-reveal>{faq.map(([question, answer], index) => {
      const active = index === open;
      return <div className={`faq-item${active ? ' expanded' : ''}`} key={question}>
        <h3><button type="button" id={`faq-q-${index}`} aria-expanded={active} aria-controls={`faq-a-${index}`} onClick={() => setOpen(active ? -1 : index)}>{question}<span><Plus size={18}/></span></button></h3>
        <div id={`faq-a-${index}`} className="faq-answer" inert={!active}><div><p>{answer}</p>{index === 0 && <button className="text-link" aria-haspopup="dialog" onClick={() => onBook()}>Abrir formulário <ArrowUpRight size={15}/></button>}</div></div>
      </div>;
    })}</div>
  </div></section>;
}

function Location({ onBook }) {
  const [mapOpen, setMapOpen] = useState(false);
  return <section id="localizacao" className="section location-section"><div className="shell">
    <div className="location-heading" data-reveal><Tag number="07">Localização</Tag><h2>No coração <em>de Itajubá.</em></h2></div>
    <div className="location-card" data-reveal>
      <div className="location-copy">
        <span className="round-icon"><MapPin size={23} strokeWidth={1.5}/></span>
        <h3>{clinic.name}</h3>
        <address>{clinic.street}<br/>{clinic.area} · {clinic.zip}</address>
        <a className="location-phone" href={`tel:${clinic.phoneE164}`}>{clinic.phone}</a>
        <div className="location-links">
          <External className="btn btn-outline btn-compact" href={maps.directions}><Navigation size={16}/> Como chegar</External>
          <a className="btn btn-outline btn-compact" href={`tel:${clinic.phoneE164}`}><Phone size={16}/> Ligar</a>
        </div>
        <BookButton onBook={onBook} compact>Solicitar avaliação</BookButton>
      </div>
      <div className="map">
        {mapOpen ? <iframe title="Mapa da Star Sorrindo Itajubá" src={maps.embed} referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/> :
          <div className="map-cover">
            <span className="map-orbit" aria-hidden="true"><MapPin size={32} strokeWidth={1.35}/></span>
            <p className="eyebrow">Centro · Itajubá, MG</p>
            <strong>Av. Cel. Carneiro Júnior, 150</strong>
            <button className="btn btn-outline btn-compact" type="button" onClick={() => setMapOpen(true)}>Carregar mapa interativo <ArrowUpRight size={15}/></button>
          </div>}
        <External className="map-link" href={maps.listing}>Abrir no Google Maps <ArrowUpRight size={15}/></External>
      </div>
    </div>
  </div></section>;
}

function Footer() {
  return <footer className="footer"><div className="shell">
    <div className="footer-grid">
      <div><div className="footer-brand"><Brand/></div><p>Odontologia com foco em implantes<br/> no Centro de Itajubá.</p></div>
      <div><strong>Explore</strong><nav aria-label="Navegação do rodapé">{nav.slice(1).map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav></div>
      <div><strong>Visite a Star Sorrindo</strong><address>{clinic.street}<br/>{clinic.area} · {clinic.zip}</address><a href={`tel:${clinic.phoneE164}`}>{clinic.phone}</a><External href={maps.listing}>Google Maps <ArrowUpRight size={13}/></External></div>
    </div>
    <div className="footer-legal"><span>Star Sorrindo Itajubá</span><span>Demonstração comercial não oficial</span></div>
  </div></footer>;
}

export default function App() {
  const [booking, setBooking] = useState(null);
  const [photo, setPhoto] = useState(null);
  const openBooking = service => setBooking({ service });
  useEffect(() => {
    if (!('IntersectionObserver' in window) || !matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <Header onBook={openBooking}/>
    <main id="conteudo">
      <Hero onBook={openBooking} showPhoto={setPhoto}/>
      <Implants onBook={openBooking}/>
      <ClinicSpace onPhoto={setPhoto}/>
      <Reviews/>
      <BookingSection onBook={openBooking}/>
      <FAQ onBook={openBooking}/>
      <Location onBook={openBooking}/>
    </main>
    <Footer/>
    <aside className="mobile-book" aria-label="Agendamento rápido"><div><span className="booking-dot"/><span>Star Sorrindo <small>Itajubá · MG</small></span></div><BookButton onBook={openBooking} compact calendar/></aside>
    <Lightbox index={photo} onChange={setPhoto} onClose={() => setPhoto(null)}/>
    <BookingDialog booking={booking} onClose={() => setBooking(null)}/>
  </>;
}
