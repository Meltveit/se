// src/components/layout/footer.tsx
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-white font-bold mb-3">B2B ConnectPro</h3>
            <p className="text-sm mb-3">The platform for business networking and collaboration.</p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-3">Platform</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/company/search" className="hover:text-white">Browse Companies</Link></li>
              <li><Link href="/sector" className="hover:text-white">Explore Sectors</Link></li>
              <li><Link href="/posts" className="hover:text-white">Company Posts</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-3">Resources</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/help" className="hover:text-white">Help</Link></li>
              <li><Link href="/api-docs" className="hover:text-white">API Documentation</Link></li>
              <li><Link href="/guides" className="hover:text-white">B2B Guides</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-3">Company</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 text-center md:text-left md:flex md:justify-between">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} B2B ConnectPro. All rights reserved.</p>
          <div className="flex justify-center md:justify-end space-x-4 mt-3 md:mt-0">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">Privacy</Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}