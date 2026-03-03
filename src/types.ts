import { LucideIcon } from 'lucide-react';

export type View = 'login' | 'home' | 'booking' | 'tracking' | 'profile' | 'admin-dashboard' | 'admin-orders' | 'admin-workers';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role?: 'user' | 'admin';
}

export interface Worker {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'off-duty';
  specialty?: string[];
  phone: string;
  completedJobs: number;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'clothes' | 'shoes' | 'fabrics';
}

export interface OrderItem {
  serviceId: string;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'accepted' 
  | 'rejected' 
  | 'assigned' 
  | 'washing' 
  | 'washing_complete' 
  | 'delivery' 
  | 'completed';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  pickupDate: string;
  pickupTime: string;
  address: string;
  createdAt: string;
  assignedWorkerId?: string;
}

export interface OrderAssignment {
  orderId: string;
  workerId: string;
  assignedAt: string;
}

export interface AppState {
  user: User | null;
  currentView: View;
  orders: Order[];
  selectedItems: OrderItem[];
  workers: Worker[];
}