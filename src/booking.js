import { clinic } from './clinic.js';

const localDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
});
export const today = (now = new Date()) => {
  const parts = Object.fromEntries(localDate.formatToParts(now).map(({ type, value }) => [type, value]));
  return new Date(Date.UTC(+parts.year, +parts.month - 1, +parts.day));
};
export const firstOf = (date, offset = 0) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1));
export const dateKey = (date) => date.toISOString().slice(0, 10);
export const formatDate = (date) => dateKey(date).split('-').reverse().join('/');
export const monthLabel = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', month: 'long', year: 'numeric' });
export const fullDate = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', dateStyle: 'full' });

const validDdd = /^(1[1-9]|2[12478]|3[1-578]|4[1-9]|5[1345]|6[1-9]|7[134579]|8[1-9]|9[1-9])$/;
export function nationalPhone(value) {
  const digits = value.replace(/\D/g, '');
  return (digits.length >= 12 && digits.startsWith('55') ? digits.slice(2) : digits).slice(0, 11);
}
export function maskPhone(value) {
  const digits = nationalPhone(value);
  if (digits.length <= 2) return digits;
  const line = digits.slice(2);
  const split = line.length > 8 ? 5 : 4;
  return `(${digits.slice(0, 2)}) ${line.slice(0, split)}${line.length > split ? '-' + line.slice(split) : ''}`;
}
export function validPhone(value) {
  const digits = nationalPhone(value);
  return validDdd.test(digits.slice(0, 2)) && /^(9\d{8}|[2-5]\d{7})$/.test(digits.slice(2));
}

export function buildWhatsAppUrl({ name, phone, service, date, notes }) {
  const message = [
    'Olá, equipe Star Sorrindo! Gostaria de consultar a disponibilidade para uma avaliação.',
    '',
    `Nome: ${name.trim()}`,
    `Telefone: ${maskPhone(phone)}`,
    `Atendimento desejado: ${service}`,
    `Data desejada: ${formatDate(date)}`,
    `Observações: ${notes.trim() || 'Sem observações.'}`,
    '',
    'Vocês têm disponibilidade para essa data?',
  ].join('\n').toWellFormed();
  return `https://api.whatsapp.com/send?phone=${clinic.phoneE164.slice(1)}&text=${encodeURIComponent(message)}`;
}
