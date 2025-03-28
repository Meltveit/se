'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getConversations } from '@/lib/firebase/messaging';
import { Conversation } from '@/types/message';
import MainLayout from '@/components/layout/MainLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConversationList from '@/components/messages/ConversationList';

export default function MessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations when component mounts
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userConversations = await getConversations(user.uid);
        setConversations(userConversations);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  // Handle loading state
  if (loading) {
    return (
      <AuthGuard requireAuth>
        <MainLayout>
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </MainLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <Button onClick={() => router.push('/messages/new')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Message
            </Button>
          </div>

          <Card>
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-16 w-16 mx-auto text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1" 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No conversations yet</h3>
                <p className="mt-2 text-sm text-gray-500">Start a new conversation to connect with businesses</p>
                <div className="mt-6">
                  <Button onClick={() => router.push('/messages/new')}>
                    Send a Message
                  </Button>
                </div>
              </div>
            ) : (
              <ConversationList conversations={conversations} />
            )}
          </Card>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}