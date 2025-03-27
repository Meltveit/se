'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import MainLayout from '@/components/layout/MainLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { searchBusinesses, searchUsers, createConversation, sendMessage } from '@/lib/firebase/db';
import { User, Business } from '@/types';

export default function NewMessagePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<(User | Business)[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<User | Business | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search for recipients when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const [businesses, users] = await Promise.all([
          searchBusinesses(searchQuery),
          searchUsers(searchQuery)
        ]);
        
        // Combine results, prioritizing businesses
        const combinedResults = [...businesses, ...users];
        setSearchResults(combinedResults);
      } catch (err) {
        console.error('Error searching recipients:', err);
        setError('Failed to search for recipients');
      } finally {
        setIsSearching(false);
      }
    };
    
    const debounceTimeout = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);
  
  // Handle recipient selection
  const handleSelectRecipient = (recipient: User | Business) => {
    setSelectedRecipient(recipient);
    setSearchQuery('');
    setSearchResults([]);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedRecipient) return;
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }
    
    try {
      setIsSending(true);
      
      // Create a new conversation
      const conversationId = await createConversation({
        participants: [user.uid, 'id' in selectedRecipient ? selectedRecipient.id : ''],
        subject: subject.trim() || undefined,
        businessIds: 'name' in selectedRecipient ? [selectedRecipient.id] : undefined,
      });
      
      // Send initial message
      await sendMessage({
        conversationId,
        text: message.trim(),
        senderId: user.uid,
      });
      
      showToast('Message sent successfully', 'success');
      
      // Redirect to the conversation
      router.push(`/messages/${conversationId}`);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      showToast('Failed to send message', 'error');
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <AuthGuard requireAuth>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">New Message</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Start a new conversation with a business or user
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Recipient Selector */}
                <div>
                  <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
                    To:
                  </label>
                  
                  {selectedRecipient ? (
                    <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md">
                      <div className="flex items-center flex-grow">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
                          {'logoUrl' in selectedRecipient && selectedRecipient.logoUrl ? (
                            <Image
                              src={selectedRecipient.logoUrl}
                              alt={selectedRecipient.name}
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          ) : 'photoURL' in selectedRecipient && selectedRecipient.photoURL ? (
                            <Image
                              src={selectedRecipient.photoURL}
                              alt={`${selectedRecipient.firstName} ${selectedRecipient.lastName}`}
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-xs font-semibold">
                              {'name' in selectedRecipient
                                ? selectedRecipient.name.charAt(0)
                                : 'firstName' in selectedRecipient
                                ? selectedRecipient.firstName.charAt(0)
                                : '?'}
                            </span>
                          )}
                        </div>
                        <span className="text-sm">
                          {'name' in selectedRecipient
                            ? selectedRecipient.name
                            : 'firstName' in selectedRecipient
                            ? `${selectedRecipient.firstName} ${selectedRecipient.lastName || ''}`
                            : 'Unknown Recipient'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedRecipient(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Input
                        id="recipient"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for a business or user"
                        fullWidth
                      />
                      
                      {isSearching && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <LoadingSpinner size="sm" />
                        </div>
                      )}
                      
                      {searchResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto">
                          {searchResults.map((result) => (
                            <button
                              key={'id' in result ? result.id : ''}
                              type="button"
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                              onClick={() => handleSelectRecipient(result)}
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
                                  {'logoUrl' in result && result.logoUrl ? (
                                    <Image
                                      src={result.logoUrl}
                                      alt={result.name}
                                      width={32}
                                      height={32}
                                      className="object-cover"
                                    />
                                  ) : 'photoURL' in result && result.photoURL ? (
                                    <Image
                                      src={result.photoURL}
                                      alt={`${result.firstName} ${result.lastName}`}
                                      width={32}
                                      height={32}
                                      className="object-cover"
                                    />
                                  ) : (
                                    <span className="text-xs font-semibold">
                                      {'name' in result
                                        ? result.name.charAt(0)
                                        : 'firstName' in result
                                        ? result.firstName.charAt(0)
                                        : '?'}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <div className="text-sm font-medium">
                                    {'name' in result
                                      ? result.name
                                      : 'firstName' in result
                                      ? `${result.firstName} ${result.lastName || ''}`
                                      : 'Unknown Recipient'}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {'name' in result
                                      ? 'Business'
                                      : 'User'}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Subject (optional) */}
                <Input
                  label="Subject (optional)"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What's this conversation about?"
                  fullWidth
                />
                
                {/* Message */}
                <Textarea
                  label="Message"
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={6}
                  required
                  fullWidth
                />
                
                {/* Error message */}
                {error && (
                  <div className="text-sm text-red-600">{error}</div>
                )}
                
                {/* Submit button */}
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/messages')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSending}
                    disabled={isSending || !selectedRecipient || !message.trim()}
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}