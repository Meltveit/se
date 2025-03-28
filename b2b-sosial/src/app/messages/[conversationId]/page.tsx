'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Conversation } from '@/types/message'; 
import { User, Business } from '@/types';
import { getConversation, getMessages, markConversationAsRead, getBusiness, getUser } from '@/lib/firebase/db';
import MessageForm from '@/components/messages/MessageForm';
import MessageThread from '@/components/messages/MessageThread';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import MainLayout from '@/components/layout/MainLayout';
import AuthGuard from '@/components/auth/AuthGuard';

// Create a new interface instead of extending Message
interface ConversationMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string | undefined; // Make text optional
  attachments?: any[];
  read: boolean;
  readAt?: any;
  createdAt: any;
}

export default function ConversationPage() {
  const { conversationId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [otherParticipant, setOtherParticipant] = useState<User | Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch conversation and messages
  useEffect(() => {
    const fetchConversationData = async () => {
      if (!user || !conversationId) return;
      
      try {
        setLoading(true);
        
        // Fetch conversation
        const conversationData = await getConversation(conversationId as string);
        
        if (!conversationData) {
          setError('Conversation not found');
          setLoading(false);
          return;
        }
        
        setConversation(conversationData);
        
        // Mark conversation as read
        await markConversationAsRead(conversationId as string, user.uid);
        
        // Fetch messages
        const messagesData = await getMessages(conversationId as string);
        setMessages(messagesData as ConversationMessage[]); // Cast to ConversationMessage
        
        // Get other participant (assuming 1-on-1 conversation)
        const otherParticipantId = conversationData.participants.find(id => id !== user.uid);
        
        if (otherParticipantId) {
          // First try to get as business
          const businessParticipant = await getBusiness(otherParticipantId);
          
          if (businessParticipant) {
            setOtherParticipant(businessParticipant); // Business found
          } else {
            // If not a business, try to get as user
            const userParticipant = await getUser(otherParticipantId);
            setOtherParticipant(userParticipant); // User or null
          }
        }
      } catch (err) {
        console.error('Error fetching conversation data:', err);
        setError('Failed to load conversation. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversationData();
  }, [user, conversationId]);
  
  // Scroll to bottom of messages when new ones arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Handle sending a new message
  const handleSendMessage = async () => {
    // This will be implemented in the MessageForm component
    if (conversationId) {
      const updatedMessages = await getMessages(conversationId as string);
      setMessages(updatedMessages as ConversationMessage[]);
    }
  };
  
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
  
  if (error || !conversation) {
    return (
      <AuthGuard requireAuth>
        <MainLayout>
          <div className="container mx-auto px-4 py-8">
            <Card>
              <div className="text-center py-8">
                <h2 className="text-xl font-bold text-red-600 mb-4">
                  {error || 'Conversation not found'}
                </h2>
                <p className="text-gray-500 mb-6">
                  {error ? 'An error occurred while loading the conversation.' : 'The conversation you are looking for does not exist or you do not have permission to view it.'}
                </p>
                <Button onClick={() => router.push('/messages')} variant="outline">
                  Back to Messages
                </Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </AuthGuard>
    );
  }
  
  return (
    <AuthGuard requireAuth>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              {/* Conversation Header */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push('/messages')}
                      className="mr-4"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    </Button>
                    
                    <div className="flex items-center">
                      {otherParticipant && (
                        <div className="flex-shrink-0 mr-4">
                          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {'logoUrl' in otherParticipant && otherParticipant.logoUrl ? (
                              <Image
                                src={otherParticipant.logoUrl}
                                alt={otherParticipant.name}
                                fill
                                className="object-cover"
                              />
                            ) : 'photoURL' in otherParticipant && otherParticipant.photoURL ? (
                              <Image
                                src={otherParticipant.photoURL}
                                alt={`${otherParticipant.firstName} ${otherParticipant.lastName}`}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-gray-500 font-semibold">
                                {'name' in otherParticipant
                                  ? otherParticipant.name.charAt(0)
                                  : 'firstName' in otherParticipant
                                  ? otherParticipant.firstName.charAt(0)
                                  : '?'}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">
                          {otherParticipant
                            ? 'name' in otherParticipant
                              ? otherParticipant.name
                              : 'firstName' in otherParticipant
                              ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
                              : 'Unknown Participant'
                            : 'Unknown Participant'}
                        </h2>
                        {conversation.subject && (
                          <p className="text-sm text-gray-500">{conversation.subject}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Archive conversation logic
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      Archive
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Message Thread */}
              <div className="h-96 overflow-y-auto mb-4 px-2">
                <MessageThread 
                  messages={messages.map(msg => ({ ...msg, text: msg.text || '' }))}
                  currentUserId={user?.uid || ''}
                />
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message Input */}
              <div className="border-t border-gray-200 pt-4">
                <MessageForm 
                  conversationId={conversationId as string} 
                  onMessageSent={handleSendMessage} 
                />
              </div>
            </Card>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}