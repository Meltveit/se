import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Link from 'next/link';
import SubtleAdPlacement from '@/components/common/SubtleAdPlacement';

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-700">About B2B Social</h1>
          
          <Card className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              B2B Social is a dedicated platform designed to help businesses connect, collaborate, and grow together. 
              We believe in the power of business networking and aim to create a space where companies can find 
              partners, clients, and opportunities in a professional digital environment.
            </p>
            <p className="text-gray-700">
              Our goal is to simplify B2B connections and foster meaningful business relationships that drive 
              growth and innovation across industries.
            </p>
          </Card>
          
          <Card className="mb-10">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Create Your Profile</h3>
                <p className="text-gray-600">Register your business and complete your profile to showcase your products and services.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Connect With Businesses</h3>
                <p className="text-gray-600">Find and follow other businesses that align with your interests and needs.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Collaborate & Grow</h3>
                <p className="text-gray-600">Share updates, message other businesses, and find new opportunities for collaboration.</p>
              </div>
            </div>
          </Card>
          
          <SubtleAdPlacement type="content-bottom" />
          
          <Card className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Benefits for Businesses</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700"><strong>Enhanced Visibility:</strong> Create a comprehensive profile to showcase your business to potential partners and clients.</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700"><strong>Networking Opportunities:</strong> Connect with businesses in your industry or complementary sectors to explore partnerships.</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700"><strong>Content Sharing:</strong> Share news, updates, and insights to establish your business as an industry thought leader.</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700"><strong>Geographic Discovery:</strong> Use our map feature to find businesses in specific locations for regional partnerships.</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700"><strong>Direct Communication:</strong> Message potential partners directly through our secure messaging system.</span>
              </li>
            </ul>
          </Card>
          
          <Card className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              We're always looking to improve our platform and welcome your feedback and suggestions.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Email:</strong> <a href="mailto:support@b2bsocial.org" className="text-blue-600 hover:underline">support@b2bsocial.org</a>
            </p>
            <p className="text-gray-700">
              <strong>Address:</strong><br />
              B2B Social<br />
              Lensmannslia 4<br />
              Asker, Norway 1386
            </p>
          </Card>
          
          <div className="text-center mt-8">
            <Link href="/register/business">
              <Button size="lg">
                Join B2B Social Today
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}