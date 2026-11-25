import {
  Film,
  Heart,
  Home,
  MessageSquare,
  PlusCircle,
  Search,
  User,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  matchPrefix?: string;
  isAction?: boolean;
}

// Only real, existing routes in the project
export const navigationItems: NavigationItem[] = [
  { href: '/', label: 'Home', icon: Home, exact: true },
  { href: '/reels', label: 'Reels', icon: Film, matchPrefix: '/reels' },
  { href: '/chats', label: 'Messages', icon: MessageSquare, matchPrefix: '/chats' },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/notifications', label: 'Notifications', icon: Heart, matchPrefix: '/notifications' },
  { href: '/sell', label: 'Create', icon: PlusCircle, isAction: true },
  { href: '/profile/me', label: 'Profile', icon: User, matchPrefix: '/profile' },
];

export const bottomNavItems: NavigationItem[] = [
  { href: '/', label: 'Home', icon: Home, exact: true },
  { href: '/search', label: 'Explore', icon: Search },
  { href: '/sell', label: 'Sell', icon: PlusCircle, isAction: true },
  { href: '/chats', label: 'Chats', icon: MessageSquare, matchPrefix: '/chats' },
  { href: '/profile/me', label: 'Account', icon: User, matchPrefix: '/profile' },
];

export function resolveNavItemHref(
  item: NavigationItem,
  user: { id?: string } | null | undefined,
  isAuthenticated: boolean
): string {
  if (item.matchPrefix === '/profile' || item.label === 'Profile' || item.label === 'Account') {
    return isAuthenticated ? `/profile/${user?.id || 'me'}` : '/login';
  }
  return item.href;
}

export function isItemActive(pathname: string, item: NavigationItem): boolean {
  if (item.exact) {
    return pathname === item.href;
  }
  if (item.matchPrefix) {
    return pathname.startsWith(item.matchPrefix) || pathname === item.href;
  }
  return pathname.startsWith(item.href);
}
