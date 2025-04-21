// src/app/about/page.tsx
import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ExternalLink, Users, Building, Globe, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About B2B ConnectPro</h1>
          <p className="text-xl max-w-3xl mx-auto">
            The business networking platform designed to help companies discover, connect, and collaborate with each other.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              We're on a mission to transform how businesses connect and collaborate with each other. 
              Our platform helps companies of all sizes find the right partners, suppliers, and clients 
              to grow their business and succeed in today's interconnected economy.
            </p>
            <div className="flex justify-center">
              <Link href="/register" className="btn btn-primary mr-4">
                Join B2B ConnectPro
              </Link>
              <Link href="/company/search" className="btn btn-secondary">
                Explore Companies
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            What Makes Us Different
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Verified Companies
              </h3>
              <p className="text-gray-600">
                All businesses on our platform are verified to ensure authentic connections and trustworthy partnerships.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Industry-Specific Networking
              </h3>
              <p className="text-gray-600">
                Find partners within your industry or expand into new markets with our sector-based organization.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Global Reach
              </h3>
              <p className="text-gray-600">
                Connect with businesses around the world to expand your market reach and find international partners.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Privacy Focused
              </h3>
              <p className="text-gray-600">
                Your business data is secure with our privacy-first approach and robust security features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              Our Story
            </h2>
            
            <div className="prose lg:prose-lg mx-auto">
              <p>
                B2B ConnectPro was founded in 2023 by a team of entrepreneurs who recognized a significant gap 
                in the business networking landscape. While social platforms for professionals existed, 
                there was no dedicated space for businesses to connect with each other directly.
              </p>
              
              <p>
                We set out to create a platform specifically designed for business-to-business connections, 
                where companies could showcase their offerings, find potential partners, and engage in 
                meaningful collaborations that drive growth.
              </p>
              
              <p>
                Today, B2B ConnectPro serves thousands of businesses across various industries, 
                facilitating connections that lead to successful partnerships, supply chain relationships, 
                and business opportunities for companies of all sizes.
              </p>
              
              <p>
                As we continue to grow, our focus remains on creating the most effective platform for 
                businesses to discover each other, communicate securely, and build lasting professional relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              Have questions about B2B ConnectPro? We'd love to hear from you!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
                <a href="mailto:support@b2bsocial.org" className="text-blue-600 hover:text-blue-800">
                  support@b2bsocial.org
                </a>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Address</h3>
                <p className="text-gray-600">123 Business Avenue<br />San Francisco, CA 94103</p>
              </div>
            </div>
            
            <Link href="/contact" className="btn btn-primary inline-flex items-center">
              Contact Us <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}