import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { format, formatDistanceToNow } from 'date-fns';
import { Conversation, ConversationWithParticipants } from '@/types/message';
import { Business, User } from '@/types';
import { getUser, getBusiness } from '@/lib/firebase/db';

interface ConversationListProps {
  conversations: Conversation[];
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations }) => {
  const { user } = useAuth();
  const [conversationsWithDetails, setConversationsWithDetails] = useState<ConversationWithParticipants[]>([]);
  
  useEffect(() => {
    const fetchParticipantDetails = async () => {
      try {
        const conversationsWithParticipants = await Promise.all(
          conversations.map(async (conversation) => {
            // Get participants excluding current user
            const otherParticipantIds = conversation.participants.filter(
              (participantId) => participantId !== user?.uid
            );
            
            // Fetch participant details
            const participantDetails = await Promise.all(
              otherParticipantIds.map(async (participantId) => {
                try {
                  // First try to get as business
                  let participant: Business | User | null = await getBusiness(participantId);
                  
                  // If not a business, try to get as user
                  if (!participant) {
                    participant = await getUser(participantId);
                  }
                  
                  return participant;
                } catch {
                  // Removed unused 'error' parameter
                  return null;
                }
              })
            );
            
            // Filter out any null participants (in case fetch failed)
            const validParticipants = participantDetails.filter(Boolean) as (User | Business)[];
            
            return {
              ...conversation,
              participantDetails: validParticipants,
              otherParticipant: validParticipants[0], // For 1-to-1 conversations
            };
          })
        );
        
        setConversationsWithDetails(conversationsWithParticipants);
      } catch {
        // Removed unused 'error' parameter
        // Silently handle errors or add error handling as needed
      }
    };
    
    if (conversations.length > 0 && user) {
      fetchParticipantDetails();
    }
  }, [conversations, user]);
  
  // Format timestamp to relative time (e.g., "2 hours ago")
  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate();
      const now = new Date();
      
      // If the message is from today, show time
      if (date.toDateString() === now.toDateString()) {
        return format(date, 'h:mm a');
      }
      
      // If within the last week, show relative time
      if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
        return formatDistanceToNow(date, { addSuffix: true });
      }
      
      // Otherwise show date
      return format(date, 'MMM d');
    } catch {
      return '';
    }
  };
  
  return (
    <div className="divide-y divide-gray-200">
      {conversationsWithDetails.map((conversation) => {
        const otherParticipant = conversation.otherParticipant;
        const unreadCount = conversation.unreadCount[user?.uid || ''] || 0;
        
        return (
          <Link
            key={conversation.id}
            href={`/messages/${conversation.id}`}
            className="block hover:bg-gray-50"
          >
            <div className="flex items-center py-4 px-2">
              {/* Participant Avatar */}
              <div className="flex-shrink-0 mr-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {otherParticipant && 'logoUrl' in otherParticipant && otherParticipant.logoUrl ? (
                    <Image
                      src={otherParticipant.logoUrl}
                      alt={otherParticipant.name}
                      fill
                      className="object-cover"
                    />
                  ) : otherParticipant && 'photoURL' in otherParticipant && otherParticipant.photoURL ? (
                    <Image
                      src={otherParticipant.photoURL}
                      alt={`${otherParticipant.firstName} ${otherParticipant.lastName}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 font-semibold">
                      {otherParticipant && 'name' in otherParticipant
                        ? otherParticipant.name.charAt(0)
                        : otherParticipant && 'firstName' in otherParticipant
                        ? otherParticipant.firstName.charAt(0)
                        : '?'}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Conversation Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {otherParticipant && 'name' in otherParticipant
                      ? otherParticipant.name
                      : otherParticipant && 'firstName' in otherParticipant
                      ? `${otherParticipant.firstName} ${otherParticipant.lastName || ''}`
                      : 'Unknown Participant'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatMessageTime(conversation.lastMessage.createdAt)}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-sm truncate ${unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                    {conversation.lastMessage.hasAttachment ? (
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        Attachment
                      </span>
                    ) : (
                      conversation.lastMessage.text
                    )}
                  </p>
                  
                  {unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ConversationList;