import React from 'react';
import Link from 'next/link';
import { Business } from '@/types';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

interface BusinessContactProps {
  business: Business;
  onSendMessage: () => void;
}

const BusinessContact: React.FC<BusinessContactProps> = ({ business, onSendMessage }) => {
  // Define contact information items
  const contactItems = [
    {
      label: 'Email',
      value: business.email,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
      action: business.email ? `mailto:${business.email}` : null,
    },
    {
      label: 'Phone',
      value: business.phone,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
      ),
      action: business.phone ? `tel:${business.phone}` : null,
    },
    {
      label: 'Website',
      value: business.website,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm-1.968 7c.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556h-3.936c.093 1.414.377 2.649.766 3.556.24.56.499.948.737 1.182.233.23.389.262.465.262z" clipRule="evenodd" />
        </svg>
      ),
      action: business.website ? (business.website.startsWith('http') ? business.website : `https://${business.website}`) : null,
    },
    {
      label: 'Address',
      value: [business.address, business.city, business.postalCode, business.country]
        .filter(Boolean)
        .join(', '),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      ),
      action: null,
    },
  ].filter(item => item.value);

  // Display contact person info if available
  const hasContactPerson = business.contactPerson && (
    business.contactPerson.name || business.contactPerson.email || business.contactPerson.phone
  );

  return (
    <Card title="Contact Information">
      <div className="space-y-6">
        {/* Business Contact Info */}
        <ul className="space-y-4">
          {contactItems.map((item, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                {item.action ? (
                  <a
                    href={item.action}
                    target={item.label === 'Website' ? '_blank' : undefined}
                    rel={item.label === 'Website' ? 'noopener noreferrer' : undefined}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">{item.value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Contact Person Info */}
        {hasContactPerson && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900">Contact Person</h4>
            <div className="mt-2 space-y-2">
              {business.contactPerson.name && (
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Name:</span> {business.contactPerson.name}
                  {business.contactPerson.position && ` (${business.contactPerson.position})`}
                </p>
              )}
              {business.contactPerson.email && (
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Email:</span>{' '}
                  <a href={`mailto:${business.contactPerson.email}`} className="text-blue-600 hover:text-blue-500">
                    {business.contactPerson.email}
                  </a>
                </p>
              )}
              {business.contactPerson.phone && (
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Phone:</span>{' '}
                  <a href={`tel:${business.contactPerson.phone}`} className="text-blue-600 hover:text-blue-500">
                    {business.contactPerson.phone}
                  </a>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4">
          <Button type="button" fullWidth onClick={onSendMessage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Send Message
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BusinessContact;