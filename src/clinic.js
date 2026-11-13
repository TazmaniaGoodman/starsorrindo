export const clinic = {
  name: 'Star Sorrindo Itajubá',
  phone: '(35) 99912-5319',
  phoneE164: '+5535999125319',
  whatsappConfirmed: false,
  street: 'Av. Cel. Carneiro Júnior, 150',
  area: 'Centro, Itajubá — MG',
  zip: '37500-018',
  reviewCount: 24,
};

const place = encodeURIComponent(`${clinic.name}, ${clinic.street}, ${clinic.area}, ${clinic.zip}`);
const pin = '-22.4254028,-45.6037109';
export const maps = {
  listing: `https://www.google.com/maps/search/?api=1&query=${place}`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${pin}`,
  embed: `https://maps.google.com/maps?q=${pin}&z=17&output=embed`,
};

export const services = [
  'Avaliação para implantes dentários',
  'Avaliação odontológica',
  'Outros assuntos / consultar disponibilidade',
];

export const photos = [
  { key: 'recepcao', label: 'Recepção e sala de espera', detail: 'Interior da clínica', alt: 'Recepção da Star Sorrindo com balcão branco, poltronas claras e luminárias douradas', width: 765, height: 1020, full: 'recepcao-765.webp', srcset: 'recepcao-420.webp 420w, recepcao-765.webp 765w' },
  { key: 'fachada', label: 'Fachada da Star Sorrindo', detail: 'Av. Cel. Carneiro Júnior, 150', alt: 'Fachada da clínica com letreiro Star Sorrindo Implantes sobre a entrada', width: 1360, height: 1020, full: 'fachada-1360.webp', srcset: 'fachada-480.webp 480w, fachada-1040.webp 1040w, fachada-1360.webp 1360w' },
];

export const reviews = [
  { name: 'Sueli Cortez', initials: 'SC', quote: 'Adorei o pessoal Mt gente boa, ótimo atendimento super recomendo.' },
  { name: 'Ana Ilza', initials: 'AI', quote: 'Otimo atendimento na recepção e todos os profissionais de grande competencia.' },
  { name: 'Edgar Takeshi Nishijima', initials: 'EN', quote: 'Equipe e atendimentos sensacionais!' },
];

export const faq = [
  ['Como faço para solicitar uma avaliação?', 'Abra o formulário de agendamento, escolha o atendimento e informe seus dados e a data de preferência.'],
  ['Posso pedir informações sobre implantes?', 'Sim. Selecione “Avaliação para implantes dentários” ou ligue para conversar com a clínica. A avaliação ajuda a entender quais opções fazem sentido para o seu caso.'],
  ['O agendamento é confirmado automaticamente?', 'Não. A data é apenas uma preferência. Aguarde o retorno da clínica para saber se há disponibilidade.'],
  ['Onde fica a Star Sorrindo?', `Na ${clinic.street}, ${clinic.area}, CEP ${clinic.zip}.`],
  ['Como entro em contato com a clínica?', `Ligue para ${clinic.phone}.`],
];
