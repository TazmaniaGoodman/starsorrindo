import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, MessageCircle, X } from 'lucide-react';
import { clinic, services } from './clinic.js';
import { buildWhatsAppUrl, dateKey, firstOf, formatDate, fullDate, maskPhone, monthLabel, today, validPhone } from './booking.js';
import { useDialog } from './useDialog.js';

const weekdays = [['D', 'Domingo'], ['S', 'Segunda-feira'], ['T', 'Terça-feira'], ['Q', 'Quarta-feira'], ['Q', 'Quinta-feira'], ['S', 'Sexta-feira'], ['S', 'Sábado']];

function Calendar({ selected, onSelect, error }) {
  const [month, setMonth] = useState(() => firstOf(selected || today()));
  const [now, setNow] = useState(today);
  const next = useRef(null);
  const thisMonth = firstOf(now);
  const visible = month < thisMonth ? thisMonth : month;
  const days = new Date(firstOf(visible, 1).valueOf() - 86400000).getUTCDate();
  useEffect(() => {
    const update = () => setNow(today());
    const id = setInterval(update, 30000);
    document.addEventListener('visibilitychange', update);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', update); };
  }, []);
  return <fieldset className="calendar" id="booking-calendar" aria-describedby={error ? 'date-error' : 'date-summary'}>
    <legend><CalendarDays size={16} /> Data desejada</legend>
    <div className="calendar-head">
      <button type="button" className="icon-button" aria-label="Mês anterior" disabled={visible <= thisMonth} onClick={() => {
        const previous = firstOf(visible, -1);
        setMonth(previous);
        if (previous <= thisMonth) next.current.focus();
      }}><ChevronLeft size={18}/></button>
      <strong aria-live="polite">{monthLabel.format(visible)}</strong>
      <button ref={next} type="button" className="icon-button" aria-label="Próximo mês" onClick={() => setMonth(firstOf(visible, 1))}><ChevronRight size={18}/></button>
    </div>
    <div className="calendar-grid weekdays">{weekdays.map(([letter, label]) => <abbr title={label} key={label}>{letter}</abbr>)}</div>
    <div className="calendar-grid">
      {Array.from({ length: days }, (_, i) => {
        const date = new Date(Date.UTC(visible.getUTCFullYear(), visible.getUTCMonth(), i + 1));
        const key = dateKey(date);
        return <button key={key} type="button" disabled={date < now} aria-current={+date === +now ? 'date' : undefined}
          aria-pressed={selected ? key === dateKey(selected) : false} aria-label={fullDate.format(date)}
          style={i === 0 ? { gridColumnStart: date.getUTCDay() + 1 } : undefined}
          onClick={() => onSelect(date)}>{i + 1}</button>;
      })}
    </div>
    <p id="date-summary" className="date-summary" aria-live="polite">{selected && selected >= now ? `Data escolhida: ${formatDate(selected)}` : 'Selecione uma data a partir de hoje.'}</p>
    {error && <p className="field-error" id="date-error" role="alert">{error}</p>}
  </fieldset>;
}

const empty = { name: '', phone: '', service: '', notes: '' };

export default function BookingDialog({ booking, onClose }) {
  const ref = useRef(null);
  const close = useDialog(ref, Boolean(booking), onClose);
  return <dialog className="booking-dialog" ref={ref} aria-labelledby="booking-title" onClick={e => {
    if (e.target === e.currentTarget) close();
  }}>
    {booking && <div className="booking-panel">
      <div className="booking-heading">
        <div><p className="eyebrow">Star Sorrindo · Itajubá</p><h2 id="booking-title">Solicite sua avaliação.</h2><p>Escolha uma data de preferência para consultar a disponibilidade.</p></div>
        <button type="button" className="icon-button close-dialog" autoFocus onClick={close} aria-label="Fechar agendamento"><X size={21}/></button>
      </div>
      <BookingForm initialService={booking.service} />
    </div>}
  </dialog>;
}

function BookingForm({ initialService }) {
  const [fields, setFields] = useState({ ...empty, service: initialService || '' });
  const [date, setDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [launch, setLaunch] = useState('');
  const form = useRef(null);
  const followup = useRef(null);
  const setField = (name, value) => {
    setFields(current => ({ ...current, [name]: value }));
    setErrors(current => ({ ...current, [name]: '' }));
  };
  function submit(e) {
    e.preventDefault();
    const problems = {};
    if (!/^\p{L}[\p{L}\p{M}.'’\-]*(?:\s+\p{L}[\p{L}\p{M}.'’\-]*)+$/u.test(fields.name.trim())) problems.name = 'Informe seu nome e sobrenome.';
    if (!validPhone(fields.phone)) problems.phone = 'Informe um telefone brasileiro válido com DDD.';
    if (!services.includes(fields.service)) problems.service = 'Escolha um tipo de atendimento.';
    if (!date || date < today()) problems.date = 'Escolha uma data a partir de hoje.';
    setErrors(problems);
    const first = Object.keys(problems)[0];
    if (first) {
      if (first === 'date') form.current.querySelector('.calendar-grid button:not(:disabled)')?.focus();
      else form.current.elements.namedItem(first)?.focus();
      return;
    }
    const url = buildWhatsAppUrl({ ...fields, date });
    if (clinic.whatsappConfirmed) window.open(url, '_blank', 'noopener,noreferrer');
    setLaunch(url);
  }
  useEffect(() => { if (launch) followup.current?.focus(); }, [launch]);
  if (launch) return <div className="booking-ready">
    <span className="round-icon"><MessageCircle size={23}/></span>
    <h3 tabIndex={-1} ref={followup}>Sua mensagem está pronta.</h3>
    <p>{clinic.whatsappConfirmed ? 'Envie a mensagem no WhatsApp e aguarde a resposta da clínica.' : 'O número consta como WhatsApp no guia comercial local. Confirme com a clínica se ela recebe agendamentos por esse canal antes de enviar seus dados.'}</p>
    <a className="btn btn-dark" href={launch} target="_blank" rel="noopener noreferrer">Abrir no WhatsApp <ArrowUpRight size={18}/></a>
    <a className="text-link" href={`tel:${clinic.phoneE164}`}>Ligar para {clinic.phone}</a>
    <button className="text-link" type="button" onClick={() => setLaunch('')}>Voltar ao formulário</button>
  </div>;
  const described = name => errors[name] ? `${name}-error` : undefined;
  const error = name => errors[name] && <span className="field-error" id={`${name}-error`} role="alert">{errors[name]}</span>;
  return <form ref={form} noValidate onSubmit={submit} className="booking-form">
    <div className="booking-fields">
      <label>Nome completo
        <input name="name" placeholder="Seu nome e sobrenome" autoComplete="name" required maxLength={90}
          value={fields.name} onChange={e => setField('name', e.target.value)} aria-invalid={!!errors.name} aria-describedby={described('name')}/>
        {error('name')}
      </label>
      <label>Telefone para contato
        <input name="phone" type="tel" inputMode="tel" placeholder="(35) 99999-9999" autoComplete="tel-national" required
          value={fields.phone} onChange={e => setField('phone', maskPhone(e.target.value))} aria-invalid={!!errors.phone} aria-describedby={described('phone')}/>
        {error('phone')}
      </label>
      <label>Tipo de atendimento
        <select name="service" required value={fields.service} onChange={e => setField('service', e.target.value)} aria-invalid={!!errors.service} aria-describedby={described('service')}>
          <option value="" disabled>Selecione o atendimento</option>
          {services.map(service => <option key={service}>{service}</option>)}
        </select>
        {error('service')}
      </label>
      <label>Observações <span className="optional">opcional</span>
        <textarea name="notes" rows={2} placeholder="Ex.: prefiro o período da tarde" maxLength={240} value={fields.notes} onChange={e => setField('notes', e.target.value)} aria-describedby="notes-hint"/>
        <span className="field-hint" id="notes-hint">Use apenas para preferências de contato ou horário. Não inclua dados de saúde.</span>
      </label>
    </div>
    <Calendar selected={date} error={errors.date} onSelect={value => { setDate(value); setErrors(current => ({ ...current, date: '' })); }}/>
    <div className="booking-send">
      <p>O site não armazena seus dados. A solicitação não confirma a consulta.</p>
      <button type="submit" className="btn btn-dark"><MessageCircle size={18}/> Solicitar pelo WhatsApp <ArrowUpRight size={17}/></button>
    </div>
  </form>;
}
