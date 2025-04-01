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
    // ... other regions (unchanged)
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

export const CATEGORIES = [
    { value: 'technology', label: 'Technology & IT' },
    { value: 'finance', label: 'Finance & Banking' },
    { value: 'healthcare', label: 'Healthcare & Medical' },
    { value: 'education', label: 'Education & Training' },
    { value: 'retail', label: 'Retail & E-commerce' },
    { value: 'manufacturing', label: 'Manufacturing & Industry' },
    { value: 'services', label: 'Professional Services' },
    { value: 'construction', label: 'Construction & Real Estate' },
    { value: 'media', label: 'Media & Entertainment' },
    { value: 'hospitality', label: 'Hospitality & Tourism' },
    { value: 'transportation', label: 'Transportation & Logistics' },
    { value: 'energy', label: 'Energy & Utilities' },
    { value: 'agriculture', label: 'Agriculture & Farming' },
    { value: 'nonprofit', label: 'Non-profit & NGO' },
    { value: 'other', label: 'Other' }
];
  
// Define a type for the tag structure to resolve the TypeScript error
export type TagCategory = 'technology' | 'finance' | 'healthcare' | 'education' | 
    'retail' | 'manufacturing' | 'services' | 'construction' | 
    'media' | 'other';

export type TagItem = { value: string; label: string };

export const TAGS: Record<TagCategory, TagItem[]> = {
    technology: [
        { value: 'software-development', label: 'Software Development' },
        { value: 'web-design', label: 'Web Design' },
        { value: 'mobile-apps', label: 'Mobile Apps' },
        { value: 'cloud-services', label: 'Cloud Services' },
        { value: 'cybersecurity', label: 'Cybersecurity' },
        { value: 'it-consulting', label: 'IT Consulting' },
    ],
    finance: [
        { value: 'banking', label: 'Banking' },
        { value: 'insurance', label: 'Insurance' },
        { value: 'investments', label: 'Investments' },
        { value: 'accounting', label: 'Accounting' },
    ],
    healthcare: [
        { value: 'medical-services', label: 'Medical Services' },
        { value: 'pharmaceuticals', label: 'Pharmaceuticals' },
        { value: 'healthcare-it', label: 'Healthcare IT' },
    ],
    education: [
        { value: 'schools', label: 'Schools' },
        { value: 'online-learning', label: 'Online Learning' },
        { value: 'professional-training', label: 'Professional Training' },
    ],
    retail: [
        { value: 'e-commerce', label: 'E-commerce' },
        { value: 'brick-and-mortar', label: 'Brick and Mortar' },
        { value: 'fashion', label: 'Fashion' },
    ],
    manufacturing: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'automotive', label: 'Automotive' },
        { value: 'industrial-equipment', label: 'Industrial Equipment' },
    ],
    services: [
        { value: 'consulting', label: 'Consulting' },
        { value: 'legal-services', label: 'Legal Services' },
        { value: 'marketing', label: 'Marketing' },
    ],
    construction: [
        { value: 'residential', label: 'Residential' },
        { value: 'commercial', label: 'Commercial' },
        { value: 'architecture', label: 'Architecture' },
    ],
    media: [
        { value: 'advertising', label: 'Advertising' },
        { value: 'digital-media', label: 'Digital Media' },
        { value: 'entertainment', label: 'Entertainment' },
    ],
    other: [
        { value: 'sustainable', label: 'Sustainable' },
        { value: 'innovative', label: 'Innovative' },
        { value: 'local-business', label: 'Local Business' },
        { value: 'international', label: 'International' },
        { value: 'b2b', label: 'B2B' },
        { value: 'b2c', label: 'B2C' },
    ]
};
  
// Utility function to get tags for a specific category
export const getTagsForCategory = (categoryValue: TagCategory) => {
    return TAGS[categoryValue] || [];
};