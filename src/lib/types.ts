export interface User {
  id: string;
  email: string;
  name: string;
  walletAddress: string;
  avatar?: string;
  role: "attendee" | "host" | "admin";
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  locationType: "physical" | "virtual";
  bannerImage: string;
  hostId: string;
  hostName: string;
  maxAttendees: number;
  registeredCount: number;
  registrationType: "free" | "paid" | "invite-only";
  price?: number;
  poapEnabled: boolean;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  contractAddress?: string;
  createdAt: Date;
  category: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: Date;
  eventLocation: string;
  eventBanner: string;
  ownerId: string;
  ownerWallet: string;
  tokenId: string;
  isUsed: boolean;
  qrCode: string;
  mintedAt: Date;
  transferable: boolean;
}

export interface POAP {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: Date;
  eventLocation: string;
  ownerId: string;
  ownerWallet: string;
  tokenId: string;
  role: "attendee" | "speaker" | "volunteer";
  mintedAt: Date;
  image: string;
  hostName: string;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  userWallet: string;
  userName: string;
  checkedIn: boolean;
  checkedInAt?: Date;
  registeredAt: Date;
}
