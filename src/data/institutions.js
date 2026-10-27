export const BANKS = [
  { id: 'bancoestado', name: 'BancoEstado', icon: '🏦', url: 'https://www.bancoestado.cl/content/bancoestado-public/cl/es/home/home.html', loginUrl: 'https://www.bancoestado.cl/content/bancoestado-public/cl/es/home/home.html' },
  { id: 'santander', name: 'Banco Santander', icon: '🏦', url: 'https://www.santander.cl/', loginUrl: 'https://www.santander.cl/personas/' },
  { id: 'chile', name: 'Banco de Chile', icon: '🏦', url: 'https://www.bancochile.cl/', loginUrl: 'https://www.bancochile.cl/personas/' },
  { id: 'bci', name: 'BCI', icon: '🏦', url: 'https://www.bci.cl/', loginUrl: 'https://www.bci.cl/personas/' },
  { id: 'itau', name: 'Banco Itaú', icon: '🏦', url: 'https://www.itau.cl/', loginUrl: 'https://www.itau.cl/personas/' },
  { id: 'ripley', name: 'Banco Ripley', icon: '🏦', url: 'https://www.bancoripley.cl/', loginUrl: 'https://www.bancoripley.cl/personas/' },
  { id: 'consorcio', name: 'Banco Consorcio', icon: '🏦', url: 'https://www.consorcio.cl/', loginUrl: 'https://www.consorcio.cl/personas/' },
];

export const CLINICS = [
  { id: 'hospital-digital', name: 'Hospital Digital', icon: '🏥', url: 'https://www.hospitaldigital.cl/', loginUrl: 'https://www.hospitaldigital.cl/' },
  { id: 'las-condes', name: 'Clínica Las Condes', icon: '🏥', url: 'https://www.cliniclascondes.cl/', loginUrl: 'https://www.cliniclascondes.cl/' },
  { id: 'alemana', name: 'Clínica Alemana', icon: '🏥', url: 'https://www.alemana.cl/', loginUrl: 'https://www.alemana.cl/' },
  { id: 'santa-maria', name: 'Clínica Santa María', icon: '🏥', url: 'https://www.santamaria.cl/', loginUrl: 'https://www.santamaria.cl/' },
  { id: 'los-andes', name: 'Clínica Los Andes', icon: '🏥', url: 'https://www.cliniclosandes.cl/', loginUrl: 'https://www.cliniclosandes.cl/' },
  { id: 'cruz-blancа', name: 'Cruz Blanca', icon: '🏥', url: 'https://www.cruzblanca.cl/', loginUrl: 'https://www.cruzblanca.cl/' },
];

export const AFP_LIST = [
  { id: 'habitat', name: 'AFP Habitat', icon: '💰', url: 'https://www.afphabitat.cl/', loginUrl: 'https://www.afphabitat.cl/portal/afiliados/index.html' },
  { id: 'capital', name: 'AFP Capital', icon: '💰', url: 'https://www.afpcapital.cl/', loginUrl: 'https://www.afpcapital.cl/' },
  { id: 'cuprum', name: 'AFP Cuprum', icon: '💰', url: 'https://www.afpcuprum.cl/', loginUrl: 'https://www.afpcuprum.cl/' },
  { id: 'planvital', name: 'AFP PlanVital', icon: '💰', url: 'https://www.afpplanvital.cl/', loginUrl: 'https://www.afpplanvital.cl/' },
  { id: 'provida', name: 'AFP Provida', icon: '💰', url: 'https://www.afpprovida.cl/', loginUrl: 'https://www.afpprovida.cl/' },
  { id: 'modelo', name: 'AFP Modelo', icon: '💰', url: 'https://www.afpmodelo.cl/', loginUrl: 'https://www.afpmodelo.cl/' },
];

export const PROCEDURE_TYPES = [
  {
    id: 'cartola-bancaria',
    title: 'Ver mi cartola bancaria',
    description: 'Revisa tus últimos movimientos y saldo',
    icon: '🏦',
    institutionKey: 'bank',
    estimatedTime: '5 minutos',
  },
  {
    id: 'hora-medica',
    title: 'Sacar hora médica',
    description: 'Agenda una consulta con tu médico',
    icon: '🏥',
    institutionKey: 'clinic',
    estimatedTime: '7 minutos',
  },
  {
    id: 'consulta-afp',
    title: 'Consultar mi AFP',
    description: 'Revisa tu saldo de ahorro previsional',
    icon: '💰',
    institutionKey: 'afp',
    estimatedTime: '6 minutos',
  },
];

export const INSTITUTIONS = {
  bank: BANKS,
  clinic: CLINICS,
  afp: AFP_LIST,
};

export function getTips(procedureId) {
  const tips = {
    'cartola-bancaria': [
      { icon: '👤', text: 'Busca la sección "Personas" o "Clientes"' },
      { icon: '🔐', text: 'Ingresa tu RUT y contraseña' },
      { icon: '📊', text: 'Busca "Cartola" o "Últimos movimientos"' },
      { icon: '🔒', text: 'Nunca compartas tu contraseña con nadie' },
    ],
    'hora-medica': [
      { icon: '📅', text: 'Busca el botón "Agendar hora" o "Sacar hora"' },
      { icon: '🩺', text: 'Elige "Consulta general" si es tu primera vez' },
      { icon: '📆', text: 'Selecciona un día disponible (en color)' },
      { icon: '✅', text: 'Revisa tus datos antes de confirmar' },
    ],
    'consulta-afp': [
      { icon: '👤', text: 'Busca "Afiliados" o "Personas"' },
      { icon: '🔐', text: 'Ingresa tu RUT y contraseña' },
      { icon: '💰', text: 'Busca "Saldo" o "Movimientos"' },
      { icon: '📞', text: 'Dudas sobre pensión: llama gratis al 600 600 3600' },
    ],
  };
  return tips[procedureId] || [];
}
