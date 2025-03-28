import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { sendMessage } from '@/lib/firebase/db';
import { uploadMessageAttachment } from '@/lib/firebase/storage';
import Button from '@/components/common/Button';

// Remove unused import
// import FileUpload, { FileUploadRef } from '@/components/common/FileUpload';

// Define the attachment object type
interface AttachmentObject {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface MessageFormProps {
  conversationId: string;
  onMessageSent?: (message: string, attachments?: File[]) => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ 
  conversationId, 
  onMessageSent 
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Handle file selection
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Remove an attachment
  const handleRemoveAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !conversationId) return;
    if (!message.trim() && attachments.length === 0) return;
    
    try {
      setIsSending(true);
      
      // Upload attachments if any
      let attachmentObjects: AttachmentObject[] = [];
      if (attachments.length > 0) {
        setIsUploading(true);
        
        // Upload each attachment
        const uploadPromises = attachments.map(async (file, index) => {
          const attachmentUrl = await uploadMessageAttachment(
            conversationId,
            file,
            index
          );
          
          return {
            id: `${Date.now()}-${index}`,
            name: file.name,
            type: file.type,
            size: file.size,
            url: attachmentUrl,
          };
        });
        
        attachmentObjects = await Promise.all(uploadPromises);
      }
      
      // Send message to Firestore
      await sendMessage({
        conversationId,
        text: message.trim(),
        senderId: user.uid,
        attachments: attachmentObjects,
      });
      
      // Clear form
      setMessage('');
      setAttachments([]);
      
      // Focus back on textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      
      // Notify parent component
      if (onMessageSent) {
        onMessageSent(message, attachments);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setIsSending(false);
      setIsUploading(false);
    }
  };
  
  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };
  
  // Handle Enter key to submit (with Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <div>
      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-gray-500"
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
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(index)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Message Form */}
      <form onSubmit={handleSubmit} className="flex items-end">
        <div className="flex-grow">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[40px] max-h-[120px]"
            rows={1}
            disabled={isSending}
          />
        </div>
        
        <div className="flex ml-2">
          {/* Attachment Button */}
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAttachmentChange}
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            </button>
          </div>
          
          {/* Send Button */}
          <Button
            type="submit"
            disabled={isSending || (message.trim() === '' && attachments.length === 0)}
            isLoading={isSending}
            className="ml-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </Button>
        </div>
      </form>
      
      {isUploading && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="bg-blue-600 h-1 rounded-full animate-pulse"></div>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-center">Uploading attachments...</div>
        </div>
      )}
    </div>
  );
};

export default MessageForm;