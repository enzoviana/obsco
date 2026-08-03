// Base de données des pays avec devises
export type CountryInfo = {
  code: string;
  name: string;
  currency: string;
  region: string;
};

// Map des devises par région et pays
const CURRENCY_MAP: Record<string, string> = {
  // Afrique - Franc CFA (West African CFA franc)
  "BJ": "XOF", "BF": "XOF", "CI": "XOF", "GW": "XOF", "ML": "XOF", "NE": "XOF", "SN": "XOF", "TG": "XOF",
  // Afrique - Franc CFA (Central African CFA franc)
  "CM": "XAF", "CF": "XAF", "TD": "XAF", "CG": "XAF", "GQ": "XAF", "GA": "XAF",
  // Autres devises africaines
  "DZ": "DZD", "AO": "AOA", "BW": "BWP", "BI": "BIF", "CV": "CVE", "KM": "KMF", "CD": "CDF",
  "DJ": "DJF", "EG": "EGP", "ER": "ERN", "SZ": "SZL", "ET": "ETB", "GM": "GMD", "GH": "GHS",
  "GN": "GNF", "KE": "KES", "LS": "LSL", "LR": "LRD", "LY": "LYD", "MG": "MGA", "MW": "MWK",
  "MA": "MAD", "MU": "MUR", "MR": "MRU", "MZ": "MZN", "NA": "NAD", "NG": "NGN", "RW": "RWF",
  "ST": "STN", "SC": "SCR", "SL": "SLL", "SO": "SOS", "ZA": "ZAR", "SS": "SSP", "SD": "SDG",
  "TZ": "TZS", "TN": "TND", "UG": "UGX", "ZM": "ZMW", "ZW": "ZWL",
  // Europe
  "AT": "EUR", "BE": "EUR", "BG": "BGN", "HR": "EUR", "CY": "EUR", "CZ": "CZK", "DK": "DKK",
  "EE": "EUR", "FI": "EUR", "FR": "EUR", "DE": "EUR", "GR": "EUR", "HU": "HUF", "IE": "EUR",
  "IT": "EUR", "LV": "EUR", "LT": "EUR", "LU": "EUR", "MT": "EUR", "NL": "EUR", "PL": "PLN",
  "PT": "EUR", "RO": "RON", "SK": "EUR", "SI": "EUR", "ES": "EUR", "SE": "SEK", "GB": "GBP",
  "CH": "CHF", "NO": "NOK",
  // Asie
  "AF": "AFN", "SA": "SAR", "BD": "BDT", "KH": "KHR", "CN": "CNY", "KR": "KRW", "AE": "AED",
  "IN": "INR", "ID": "IDR", "IQ": "IQD", "IR": "IRR", "IL": "ILS", "JP": "JPY", "JO": "JOD",
  "KZ": "KZT", "KW": "KWD", "KG": "KGS", "LA": "LAK", "LB": "LBP", "MY": "MYR", "MV": "MVR",
  "MN": "MNT", "MM": "MMK", "NP": "NPR", "OM": "OMR", "PK": "PKR", "PS": "ILS", "PH": "PHP",
  "QA": "QAR", "SG": "SGD", "LK": "LKR", "SY": "SYP", "TW": "TWD", "TJ": "TJS", "TH": "THB",
  "TL": "USD", "TR": "TRY", "TM": "TMT", "UZ": "UZS", "VN": "VND", "YE": "YER",
  // Amériques
  "AR": "ARS", "BO": "BOB", "BR": "BRL", "CA": "CAD", "CL": "CLP", "CO": "COP", "CR": "CRC",
  "CU": "CUP", "DO": "DOP", "EC": "USD", "SV": "USD", "GT": "GTQ", "HT": "HTG", "HN": "HNL",
  "JM": "JMD", "MX": "MXN", "NI": "NIO", "PA": "PAB", "PY": "PYG", "PE": "PEN", "TT": "TTD",
  "US": "USD", "UY": "UYU", "VE": "VES",
  // Océanie
  "AU": "AUD", "FJ": "FJD", "NZ": "NZD", "PG": "PGK", "WS": "WST", "SB": "SBD", "TO": "TOP", "VU": "VUV",
};

const REGION_MAP: Record<string, string> = {
  // Afrique
  "DZ": "Afrique", "AO": "Afrique", "BJ": "Afrique", "BW": "Afrique", "BF": "Afrique", "BI": "Afrique",
  "CM": "Afrique", "CV": "Afrique", "CF": "Afrique", "TD": "Afrique", "KM": "Afrique", "CG": "Afrique",
  "CD": "Afrique", "CI": "Afrique", "DJ": "Afrique", "EG": "Afrique", "GQ": "Afrique", "ER": "Afrique",
  "SZ": "Afrique", "ET": "Afrique", "GA": "Afrique", "GM": "Afrique", "GH": "Afrique", "GN": "Afrique",
  "GW": "Afrique", "KE": "Afrique", "LS": "Afrique", "LR": "Afrique", "LY": "Afrique", "MG": "Afrique",
  "MW": "Afrique", "ML": "Afrique", "MR": "Afrique", "MU": "Afrique", "MA": "Afrique", "MZ": "Afrique",
  "NA": "Afrique", "NE": "Afrique", "NG": "Afrique", "RW": "Afrique", "ST": "Afrique", "SN": "Afrique",
  "SC": "Afrique", "SL": "Afrique", "SO": "Afrique", "ZA": "Afrique", "SS": "Afrique", "SD": "Afrique",
  "TZ": "Afrique", "TG": "Afrique", "TN": "Afrique", "UG": "Afrique", "ZM": "Afrique", "ZW": "Afrique",
  // Europe
  "AL": "Europe", "AD": "Europe", "AT": "Europe", "BY": "Europe", "BE": "Europe", "BA": "Europe",
  "BG": "Europe", "HR": "Europe", "CY": "Europe", "CZ": "Europe", "DK": "Europe", "EE": "Europe",
  "FI": "Europe", "FR": "Europe", "DE": "Europe", "GR": "Europe", "HU": "Europe", "IS": "Europe",
  "IE": "Europe", "IT": "Europe", "XK": "Europe", "LV": "Europe", "LI": "Europe", "LT": "Europe",
  "LU": "Europe", "MT": "Europe", "MD": "Europe", "MC": "Europe", "ME": "Europe", "NL": "Europe",
  "MK": "Europe", "NO": "Europe", "PL": "Europe", "PT": "Europe", "RO": "Europe", "RU": "Europe",
  "SM": "Europe", "RS": "Europe", "SK": "Europe", "SI": "Europe", "ES": "Europe", "SE": "Europe",
  "CH": "Europe", "UA": "Europe", "GB": "Europe", "VA": "Europe",
  // Asie
  "AF": "Asie", "AM": "Asie", "AZ": "Asie", "BH": "Asie", "BD": "Asie", "BT": "Asie", "BN": "Asie",
  "KH": "Asie", "CN": "Asie", "GE": "Asie", "IN": "Asie", "ID": "Asie", "IR": "Asie", "IQ": "Asie",
  "IL": "Asie", "JP": "Asie", "JO": "Asie", "KZ": "Asie", "KW": "Asie", "KG": "Asie", "LA": "Asie",
  "LB": "Asie", "MY": "Asie", "MV": "Asie", "MN": "Asie", "MM": "Asie", "NP": "Asie", "KP": "Asie",
  "OM": "Asie", "PK": "Asie", "PS": "Asie", "PH": "Asie", "QA": "Asie", "SA": "Asie", "SG": "Asie",
  "KR": "Asie", "LK": "Asie", "SY": "Asie", "TW": "Asie", "TJ": "Asie", "TH": "Asie", "TL": "Asie",
  "TR": "Asie", "TM": "Asie", "AE": "Asie", "UZ": "Asie", "VN": "Asie", "YE": "Asie",
  // Amériques
  "AG": "Amérique", "AR": "Amérique", "BS": "Amérique", "BB": "Amérique", "BZ": "Amérique", "BO": "Amérique",
  "BR": "Amérique", "CA": "Amérique", "CL": "Amérique", "CO": "Amérique", "CR": "Amérique", "CU": "Amérique",
  "DM": "Amérique", "DO": "Amérique", "EC": "Amérique", "SV": "Amérique", "GD": "Amérique", "GT": "Amérique",
  "GY": "Amérique", "HT": "Amérique", "HN": "Amérique", "JM": "Amérique", "MX": "Amérique", "NI": "Amérique",
  "PA": "Amérique", "PY": "Amérique", "PE": "Amérique", "KN": "Amérique", "LC": "Amérique", "VC": "Amérique",
  "SR": "Amérique", "TT": "Amérique", "US": "Amérique", "UY": "Amérique", "VE": "Amérique",
  // Océanie
  "AU": "Océanie", "FJ": "Océanie", "KI": "Océanie", "MH": "Océanie", "FM": "Océanie", "NR": "Océanie",
  "NZ": "Océanie", "PW": "Océanie", "PG": "Océanie", "WS": "Océanie", "SB": "Océanie", "TO": "Océanie",
  "TV": "Océanie", "VU": "Océanie",
};

const COUNTRY_NAMES: Record<string, string> = {
  // Afrique
  "DZ": "Algérie", "AO": "Angola", "BJ": "Bénin", "BW": "Botswana", "BF": "Burkina Faso", "BI": "Burundi",
  "CM": "Cameroun", "CV": "Cap-Vert", "CF": "Centrafrique", "TD": "Tchad", "KM": "Comores", "CG": "Congo",
  "CD": "Congo (RDC)", "CI": "Côte d'Ivoire", "DJ": "Djibouti", "EG": "Égypte", "GQ": "Guinée équatoriale",
  "ER": "Érythrée", "SZ": "Eswatini", "ET": "Éthiopie", "GA": "Gabon", "GM": "Gambie", "GH": "Ghana",
  "GN": "Guinée", "GW": "Guinée-Bissau", "KE": "Kenya", "LS": "Lesotho", "LR": "Libéria", "LY": "Libye",
  "MG": "Madagascar", "MW": "Malawi", "ML": "Mali", "MR": "Mauritanie", "MU": "Maurice", "MA": "Maroc",
  "MZ": "Mozambique", "NA": "Namibie", "NE": "Niger", "NG": "Nigeria", "RW": "Rwanda", "ST": "Sao Tomé-et-Principe",
  "SN": "Sénégal", "SC": "Seychelles", "SL": "Sierra Leone", "SO": "Somalie", "ZA": "Afrique du Sud",
  "SS": "Soudan du Sud", "SD": "Soudan", "TZ": "Tanzanie", "TG": "Togo", "TN": "Tunisie", "UG": "Ouganda",
  "ZM": "Zambie", "ZW": "Zimbabwe",
  // Europe
  "AT": "Autriche", "BE": "Belgique", "BG": "Bulgarie", "HR": "Croatie", "CZ": "République tchèque",
  "DK": "Danemark", "EE": "Estonie", "FI": "Finlande", "FR": "France", "DE": "Allemagne", "GR": "Grèce",
  "HU": "Hongrie", "IE": "Irlande", "IT": "Italie", "LV": "Lettonie", "LT": "Lituanie", "LU": "Luxembourg",
  "MT": "Malte", "NL": "Pays-Bas", "PL": "Pologne", "PT": "Portugal", "RO": "Roumanie", "SK": "Slovaquie",
  "SI": "Slovénie", "ES": "Espagne", "SE": "Suède", "GB": "Royaume-Uni", "CH": "Suisse", "NO": "Norvège",
  // Asie
  "AF": "Afghanistan", "SA": "Arabie saoudite", "BD": "Bangladesh", "KH": "Cambodge", "CN": "Chine",
  "KR": "Corée du Sud", "AE": "Émirats arabes unis", "IN": "Inde", "ID": "Indonésie", "IQ": "Irak",
  "IR": "Iran", "IL": "Israël", "JP": "Japon", "JO": "Jordanie", "KZ": "Kazakhstan", "KW": "Koweït",
  "KG": "Kirghizistan", "LA": "Laos", "LB": "Liban", "MY": "Malaisie", "MV": "Maldives", "MN": "Mongolie",
  "MM": "Myanmar", "NP": "Népal", "OM": "Oman", "PK": "Pakistan", "PS": "Palestine", "PH": "Philippines",
  "QA": "Qatar", "SG": "Singapour", "LK": "Sri Lanka", "SY": "Syrie", "TW": "Taïwan", "TJ": "Tadjikistan",
  "TH": "Thaïlande", "TL": "Timor oriental", "TR": "Turquie", "TM": "Turkménistan", "UZ": "Ouzbékistan",
  "VN": "Vietnam", "YE": "Yémen",
  // Amériques
  "AR": "Argentine", "BO": "Bolivie", "BR": "Brésil", "CA": "Canada", "CL": "Chili", "CO": "Colombie",
  "CR": "Costa Rica", "CU": "Cuba", "DO": "République dominicaine", "EC": "Équateur", "SV": "Salvador",
  "GT": "Guatemala", "HT": "Haïti", "HN": "Honduras", "JM": "Jamaïque", "MX": "Mexique", "NI": "Nicaragua",
  "PA": "Panama", "PY": "Paraguay", "PE": "Pérou", "TT": "Trinité-et-Tobago", "US": "États-Unis",
  "UY": "Uruguay", "VE": "Venezuela",
  // Océanie
  "AU": "Australie", "FJ": "Fidji", "NZ": "Nouvelle-Zélande", "PG": "Papouasie-Nouvelle-Guinée",
  "WS": "Samoa", "SB": "Salomon", "TO": "Tonga", "VU": "Vanuatu",
};

export function getCountryInfo(countryCode: string): CountryInfo {
  const code = countryCode.toUpperCase();
  return {
    code,
    name: COUNTRY_NAMES[code] || code,
    currency: CURRENCY_MAP[code] || "USD",
    region: REGION_MAP[code] || "Autre",
  };
}
