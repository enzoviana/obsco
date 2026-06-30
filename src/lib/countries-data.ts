// Base de données complète des pays du monde avec drapeaux emoji et informations ISO
export type CountryData = {
  name: string;
  code: string; // Code ISO 2 lettres
  code3: string; // Code ISO 3 lettres
  flag: string; // Emoji drapeau
  region: string;
  subregion?: string;
};

export const WORLD_COUNTRIES: CountryData[] = [
  // Afrique
  { name: "Algérie", code: "DZ", code3: "DZA", flag: "🇩🇿", region: "Afrique", subregion: "Afrique du Nord" },
  { name: "Angola", code: "AO", code3: "AGO", flag: "🇦🇴", region: "Afrique", subregion: "Afrique Centrale" },
  { name: "Bénin", code: "BJ", code3: "BEN", flag: "🇧🇯", region: "Afrique", subregion: "Afrique de l'Ouest" },
  { name: "Botswana", code: "BW", code3: "BWA", flag: "🇧🇼", region: "Afrique", subregion: "Afrique Australe" },
  { name: "Burkina Faso", code: "BF", code3: "BFA", flag: "🇧🇫", region: "Afrique", subregion: "Afrique de l'Ouest" },
  { name: "Burundi", code: "BI", code3: "BDI", flag: "🇧🇮", region: "Afrique", subregion: "Afrique de l'Est" },
  { name: "Cameroun", code: "CM", code3: "CMR", flag: "🇨🇲", region: "Afrique", subregion: "Afrique Centrale" },
  { name: "Cap-Vert", code: "CV", code3: "CPV", flag: "🇨🇻", region: "Afrique", subregion: "Afrique de l'Ouest" },
  { name: "Centrafrique", code: "CF", code3: "CAF", flag: "🇨🇫", region: "Afrique", subregion: "Afrique Centrale" },
  { name: "Comores", code: "KM", code3: "COM", flag: "🇰🇲", region: "Afrique", subregion: "Afrique de l'Est" },
  { name: "Congo", code: "CG", code3: "COG", flag: "🇨🇬", region: "Afrique", subregion: "Afrique Centrale" },
  { name: "Congo (RDC)", code: "CD", code3: "COD", flag: "🇨🇩", region: "Afrique", subregion: "Afrique Centrale" },
  { name: "Côte d'Ivoire", code: "CI", code3: "CIV", flag: "🇨🇮", region: "Afrique", subregion: "Afrique de l'Ouest" },
  { name: "Djibouti", code: "DJ", code3: "DJI", flag: "🇩🇯", region: "Afrique", subregion: "Afrique de l'Est" },
  { name: "Égypte", code: "EG", code3: "EGY", flag: "🇪🇬", region: "Afrique", subregion: "Afrique du Nord" },
  { name: "Érythrée", code: "ER", code3: "ERI", flag: "🇪🇷", region: "Afrique", subregion: "Afrique de l'Est" },
  { name: "Eswatini", code: "SZ", code3: "SWZ", flag: "🇸🇿", region: "Afrique", subregion: "Afrique Australe" },
  { name: "Éthiopie", code: "ET", code3: "ETH", flag: "🇪🇹", region: "Afrique", subregion: "Afrique de l'Est" },
  { name: "Gabon", code: "GA", code3: "GAB", flag: "🇬🇦", region: "Afrique", subregion: "Afrique Centrale" },
  { name: "Gambie", code: "GM", code3: "GMB", flag: "🇬🇲", region: "Afrique", subregion: "Afrique de l'Ouest" },
  { name: "Ghana", code: "GH", code3: "GHA", flag: "🇬🇭", region: "Afrique", subregion: "Afrique de l'Ouest" },
  { name: "Guinée", code: "GN", code3: "GIN", flag: "🇬🇳", region: "Afrique", subregion: "Afrique de l'Ouest" },
  { name: "Guinée-Bissau", code: "GW", code3: "GNB", flag: "🇬🇼", region: "Afrique", subregion: "Afrique de l'Ouest" },
  { name: "Guinée équatoriale", code: "GQ", code3: "GNQ", flag: "🇬🇶", region: "Afrique", subregion: "Afrique Centrale" },
  { name: "Kenya", code: "KE", code3: "KEN", flag: "🇰🇪", region: "Afrique", subregion: "Afrique de l'Est" },
  { name: "Lesotho", code: "LS", code3: "LSO", flag: "🇱🇸", region: "Afrique", subregion: "Afrique Australe" },
  { name: "Libéria", code: "LR", code3: "LBR", flag: "🇱🇷", region: "Afrique", subregion: "Afrique de l'Ouest" },
  { name: "Libye", code: "LY", code3: "LBY", flag: "🇱🇾", region: "Afrique", subregion: "Afrique du Nord" },
  { name: "Madagascar", code: "MG", code3: "MDG", flag: "🇲🇬", region: "Afrique", subregion: "Afrique de l'Est" },
  { name: "Malawi", code: "MW", code3: "MWI", flag: "🇲🇼", region: "Afrique", subregion: "Afrique de l'Est" },
  { name: "Mali", code: "ML", code3: "MLI", flag: "🇲🇱", region: "Afrique", subregion: "Afrique de l'Ouest" },
  { name: "Maroc", code: "MA", code3: "MAR", flag: "🇲🇦", region: "Afrique", subregion: "Afrique du Nord" },
  { name: "Maurice", code: "MU", code3: "MUS", flag: "🇲🇺", region: "Afrique", subregion: "Afrique de l'Est" },
  { name: "Mauritanie", code: "MR", code3: "MRT", flag: "🇲🇷", region: "Afrique", subregion: "Afrique de l'Ouest" },
  { name: "Mozambique", code: "MZ", code3: "MOZ", flag: "🇲🇿", region: "Afrique", subregion: "Afrique de l'Est" },
  { name: "Namibie", code: "NA", code3: "NAM", flag: "🇳🇦", region: "Afrique", subregion: "Afrique Australe" },
  { name: "Niger", code: "NE", code3: "NER", flag: "🇳🇪", region: "Afrique", subregion: "Afrique de l'Ouest" },
  { name: "Nigeria", code: "NG", code3: "NGA", flag: "🇳🇬", region: "Afrique", subregion: "Afrique de l'Ouest" },
  { name: "Ouganda", code: "UG", code3: "UGA", flag: "🇺🇬", region: "Afrique", subregion: "Afrique de l'Est" },
  { name: "Rwanda", code: "RW", code3: "RWA", flag: "🇷🇼", region: "Afrique", subregion: "Afrique de l'Est" },
  { name: "Sao Tomé-et-Principe", code: "ST", code3: "STP", flag: "🇸🇹", region: "Afrique", subregion: "Afrique Centrale" },
  { name: "Sénégal", code: "SN", code3: "SEN", flag: "🇸🇳", region: "Afrique", subregion: "Afrique de l'Ouest" },
  { name: "Seychelles", code: "SC", code3: "SYC", flag: "🇸🇨", region: "Afrique", subregion: "Afrique de l'Est" },
  { name: "Sierra Leone", code: "SL", code3: "SLE", flag: "🇸🇱", region: "Afrique", subregion: "Afrique de l'Ouest" },
  { name: "Somalie", code: "SO", code3: "SOM", flag: "🇸🇴", region: "Afrique", subregion: "Afrique de l'Est" },
  { name: "Soudan", code: "SD", code3: "SDN", flag: "🇸🇩", region: "Afrique", subregion: "Afrique du Nord" },
  { name: "Soudan du Sud", code: "SS", code3: "SSD", flag: "🇸🇸", region: "Afrique", subregion: "Afrique de l'Est" },
  { name: "Tanzanie", code: "TZ", code3: "TZA", flag: "🇹🇿", region: "Afrique", subregion: "Afrique de l'Est" },
  { name: "Tchad", code: "TD", code3: "TCD", flag: "🇹🇩", region: "Afrique", subregion: "Afrique Centrale" },
  { name: "Togo", code: "TG", code3: "TGO", flag: "🇹🇬", region: "Afrique", subregion: "Afrique de l'Ouest" },
  { name: "Tunisie", code: "TN", code3: "TUN", flag: "🇹🇳", region: "Afrique", subregion: "Afrique du Nord" },
  { name: "Zambie", code: "ZM", code3: "ZMB", flag: "🇿🇲", region: "Afrique", subregion: "Afrique de l'Est" },
  { name: "Zimbabwe", code: "ZW", code3: "ZWE", flag: "🇿🇼", region: "Afrique", subregion: "Afrique de l'Est" },

  // Europe
  { name: "Allemagne", code: "DE", code3: "DEU", flag: "🇩🇪", region: "Europe", subregion: "Europe de l'Ouest" },
  { name: "Autriche", code: "AT", code3: "AUT", flag: "🇦🇹", region: "Europe", subregion: "Europe de l'Ouest" },
  { name: "Belgique", code: "BE", code3: "BEL", flag: "🇧🇪", region: "Europe", subregion: "Europe de l'Ouest" },
  { name: "Bulgarie", code: "BG", code3: "BGR", flag: "🇧🇬", region: "Europe", subregion: "Europe de l'Est" },
  { name: "Croatie", code: "HR", code3: "HRV", flag: "🇭🇷", region: "Europe", subregion: "Europe du Sud" },
  { name: "Danemark", code: "DK", code3: "DNK", flag: "🇩🇰", region: "Europe", subregion: "Europe du Nord" },
  { name: "Espagne", code: "ES", code3: "ESP", flag: "🇪🇸", region: "Europe", subregion: "Europe du Sud" },
  { name: "Estonie", code: "EE", code3: "EST", flag: "🇪🇪", region: "Europe", subregion: "Europe du Nord" },
  { name: "Finlande", code: "FI", code3: "FIN", flag: "🇫🇮", region: "Europe", subregion: "Europe du Nord" },
  { name: "France", code: "FR", code3: "FRA", flag: "🇫🇷", region: "Europe", subregion: "Europe de l'Ouest" },
  { name: "Grèce", code: "GR", code3: "GRC", flag: "🇬🇷", region: "Europe", subregion: "Europe du Sud" },
  { name: "Hongrie", code: "HU", code3: "HUN", flag: "🇭🇺", region: "Europe", subregion: "Europe de l'Est" },
  { name: "Irlande", code: "IE", code3: "IRL", flag: "🇮🇪", region: "Europe", subregion: "Europe du Nord" },
  { name: "Italie", code: "IT", code3: "ITA", flag: "🇮🇹", region: "Europe", subregion: "Europe du Sud" },
  { name: "Lettonie", code: "LV", code3: "LVA", flag: "🇱🇻", region: "Europe", subregion: "Europe du Nord" },
  { name: "Lituanie", code: "LT", code3: "LTU", flag: "🇱🇹", region: "Europe", subregion: "Europe du Nord" },
  { name: "Luxembourg", code: "LU", code3: "LUX", flag: "🇱🇺", region: "Europe", subregion: "Europe de l'Ouest" },
  { name: "Malte", code: "MT", code3: "MLT", flag: "🇲🇹", region: "Europe", subregion: "Europe du Sud" },
  { name: "Norvège", code: "NO", code3: "NOR", flag: "🇳🇴", region: "Europe", subregion: "Europe du Nord" },
  { name: "Pays-Bas", code: "NL", code3: "NLD", flag: "🇳🇱", region: "Europe", subregion: "Europe de l'Ouest" },
  { name: "Pologne", code: "PL", code3: "POL", flag: "🇵🇱", region: "Europe", subregion: "Europe de l'Est" },
  { name: "Portugal", code: "PT", code3: "PRT", flag: "🇵🇹", region: "Europe", subregion: "Europe du Sud" },
  { name: "République tchèque", code: "CZ", code3: "CZE", flag: "🇨🇿", region: "Europe", subregion: "Europe de l'Est" },
  { name: "Roumanie", code: "RO", code3: "ROU", flag: "🇷🇴", region: "Europe", subregion: "Europe de l'Est" },
  { name: "Royaume-Uni", code: "GB", code3: "GBR", flag: "🇬🇧", region: "Europe", subregion: "Europe du Nord" },
  { name: "Slovaquie", code: "SK", code3: "SVK", flag: "🇸🇰", region: "Europe", subregion: "Europe de l'Est" },
  { name: "Slovénie", code: "SI", code3: "SVN", flag: "🇸🇮", region: "Europe", subregion: "Europe du Sud" },
  { name: "Suède", code: "SE", code3: "SWE", flag: "🇸🇪", region: "Europe", subregion: "Europe du Nord" },
  { name: "Suisse", code: "CH", code3: "CHE", flag: "🇨🇭", region: "Europe", subregion: "Europe de l'Ouest" },

  // Asie
  { name: "Afghanistan", code: "AF", code3: "AFG", flag: "🇦🇫", region: "Asie", subregion: "Asie du Sud" },
  { name: "Arabie saoudite", code: "SA", code3: "SAU", flag: "🇸🇦", region: "Asie", subregion: "Asie de l'Ouest" },
  { name: "Bangladesh", code: "BD", code3: "BGD", flag: "🇧🇩", region: "Asie", subregion: "Asie du Sud" },
  { name: "Cambodge", code: "KH", code3: "KHM", flag: "🇰🇭", region: "Asie", subregion: "Asie du Sud-Est" },
  { name: "Chine", code: "CN", code3: "CHN", flag: "🇨🇳", region: "Asie", subregion: "Asie de l'Est" },
  { name: "Corée du Sud", code: "KR", code3: "KOR", flag: "🇰🇷", region: "Asie", subregion: "Asie de l'Est" },
  { name: "Émirats arabes unis", code: "AE", code3: "ARE", flag: "🇦🇪", region: "Asie", subregion: "Asie de l'Ouest" },
  { name: "Inde", code: "IN", code3: "IND", flag: "🇮🇳", region: "Asie", subregion: "Asie du Sud" },
  { name: "Indonésie", code: "ID", code3: "IDN", flag: "🇮🇩", region: "Asie", subregion: "Asie du Sud-Est" },
  { name: "Irak", code: "IQ", code3: "IRQ", flag: "🇮🇶", region: "Asie", subregion: "Asie de l'Ouest" },
  { name: "Iran", code: "IR", code3: "IRN", flag: "🇮🇷", region: "Asie", subregion: "Asie de l'Ouest" },
  { name: "Israël", code: "IL", code3: "ISR", flag: "🇮🇱", region: "Asie", subregion: "Asie de l'Ouest" },
  { name: "Japon", code: "JP", code3: "JPN", flag: "🇯🇵", region: "Asie", subregion: "Asie de l'Est" },
  { name: "Jordanie", code: "JO", code3: "JOR", flag: "🇯🇴", region: "Asie", subregion: "Asie de l'Ouest" },
  { name: "Kazakhstan", code: "KZ", code3: "KAZ", flag: "🇰🇿", region: "Asie", subregion: "Asie centrale" },
  { name: "Liban", code: "LB", code3: "LBN", flag: "🇱🇧", region: "Asie", subregion: "Asie de l'Ouest" },
  { name: "Malaisie", code: "MY", code3: "MYS", flag: "🇲🇾", region: "Asie", subregion: "Asie du Sud-Est" },
  { name: "Myanmar", code: "MM", code3: "MMR", flag: "🇲🇲", region: "Asie", subregion: "Asie du Sud-Est" },
  { name: "Pakistan", code: "PK", code3: "PAK", flag: "🇵🇰", region: "Asie", subregion: "Asie du Sud" },
  { name: "Philippines", code: "PH", code3: "PHL", flag: "🇵🇭", region: "Asie", subregion: "Asie du Sud-Est" },
  { name: "Singapour", code: "SG", code3: "SGP", flag: "🇸🇬", region: "Asie", subregion: "Asie du Sud-Est" },
  { name: "Sri Lanka", code: "LK", code3: "LKA", flag: "🇱🇰", region: "Asie", subregion: "Asie du Sud" },
  { name: "Syrie", code: "SY", code3: "SYR", flag: "🇸🇾", region: "Asie", subregion: "Asie de l'Ouest" },
  { name: "Thaïlande", code: "TH", code3: "THA", flag: "🇹🇭", region: "Asie", subregion: "Asie du Sud-Est" },
  { name: "Turquie", code: "TR", code3: "TUR", flag: "🇹🇷", region: "Asie", subregion: "Asie de l'Ouest" },
  { name: "Vietnam", code: "VN", code3: "VNM", flag: "🇻🇳", region: "Asie", subregion: "Asie du Sud-Est" },

  // Amérique
  { name: "Argentine", code: "AR", code3: "ARG", flag: "🇦🇷", region: "Amérique", subregion: "Amérique du Sud" },
  { name: "Brésil", code: "BR", code3: "BRA", flag: "🇧🇷", region: "Amérique", subregion: "Amérique du Sud" },
  { name: "Canada", code: "CA", code3: "CAN", flag: "🇨🇦", region: "Amérique", subregion: "Amérique du Nord" },
  { name: "Chili", code: "CL", code3: "CHL", flag: "🇨🇱", region: "Amérique", subregion: "Amérique du Sud" },
  { name: "Colombie", code: "CO", code3: "COL", flag: "🇨🇴", region: "Amérique", subregion: "Amérique du Sud" },
  { name: "Cuba", code: "CU", code3: "CUB", flag: "🇨🇺", region: "Amérique", subregion: "Caraïbes" },
  { name: "États-Unis", code: "US", code3: "USA", flag: "🇺🇸", region: "Amérique", subregion: "Amérique du Nord" },
  { name: "Haïti", code: "HT", code3: "HTI", flag: "🇭🇹", region: "Amérique", subregion: "Caraïbes" },
  { name: "Mexique", code: "MX", code3: "MEX", flag: "🇲🇽", region: "Amérique", subregion: "Amérique du Nord" },
  { name: "Pérou", code: "PE", code3: "PER", flag: "🇵🇪", region: "Amérique", subregion: "Amérique du Sud" },
  { name: "Venezuela", code: "VE", code3: "VEN", flag: "🇻🇪", region: "Amérique", subregion: "Amérique du Sud" },

  // Océanie
  { name: "Australie", code: "AU", code3: "AUS", flag: "🇦🇺", region: "Océanie", subregion: "Australie" },
  { name: "Nouvelle-Zélande", code: "NZ", code3: "NZL", flag: "🇳🇿", region: "Océanie", subregion: "Australie" },
];

// Fonction helper pour obtenir les données d'un pays par code
export function getCountryByCode(code: string): CountryData | undefined {
  return WORLD_COUNTRIES.find(c => c.code === code || c.code3 === code);
}

// Fonction helper pour rechercher des pays
export function searchCountries(query: string): CountryData[] {
  const q = query.toLowerCase().trim();
  if (!q) return WORLD_COUNTRIES;

  return WORLD_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.code.toLowerCase().includes(q) ||
    c.code3.toLowerCase().includes(q) ||
    c.region.toLowerCase().includes(q)
  );
}
