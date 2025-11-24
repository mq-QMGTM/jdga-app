// Membership and Guest Management Types

export interface UserMembership {
  id: string;
  courseId: string;
  courseName: string;
  clubName: string;
  memberSince: string; // ISO date
  memberNumber?: string;
  membershipType?: string; // e.g., "Full", "Social", "Junior", etc.

  // Regular playing partners at this club
  regularPlayingPartners: string[]; // Contact IDs

  // Guest history - people user has brought as guests
  guestHistory: GuestRecord[];

  // Sponsored guests - people authorized to play in user's name without user present
  sponsoredGuests: SponsoredGuest[];

  // Notes
  notes?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface GuestRecord {
  id: string;
  contactId?: string; // If they're a saved contact
  guestName: string; // Always have name even if not a contact
  date: string;
  playedWithUser: boolean; // Did user play with them or just sponsor them
  notes?: string;
}

export interface SponsoredGuest {
  id: string;
  contactId?: string;
  guestName: string;
  authorizedDate: string;
  expirationDate?: string; // Some clubs have time limits on sponsorships
  timesUsed: number;
  lastUsedDate?: string;
  isActive: boolean;
  notes?: string;
}

// Summary stats for a membership
export interface MembershipStats {
  totalGuestsHosted: number;
  uniqueGuestsHosted: number;
  totalSponsoredGuests: number;
  activeSponsoredGuests: number;
}

// Calculate membership stats
export function calculateMembershipStats(membership: UserMembership): MembershipStats {
  const uniqueGuests = new Set(membership.guestHistory.map((g) => g.guestName));

  return {
    totalGuestsHosted: membership.guestHistory.length,
    uniqueGuestsHosted: uniqueGuests.size,
    totalSponsoredGuests: membership.sponsoredGuests.length,
    activeSponsoredGuests: membership.sponsoredGuests.filter((g) => g.isActive).length,
  };
}
