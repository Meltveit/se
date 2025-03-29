// src/lib/geographic-data.ts

export const COUNTRIES = [
    { value: 'no', label: 'Norway', flag: '🇳🇴', phoneCode: '+47', hasRegions: true },
    { value: 'se', label: 'Sweden', flag: '🇸🇪', phoneCode: '+46', hasRegions: true },
    { value: 'dk', label: 'Denmark', flag: '🇩🇰', phoneCode: '+45', hasRegions: true },
    { value: 'fi', label: 'Finland', flag: '🇫🇮', phoneCode: '+358', hasRegions: true },
    { value: 'us', label: 'United States', flag: '🇺🇸', phoneCode: '+1', hasRegions: true },
    { value: 'uk', label: 'United Kingdom', flag: '🇬🇧', phoneCode: '+44', hasRegions: true },
    { value: 'de', label: 'Germany', flag: '🇩🇪', phoneCode: '+49', hasRegions: true },
    { value: 'fr', label: 'France', flag: '🇫🇷', phoneCode: '+33', hasRegions: true },
    { value: 'ca', label: 'Canada', flag: '🇨🇦', phoneCode: '+1', hasRegions: true },
    { value: 'au', label: 'Australia', flag: '🇦🇺', phoneCode: '+61', hasRegions: true },
    { value: 'nl', label: 'Netherlands', flag: '🇳🇱', phoneCode: '+31', hasRegions: true },
    { value: 'be', label: 'Belgium', flag: '🇧🇪', phoneCode: '+32', hasRegions: true },
    { value: 'es', label: 'Spain', flag: '🇪🇸', phoneCode: '+34', hasRegions: true },
    { value: 'it', label: 'Italy', flag: '🇮🇹', phoneCode: '+39', hasRegions: true },
  ];
  
  export const REGIONS: Record<string, Array<{ value: string; label: string }>> = {
    'no': [
      { value: 'oslo', label: 'Oslo' },
      { value: 'viken', label: 'Viken' },
      { value: 'vestland', label: 'Vestland' },
      { value: 'troms-og-finnmark', label: 'Troms og Finnmark' },
      { value: 'trondelag', label: 'Trøndelag' },
      { value: 'innlandet', label: 'Innlandet' },
      { value: 'vestfold-og-telemark', label: 'Vestfold og Telemark' },
      { value: 'rogaland', label: 'Rogaland' },
      { value: 'agder', label: 'Agder' },
      { value: 'nordland', label: 'Nordland' },
    ],
    'se': [
      { value: 'stockholm', label: 'Stockholm' },
      { value: 'gothenburg', label: 'Gothenburg' },
      { value: 'malmo', label: 'Malmö' },
      { value: 'uppsala', label: 'Uppsala' },
      { value: 'västra-götaland', label: 'Västra Götaland' },
      { value: 'skåne', label: 'Skåne' },
      { value: 'östergötland', label: 'Östergötland' },
    ],
    'dk': [
      { value: 'copenhagen', label: 'Copenhagen' },
      { value: 'aarhus', label: 'Aarhus' },
      { value: 'odense', label: 'Odense' },
      { value: 'aalborg', label: 'Aalborg' },
      { value: 'esbjerg', label: 'Esbjerg' },
    ],
    'fi': [
      { value: 'helsinki', label: 'Helsinki' },
      { value: 'tampere', label: 'Tampere' },
      { value: 'turku', label: 'Turku' },
      { value: 'oulu', label: 'Oulu' },
    ],
    'us': [
      { value: 'new-york', label: 'New York' },
      { value: 'california', label: 'California' },
      { value: 'texas', label: 'Texas' },
      { value: 'florida', label: 'Florida' },
      { value: 'illinois', label: 'Illinois' },
    ],
    'uk': [
      { value: 'london', label: 'London' },
      { value: 'manchester', label: 'Manchester' },
      { value: 'birmingham', label: 'Birmingham' },
      { value: 'glasgow', label: 'Glasgow' },
      { value: 'liverpool', label: 'Liverpool' },
    ],
    'de': [
      { value: 'berlin', label: 'Berlin' },
      { value: 'hamburg', label: 'Hamburg' },
      { value: 'munich', label: 'Munich' },
      { value: 'cologne', label: 'Cologne' },
      { value: 'frankfurt', label: 'Frankfurt' },
    ],
    'fr': [
      { value: 'paris', label: 'Paris' },
      { value: 'marseille', label: 'Marseille' },
      { value: 'lyon', label: 'Lyon' },
      { value: 'toulouse', label: 'Toulouse' },
      { value: 'nice', label: 'Nice' },
    ],
    'ca': [
      { value: 'ontario', label: 'Ontario' },
      { value: 'quebec', label: 'Quebec' },
      { value: 'british-columbia', label: 'British Columbia' },
      { value: 'alberta', label: 'Alberta' },
      { value: 'manitoba', label: 'Manitoba' },
    ],
    'au': [
      { value: 'new-south-wales', label: 'New South Wales' },
      { value: 'victoria', label: 'Victoria' },
      { value: 'queensland', label: 'Queensland' },
      { value: 'western-australia', label: 'Western Australia' },
      { value: 'south-australia', label: 'South Australia' },
    ],
    'nl': [
      { value: 'north-holland', label: 'North Holland' },
      { value: 'south-holland', label: 'South Holland' },
      { value: 'utrecht', label: 'Utrecht' },
      { value: 'gelderland', label: 'Gelderland' },
      { value: 'north-brabant', label: 'North Brabant' },
    ],
    'be': [
      { value: 'flanders', label: 'Flanders' },
      { value: 'wallonia', label: 'Wallonia' },
      { value: 'brussels', label: 'Brussels' },
    ],
    'es': [
      { value: 'madrid', label: 'Madrid' },
      { value: 'catalonia', label: 'Catalonia' },
      { value: 'andalusia', label: 'Andalusia' },
      { value: 'valencia', label: 'Valencia' },
      { value: 'basque-country', label: 'Basque Country' },
    ],
    'it': [
      { value: 'lazio', label: 'Lazio' },
      { value: 'lombardy', label: 'Lombardy' },
      { value: 'campania', label: 'Campania' },
      { value: 'sicily', label: 'Sicily' },
      { value: 'veneto', label: 'Veneto' },
    ],
  };
  
  // Utility function to get countries as Select options
  export const getCountryOptions = () => [
    { value: '', label: 'All Countries' },
    ...COUNTRIES.map(country => ({ 
      value: country.value, 
      label: country.label 
    }))
  ];
  
  // Utility function to get region options for a specific country
  export const getRegionOptions = (countryCode: string) => {
    const regions = REGIONS[countryCode] || [];
    return [
      { value: '', label: 'All Regions' },
      ...regions
    ];
  };