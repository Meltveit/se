// src/lib/categoryIcons.ts
import {
    Computer,
    DollarSign,
    Stethoscope,
    GraduationCap,
    ShoppingCart,
    Factory,
    Briefcase,
    Building2,
    Film,
    Hotel,
    Truck,
    Flame,
    Leaf,
    CupSoda,
    Network,
    Rocket,
    HeartHandshake,
    Cog,
    Palette,
    MoreHorizontal,
    LucideIcon // Importer typen for ikonene
  } from 'lucide-react';
  
  // Definer en type for kategori-ID-ene
  export type CategoryId =
    | 'technology'
    | 'finance'
    | 'healthcare'
    | 'education'
    | 'retail'
    | 'manufacturing'
    | 'services'
    | 'construction'
    | 'media'
    | 'hospitality'
    | 'transportation'
    | 'energy'
    | 'agriculture'
    | 'foodBeverage'
    | 'distribution'
    | 'startup'
    | 'nonprofit'
    | 'production'
    | 'creative'
    | 'other';
  
  // Definer en type for ikon-mappingen
  interface CategoryIcons {
    [key: string]: LucideIcon;
  }
  
  // Definer en type for farge-mappingen
  interface CategoryColors {
    [key: string]: string;
  }
  
  // Eksporter ikonene
  export const categoryIcons: CategoryIcons = {
    technology: Computer,
    finance: DollarSign,
    healthcare: Stethoscope,
    education: GraduationCap,
    retail: ShoppingCart,
    manufacturing: Factory,
    services: Briefcase,
    construction: Building2,
    media: Film,
    hospitality: Hotel,
    transportation: Truck,
    energy: Flame,
    agriculture: Leaf,
    foodBeverage: CupSoda,
    distribution: Network,
    startup: Rocket,
    nonprofit: HeartHandshake,
    production: Cog,
    creative: Palette,
    other: MoreHorizontal
  };
  
  // Eksporter fargene
  export const categoryColors: CategoryColors = {
    technology: 'text-blue-500',
    finance: 'text-green-500',
    healthcare: 'text-red-500',
    education: 'text-yellow-500',
    retail: 'text-purple-500',
    manufacturing: 'text-gray-500',
    services: 'text-indigo-500',
    construction: 'text-orange-500',
    media: 'text-pink-500',
    hospitality: 'text-teal-500',
    transportation: 'text-blue-gray-500',
    energy: 'text-amber-500',
    agriculture: 'text-lime-500',
    foodBeverage: 'text-orange-500',
    distribution: 'text-light-blue-500',
    startup: 'text-fuchsia-500',
    nonprofit: 'text-rose-500',
    production: 'text-cyan-500',
    creative: 'text-violet-500',
    other: 'text-gray-400'
  };