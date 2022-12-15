const axios = require('axios').default;
const { utcToZonedTime } = require('date-fns-tz');
const { parse, format } = require('date-fns');

const API = 'https://api-dolar-argentina.vercel.app/api';

const get = async (endpoint) => {
  const response = await axios.get(`${API}/${endpoint}`, {
    headers: {
      'x-api-key': process.env.API_KEY,
    },
  });
  return response.data;
};

const parseValue = (value) => {
  if (value === 'No cotiza') {
    // eslint-disable-next-line no-param-reassign
    value = 90;
  }
  const newValue = parseFloat(value);
  if (Number.isNaN(newValue)) {
    return value;
  }
  return newValue;
};

// formats a value according to its type.
const formatValue = (type, value) => {
  switch (type) {
    case 'moneda': {
      const { compra, venta } = value;
      const buy = parseValue(compra);
      const sell = parseValue(venta);
      const avg = (buy + sell) / 2;
      return `$${buy.toFixed(2)} / $${avg.toFixed(2)} / $${sell.toFixed(2)}`;
    }
    case 'valor':
      return parseValue(value.valor);
    default:
      return value;
  }
};
const getValues = async (endpoints) => Promise.all(endpoints.map(({ endpoint }) => get(endpoint)));
const processValues = (endpoints, values) => {
  return endpoints.map((endpoint, index) => {
    const { type, name } = endpoint;
    const { fecha, ...value } = values[index];
    const date = utcToZonedTime(parse(fecha, 'yyyy/MM/dd HH:mm:ss', new Date()), 'America/Argentina/Buenos_Aires');
    return {
      name,
      date,
      value: formatValue(type, value),
    };
  });
};

const endpoints = [
  {
    name: 'Oficial',
    endpoint: 'dolaroficial',
    type: 'moneda',
  },
  {
    name: 'Blue',
    endpoint: 'dolarblue',
    type: 'moneda',
  },
  {
    name: 'Liqui',
    endpoint: 'contadoliqui',
    type: 'moneda',
  },
  {
    name: 'Bolsa',
    endpoint: 'dolarbolsa',
    type: 'moneda',
  },
  {
    name: 'Mayorista',
    endpoint: 'mayorista',
    type: 'moneda',
  },
  {
    name: 'Euro nacion',
    endpoint: 'euro/nacion',
    type: 'moneda',
  },
  {
    name: 'BBVA',
    endpoint: 'bbva',
    type: 'moneda',
  },
  {
    name: 'Riesgo pais',
    endpoint: 'riesgopais',
    type: 'valor',
  },
];
function printSource(values) {
  values.forEach((data) => {
    console.log(data.value, '-', format(data.date, 'yyyy-MM-dd HH:mm:ss'), data.name);
  });
}

getValues(endpoints)
  .then((values) => processValues(endpoints, values))
  .then(printSource)
  .catch((e) => {
    console.log(e.message);
    process.exit(1);
  });
