
export type WorkshopType = {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  date: string; // ISO date string
  startTime: string; // ISO datetime string
  endTime: string; // ISO datetime string
  price: number; // 0 = free
  image?: string;
  imageUrl?: string;
  primaryImageUrl?: string;
  capacity?: number;
  category?: WorkshopCategory;
  tags?: string[];
  attendees?: string[];
};

export type FaqItemType = {
  question: string;
  answer: string;
};

export enum Category {
  COFFEE = 'Coffee',
  SAVORY = 'Savory Bites',
  DESSERT = 'Desserts'
}

export enum CoffeeTag {
  STRONG = 'Strong',
  BOLD = 'Bold',
  BEST_SELLER = 'Best Seller',
  COLD = 'Cold'
}

export enum OrderStatus {
  PENDING = 'Pending',
  PREPARING = 'Preparing',
  READY = 'Ready for Pickup',
  COMPLETED = 'Completed'
}

export enum ArtStatus {
  AVAILABLE = 'Available',
  SOLD_OUT = 'Sold Out',
  LIMITED_EDITION = 'Limited Edition'
}

export enum WorkshopCategory {
  BREATHER = 'Breather',
  EXPERT = 'Expert',
  FOUNDATIONS = 'Foundations'
}

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  NEGOTIATION = 'In Negotiation',
  REJECTED = 'Rejected'
}

export interface MenuItem {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  stockStatus: 'In Stock' | 'Out of Stock';
  roastLevel?: string;
  tastingNotes?: string;
  tags: CoffeeTag[] | string[];
  isAvailable?: boolean;
}

export interface Artwork {
  id: string;
  _id?: string;
  title: string;
  artist?: string;
  artistName?: string;
  year: string;
  medium: string;
  dimensions: string;
  price: number;
  status: ArtStatus;
  primaryImageUrl: string;
  hoverImageUrl: string;
  themeColor: string;
  tastingNotes: string;
  description?: string;
  isAvailable?: boolean;
}

export interface Workshop {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date?: string;
  category?: WorkshopCategory;
  price: number;
  capacity?: number;
  attendees?: string[]; // User IDs
  image?: string;
  imageUrl?: string;
  primaryImageUrl?: string;
  tags?: string[];
  tutorId?: string;
  tutorName?: string;
  tutorEmail?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  createdAt?: string;
}
export interface FranchiseLead {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  budgetRange?: string;
  investment?: string;
  message?: string;
  status: LeadStatus;
  userId?: string;
  userName?: string;
  userEmail?: string;
  createdAt?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'Coffee' | 'Workshop' | 'General';
}

export interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  orderHistory: string[]; // Order IDs
  workshopHistory: string[]; // Workshop IDs
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  totalPrice: number;
  pickupTime: string;
  status: OrderStatus;
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrdersToday: number;
  activeBookings: number;
  artInquiries: number;
  isStoreOpen: boolean;
}
export interface Artwork {
  _id?: string;
  id?: string;
  title: string;
  artistName?: string;
  artist?: any; // Can be string ID or populated object
  description?: string;
  year: string;
  medium: string;
  dimensions: string;
  price: number;
  status: ArtStatus;
  primaryImageUrl: string;
  hoverImageUrl?: string;
  themeColor?: string;
  tastingNotes?: string | string[];
}

export enum ArtStatus {
  AVAILABLE = 'Available',
  SOLD_OUT = 'Sold Out',
  COMING_SOON = 'Coming Soon'
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt?: string;
}

export interface MenuItem {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stockStatus: string;
}

export interface Order {
  _id: string;
  user?: { name: string; email: string };
  items: any[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Workshop {
  _id?: string;
  id?: string;
  title: string;
  tutorName: string;
  description: string;
  price: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  primaryImageUrl: string;
}

export interface FranchiseLead {
  _id: string;
  name: string;
  email: string;
  city: string;
  status: 'New' | 'Contacted' | 'In Negotiation' | 'Rejected';
  message?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrdersToday: number;
  activeBookings: number;
  artInquiries: number;
  isStoreOpen: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}