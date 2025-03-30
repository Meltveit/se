// src/app/messages/[conversationId]/page.tsx
import { ConversationPage } from './ConversationPage';

// Add this function to generate static parameters for build
export function generateStaticParams() {
  // For static export with output: export, we need to provide at least one param
  // This creates a placeholder static page that will be populated client-side
  return [
    { conversationId: 'placeholder' }
  ];
}

// This server component handles the page loading and client component rendering
export default function ConversationPageWrapper() {
  return <ConversationPage />;
}