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
    { value: 'food&beverage', label: 'Food & Beverage' },
    { value: 'distribution', label: 'Distribution & Supply Chain' },
    { value: 'startup', label: 'Startups & Innovation' },
    { value: 'nonprofit', label: 'Non-profit & NGO' },
    { value: 'production', label: 'Production & Manufacturing' },
    { value: 'creative', label: 'Creative Industries' },
    { value: 'other', label: 'Other' }
];
  
// Define a type for the tag structure to resolve the TypeScript error
export type TagCategory = 'technology' | 'finance' | 'healthcare' | 'education' | 
    'retail' | 'manufacturing' | 'services' | 'construction' | 
    'media' | 'hospitality' | 'transportation' | 'energy' | 
    'agriculture' | 'foodBeverage' | 'distribution' | 'startup' |
    'nonprofit' | 'production' | 'creative' | 'other';

export type TagItem = { value: string; label: string };

export const TAGS: Record<TagCategory, TagItem[]> = {
    technology: [
      { value: 'software-development', label: 'Software Development' },
      { value: 'web-design', label: 'Web Design' },
      { value: 'mobile-apps', label: 'Mobile Apps' },
      { value: 'cloud-services', label: 'Cloud Services' },
      { value: 'cybersecurity', label: 'Cybersecurity' },
      { value: 'it-consulting', label: 'IT Consulting' },
      { value: 'data-analytics', label: 'Data Analytics' },
      { value: 'artificial-intelligence', label: 'Artificial Intelligence' },
      { value: 'virtual-reality', label: 'Virtual Reality' },
      { value: 'internet-of-things', label: 'Internet of Things' },
    ],
    finance: [
      { value: 'banking', label: 'Banking' },
      { value: 'insurance', label: 'Insurance' },
      { value: 'investments', label: 'Investments' },
      { value: 'accounting', label: 'Accounting' },
      { value: 'fintech', label: 'Financial Technology' },
      { value: 'wealth-management', label: 'Wealth Management' },
      { value: 'risk-management', label: 'Risk Management' },
      { value: 'credit-services', label: 'Credit Services' },
      { value: 'payment-processing', label: 'Payment Processing' },
      { value: 'financial-planning', label: 'Financial Planning' },
    ],
    healthcare: [
      { value: 'medical-services', label: 'Medical Services' },
      { value: 'pharmaceuticals', label: 'Pharmaceuticals' },
      { value: 'healthcare-it', label: 'Healthcare IT' },
      { value: 'medical-devices', label: 'Medical Devices' },
      { value: 'biotechnology', label: 'Biotechnology' },
      { value: 'telemedicine', label: 'Telemedicine' },
      { value: 'nursing', label: 'Nursing' },
      { value: 'mental-health', label: 'Mental Health' },
      { value: 'alternative-medicine', label: 'Alternative Medicine' },
      { value: 'medical-research', label: 'Medical Research' },
    ],
    education: [
      { value: 'schools', label: 'Schools' },
      { value: 'online-learning', label: 'Online Learning' },
      { value: 'professional-training', label: 'Professional Training' },
      { value: 'tutoring', label: 'Tutoring' },
      { value: 'education-technology', label: 'Education Technology' },
      { value: 'language-learning', label: 'Language Learning' },
      { value: 'test-preparation', label: 'Test Preparation' },
      { value: 'special-education', label: 'Special Education' },
      { value: 'early-childhood-education', label: 'Early Childhood Education' },
      { value: 'study-abroad', label: 'Study Abroad' },
    ],
    retail: [
      { value: 'e-commerce', label: 'E-commerce' },
      { value: 'brick-and-mortar', label: 'Brick and Mortar' },
      { value: 'fashion', label: 'Fashion' },
      { value: 'consumer-electronics', label: 'Consumer Electronics' },
      { value: 'home-improvement', label: 'Home Improvement' },
      { value: 'beauty-cosmetics', label: 'Beauty & Cosmetics' },
      { value: 'sporting-goods', label: 'Sporting Goods' },
      { value: 'gifts-novelty', label: 'Gifts & Novelty' },
      { value: 'toys-games', label: 'Toys & Games' },
      { value: 'auto-parts', label: 'Auto Parts' },
    ],
    manufacturing: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'automotive', label: 'Automotive' },
      { value: 'industrial-equipment', label: 'Industrial Equipment' },
      { value: 'chemicals', label: 'Chemicals' },
      { value: 'plastics', label: 'Plastics' },
      { value: 'textiles', label: 'Textiles' },
      { value: 'food-processing', label: 'Food Processing' },
      { value: 'metal-fabrication', label: 'Metal Fabrication' },
      { value: 'packaging', label: 'Packaging' },
      { value: 'pharmaceuticals', label: 'Pharmaceuticals' },
    ],
    services: [
      { value: 'consulting', label: 'Consulting' },
      { value: 'legal-services', label: 'Legal Services' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'accounting', label: 'Accounting' },
      { value: 'human-resources', label: 'Human Resources' },
      { value: 'public-relations', label: 'Public Relations' },
      { value: 'event-planning', label: 'Event Planning' },
      { value: 'translation', label: 'Translation' },
      { value: 'security', label: 'Security' },
      { value: 'photography', label: 'Photography' },
    ],
    construction: [
      { value: 'residential', label: 'Residential' },
      { value: 'commercial', label: 'Commercial' },
      { value: 'architecture', label: 'Architecture' },
      { value: 'engineering', label: 'Engineering' },
      { value: 'landscaping', label: 'Landscaping' },
      { value: 'interior-design', label: 'Interior Design' },
      { value: 'roofing', label: 'Roofing' },
      { value: 'electrical', label: 'Electrical' },
      { value: 'plumbing', label: 'Plumbing' },
      { value: 'hvac', label: 'HVAC' },
    ],
    media: [
      { value: 'advertising', label: 'Advertising' },
      { value: 'digital-media', label: 'Digital Media' },
      { value: 'entertainment', label: 'Entertainment' },
      { value: 'publishing', label: 'Publishing' },
      { value: 'broadcasting', label: 'Broadcasting' },
      { value: 'film-production', label: 'Film Production' },
      { value: 'music-production', label: 'Music Production' },
      { value: 'graphic-design', label: 'Graphic Design' },
      { value: 'video-games', label: 'Video Games' },
      { value: 'social-media', label: 'Social Media' },
    ],
    hospitality: [
      { value: 'hotels', label: 'Hotels' },
      { value: 'restaurants', label: 'Restaurants' },
      { value: 'tourism', label: 'Tourism' },
      { value: 'event-venues', label: 'Event Venues' },
      { value: 'theme-parks', label: 'Theme Parks' },
      { value: 'cruise-lines', label: 'Cruise Lines' },
      { value: 'catering', label: 'Catering' },
      { value: 'bed-breakfasts', label: 'Bed & Breakfasts' },
      { value: 'nightclubs', label: 'Nightclubs' },
      { value: 'casinos', label: 'Casinos' },
    ],
    transportation: [
      { value: 'logistics', label: 'Logistics' },
      { value: 'shipping', label: 'Shipping' },
      { value: 'trucking', label: 'Trucking' },
      { value: 'airlines', label: 'Airlines' },
      { value: 'public-transit', label: 'Public Transit' },
      { value: 'car-rental', label: 'Car Rental' },
      { value: 'taxi-services', label: 'Taxi Services' },
      { value: 'delivery-services', label: 'Delivery Services' },
      { value: 'freight-forwarding', label: 'Freight Forwarding' },
      { value: 'moving-companies', label: 'Moving Companies' },
    ],
    energy: [
      { value: 'renewable-energy', label: 'Renewable Energy' },
      { value: 'oil-gas', label: 'Oil & Gas' },
      { value: 'utilities', label: 'Utilities' },
      { value: 'energy-efficiency', label: 'Energy Efficiency' },
      { value: 'solar-power', label: 'Solar Power' },
      { value: 'wind-power', label: 'Wind Power' },
      { value: 'hydropower', label: 'Hydropower' },
      { value: 'nuclear-power', label: 'Nuclear Power' },
      { value: 'energy-storage', label: 'Energy Storage' },
      { value: 'smart-grid', label: 'Smart Grid' },
    ],
    agriculture: [
      { value: 'farming', label: 'Farming' },
      { value: 'agritech', label: 'Agricultural Technology' },
      { value: 'forestry', label: 'Forestry' },
      { value: 'horticulture', label: 'Horticulture' },
      { value: 'organic-farming', label: 'Organic Farming' },
      { value: 'aquaculture', label: 'Aquaculture' },
      { value: 'livestock', label: 'Livestock' },
      { value: 'cannabis-cultivation', label: 'Cannabis Cultivation' },
      { value: 'precision-agriculture', label: 'Precision Agriculture' },
      { value: 'vertical-farming', label: 'Vertical Farming' },
    ],
    foodBeverage: [
      { value: 'restaurants', label: 'Restaurants' },
      { value: 'catering', label: 'Catering' },
      { value: 'food-manufacturing', label: 'Food Manufacturing' },
      { value: 'beverage-manufacturing', label: 'Beverage Manufacturing' },
      { value: 'bakeries', label: 'Bakeries' },
      { value: 'breweries', label: 'Breweries' },
      { value: 'wineries', label: 'Wineries' },
      { value: 'distilleries', label: 'Distilleries' },
      { value: 'food-trucks', label: 'Food Trucks' },
      { value: 'coffee-shops', label: 'Coffee Shops' },
    ],
    distribution: [
      { value: 'wholesale', label: 'Wholesale' },
      { value: 'supply-chain', label: 'Supply Chain' },
      { value: 'import-export', label: 'Import/Export' },
      { value: 'warehousing', label: 'Warehousing' },
      { value: 'inventory-management', label: 'Inventory Management' },
      { value: 'order-fulfillment', label: 'Order Fulfillment' },
      { value: 'product-sourcing', label: 'Product Sourcing' },
      { value: 'freight-brokerage', label: 'Freight Brokerage' },
      { value: 'logistics-consulting', label: 'Logistics Consulting' },
      { value: 'material-handling', label: 'Material Handling' },
    ],
    startup: [
      { value: 'tech-startup', label: 'Tech Startup' },
      { value: 'innovation', label: 'Innovation' },
      { value: 'venture-capital', label: 'Venture Capital' },
      { value: 'accelerators', label: 'Accelerators' },
      { value: 'incubators', label: 'Incubators' },
      { value: 'coworking-spaces', label: 'Coworking Spaces' },
      { value: 'seed-funding', label: 'Seed Funding' },
      { value: 'angel-investors', label: 'Angel Investors' },
      { value: 'startup-consulting', label: 'Startup Consulting' },
      { value: 'pitch-competitions', label: 'Pitch Competitions' },
    ],
    nonprofit: [
      { value: 'charity', label: 'Charity' },
      { value: 'social-enterprise', label: 'Social Enterprise' },
      { value: 'foundations', label: 'Foundations' },
      { value: 'fundraising', label: 'Fundraising' },
      { value: 'volunteer-management', label: 'Volunteer Management' },
      { value: 'grant-writing', label: 'Grant Writing' },
      { value: 'advocacy', label: 'Advocacy' },
      { value: 'community-outreach', label: 'Community Outreach' },
      { value: 'humanitarian-aid', label: 'Humanitarian Aid' },
      { value: 'environmental-conservation', label: 'Environmental Conservation' },
    ],
    production: [
      { value: 'manufacturing', label: 'Manufacturing' },
      { value: 'assembly', label: 'Assembly' },
      { value: 'packaging', label: 'Packaging' },
      { value: 'quality-control', label: 'Quality Control' },
      { value: 'lean-manufacturing', label: 'Lean Manufacturing' },
      { value: 'prototype-development', label: 'Prototype Development' },
      { value: 'contract-manufacturing', label: 'Contract Manufacturing' },
      { value: 'industrial-design', label: 'Industrial Design' },
      { value: 'product-testing', label: 'Product Testing' },
      { value: 'process-optimization', label: 'Process Optimization' },
    ],
    creative: [
      { value: 'design', label: 'Design' },
      { value: 'arts', label: 'Arts' },
      { value: 'crafts', label: 'Crafts' },
      { value: 'fashion-design', label: 'Fashion Design' },
      { value: 'interior-design', label: 'Interior Design' },
      { value: 'graphic-design', label: 'Graphic Design' },
      { value: 'photography', label: 'Photography' },
      { value: 'video-production', label: 'Video Production' },
      { value: 'music-production', label: 'Music Production' },
      { value: 'writing', label: 'Writing' },
    ],
    other: [
      { value: 'sustainable', label: 'Sustainable' },
      { value: 'innovative', label: 'Innovative' },
      { value: 'local-business', label: 'Local Business' },
      { value: 'international', label: 'International' },
      { value: 'b2b', label: 'B2B' },
      { value: 'b2c', label: 'B2C' },
      { value: 'diversity-owned', label: 'Diversity-Owned' },
      { value: 'green-business', label: 'Green Business' },
      { value: 'social-impact', label: 'Social Impact' },
      { value: 'government-contracting', label: 'Government Contracting' },
    ]
  };
  
// Utility function to get tags for a specific category
export const getTagsForCategory = (categoryValue: TagCategory) => {
    return TAGS[categoryValue] || [];
};