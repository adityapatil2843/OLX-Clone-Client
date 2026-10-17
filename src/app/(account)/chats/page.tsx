import React from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function ChatsPage() {
  return (
    <PlaceholderPage
      title="Buyer–Seller Chats"
      description="Real-time messaging inbox between prospective buyers and item sellers. Supports product card context, price offers, and location safety guidelines."
      category="account"
      routePath="/chats"
      plannedFeatures={[
        'Conversation list split by Buying and Selling inquiries',
        'Linked listing snapshot pinned to top of conversation thread',
        'Direct "Make an Offer" and "Accept Offer" negotiation workflow',
        'Real-time WebSocket typing indicators, read receipts, and delivery status',
        'Built-in safety warning flags for phone numbers/scam keywords'
      ]}
      quickLinks={[
        { href: '/listing/123', label: 'Sample Listing Context' },
        { href: '/sell', label: 'Post Another Ad' },
        { href: '/favourites', label: 'View Favourites' }
      ]}
    />
  );
}
