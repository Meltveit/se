// src/components/messages/MessageThread.tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { User, Business } from '@/types';
import { getUser, getBusiness } from '@/lib/firebase/db';

// Type guard to check object type
function isBusiness(obj: any): obj is Business {
  return obj && 'name' in obj && 'orgNumber' in obj;
}

function isUser(obj: any): obj is User {
  return obj && 'firstName' in obj && 'email' in obj;
}

// Define a message interface that matches what we're working with
interface ThreadMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text?: string; // Make text optional
  attachments?: any[];
  read: boolean;
  readAt?: any;
  createdAt: any;
}

interface MessageThreadProps {
  messages: ThreadMessage[];
  currentUserId: string;
}

const MessageThread: React.FC<MessageThreadProps> = ({ messages, currentUserId }) => {
  const [userCache, setUserCache] = useState<{ [userId: string]: User | Business | null }>({});
  
  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = message.createdAt.toDate();
    const dateString = format(date, 'yyyy-MM-dd');
    
    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    
    groups[dateString].push(message);
    return groups;
  }, {} as { [date: string]: ThreadMessage[] });
  
  // Get unique sender IDs from messages
  useEffect(() => {
    const fetchUsers = async () => {
      // Use Array.from() to convert Set to Array to avoid Set-iteration errors
      const senderIds = Array.from(new Set(messages.map((message) => message.senderId)));
      
      const userPromises = senderIds.map(async (senderId) => {
        // Skip if already in cache
        if (userCache[senderId] !== undefined) return null;
        
        try {
          // First try to get as business
          let sender: User | Business | null = await getBusiness(senderId);
          
          // If not a business, try to get as user
          if (!sender) {
            sender = await getUser(senderId);
          }
          
          return { id: senderId, data: sender };
        } catch (error) {
          console.error(`Error fetching user ${senderId}:`, error);
          return { id: senderId, data: null };
        }
      });
      
      const results = await Promise.all(userPromises);
      const newCache = { ...userCache };
      
      results.forEach((result) => {
        if (result) {
          newCache[result.id] = result.data;
        }
      });
      
      setUserCache(newCache);
    };
    
    fetchUsers();
  }, [messages, userCache]);
  
  // Format time (e.g., "2:30 PM")
  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };
  
  // Format date (e.g., "Today", "Yesterday", or "May 5, 2023")
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  };
  
  // Get display name for a user
  const getDisplayName = (userId: string) => {
    const user = userCache[userId];
    
    if (!user) {
      return 'Unknown User';
    }
    
    if (isBusiness(user)) {
      return user.name;
    } else if (isUser(user)) {
      return `${user.firstName} ${user.lastName || ''}`;
    }
    
    return 'Unknown User';
  };
  
  return (
    <div className="space-y-6">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
              {formatMessageDate(date)}
            </div>
          </div>
          
          <div className="space-y-4">
            {dateMessages.map((message) => {
              const isCurrentUser = message.senderId === currentUserId;
              const sender = userCache[message.senderId];
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-xs md:max-w-md ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar (for other users, not current user) */}
                    {!isCurrentUser && (
                      <div className="flex-shrink-0 mr-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {sender && isBusiness(sender) && sender.logoUrl ? (
                            <Image
                              src={sender.logoUrl}
                              alt={getDisplayName(message.senderId)}
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          ) : sender && isUser(sender) && sender.photoURL ? (
                            <Image
                              src={sender.photoURL}
                              alt={getDisplayName(message.senderId)}
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-xs font-semibold">
                              {getDisplayName(message.senderId).charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Message Content */}
                    <div>
                      {!isCurrentUser && (
                        <div className="text-xs text-gray-500 mb-1 ml-1">
                          {getDisplayName(message.senderId)}
                        </div>
                      )}
                      
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          isCurrentUser
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">{message.text}</div>
                        
                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className={`px-3 py-2 rounded ${
                                  isCurrentUser ? 'bg-blue-700' : 'bg-gray-200'
                                }`}
                              >
                                <a
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center ${
                                    isCurrentUser ? 'text-blue-100' : 'text-blue-600'
                                  } hover:underline`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                    />
                                  </svg>
                                  <span className="text-sm">{attachment.name}</span>
                                </a>
                                <div className="text-xs mt-1">
                                  {(attachment.size / 1024).toFixed(1)} KB
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'}`}>
                          {formatTime(message.createdAt.toDate())}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {messages.length === 0 && (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500 text-center">
            No messages yet. Start the conversation by sending a message below.
          </p>
        </div>
      )}
    </div>
  );
};

export default MessageThread;