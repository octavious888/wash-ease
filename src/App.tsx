import React, { useState, useEffect } from 'react';
import { 
  Home, 
  ShoppingBag, 
  Package, 
  User, 
  Plus, 
  Search, 
  Bell, 
  ChevronRight, 
  Clock, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  MessageSquare, 
  LogOut,
  ChevronLeft,
  Calendar,
  Star,
  ShieldCheck,
  HelpCircle,
  Smartphone,
  LayoutDashboard,
  Users,
  Settings,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { cn } from './lib/utils';
import { View, User as UserType, Order, Service, OrderItem, OrderStatus } from './types';
import { AdminDashboard, OrderManagement, WorkerManagement } from './components/AdminViews';

// Mock Data
const SERVICES: Service[] = [
  { id: '1', name: 'Wash & Fold', price: 5, category: 'clothes', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/95fc0450-b276-45c2-b458-f7c37d514514/service-wash-fold-d31b4386-1772542192467.webp' },
  { id: '2', name: 'Dry Clean', price: 12, category: 'clothes', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/95fc0450-b276-45c2-b458-f7c37d514514/service-dry-clean-ef625f1b-1772542195545.webp' },
  { id: '3', name: 'Shoe Polish', price: 15, category: 'shoes', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/95fc0450-b276-45c2-b458-f7c37d514514/service-shoe-clean-bb1009b1-1772542190603.webp' },
  { id: '4', name: 'Curtains/Linens', price: 20, category: 'fabrics', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/95fc0450-b276-45c2-b458-f7c37d514514/service-fabrics-d46ce06b-1772542190336.webp' },
];

const MOCK_USER: UserType = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex.j@example.com',
  phone: '+1 234 567 8900',
  address: '123 Fresh Lane, Clean City',
  role: 'user'
};

const MOCK_ADMIN: UserType = {
  id: 'a1',
  name: 'Super Admin',
  email: 'admin@freshpress.com',
  phone: '+1 800 123 4567',
  address: 'Headquarters, Suite 101',
  role: 'admin'
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_1',
    userId: 'u1',
    userName: 'Alex Johnson',
    items: [{ serviceId: '1', quantity: 2 }],
    totalPrice: 10,
    status: 'pending',
    pickupDate: 'Oct 25, 2023',
    pickupTime: '10:00 AM - 12:00 PM',
    address: '123 Fresh Lane, Clean City',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ord_2',
    userId: 'u2',
    userName: 'Sarah Miller',
    items: [{ serviceId: '2', quantity: 1 }],
    totalPrice: 12,
    status: 'washing',
    pickupDate: 'Oct 24, 2023',
    pickupTime: '02:00 PM - 04:00 PM',
    address: '456 Bubble Ave, Soft Town',
    createdAt: new Date().toISOString()
  }
];

// --- Components --

const Card = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div onClick={onClick} className={cn("bg-white rounded-2xl p-4 shadow-sm border border-slate-100", className)}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className, disabled }: any) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    outline: "border border-slate-200 text-slate-600 hover:bg-slate-50",
    ghost: "text-slate-500 hover:bg-slate-50"
  };
  return (
    <button 
      disabled={disabled}
      onClick={onClick}
      className={cn("px-4 py-3 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100", variants[variant as keyof typeof variants], className)}
    >
      {children}
    </button>
  );
};

// --- Views --

const LoginView = ({ onLogin }: { onLogin: (role: 'user' | 'admin') => void }) => {
  const [email, setEmail] = useState('');
  
  const handleLogin = () => {
    if (email.toLowerCase().includes('admin')) {
      onLogin('admin');
    } else {
      onLogin('user');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-6 py-12 items-center justify-center">
      <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-200">
        <Package className="text-white w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">FreshPress</h1>
      <p className="text-slate-500 text-center mb-10 max-w-[280px]">Laundry & Dry Cleaning delivered to your doorstep</p>
      
      <div className="w-full space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Email or Phone</label>
          <input 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="hello@example.com (type 'admin' for admin mode)" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" />
        </div>
        <Button className="w-full mt-2" onClick={handleLogin}>Sign In</Button>
        
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-medium">Or continue with</span></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="flex items-center justify-center gap-2"><Smartphone className="w-4 h-4" /> Phone</Button>
          <Button variant="outline" className="flex items-center justify-center gap-2"><User className="w-4 h-4" /> Social</Button>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-slate-500">
        Don't have an account? <span className="text-blue-600 font-semibold cursor-pointer">Sign up</span>
      </p>
    </div>
  );
};

const HomeView = ({ user, setView, activeOrders }: { user: UserType, setView: (v: View) => void, activeOrders: Order[] }) => {
  return (
    <div className="pb-24 pt-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-sm">Welcome back,</p>
          <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
        </div>
        <button className="p-2 bg-slate-100 rounded-full relative">
          <Bell className="w-6 h-6 text-slate-600" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative h-44 rounded-3xl overflow-hidden bg-blue-600 text-white p-6">
        <img src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/95fc0450-b276-45c2-b458-f7c37d514514/hero-banner-ccf35e02-1772542190102.webp" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="banner" />
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <h3 className="text-xl font-bold">30% OFF Summer Sale</h3>
            <p className="text-blue-100 text-sm">On all jacket dry cleaning</p>
          </div>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold w-fit">Claim Offer</button>
        </div>
      </div>

      {/* Services Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Our Services</h3>
          <button className="text-blue-600 text-sm font-medium">See All</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {SERVICES.map(service => (
            <motion.div 
              whileTap={{ scale: 0.98 }}
              key={service.id} 
              onClick={() => setView('booking')}
              className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm"
            >
              <div className="h-28 rounded-xl bg-slate-50 mb-3 overflow-hidden">
                <img src={service.image} className="w-full h-full object-cover" alt={service.name} />
              </div>
              <h4 className="font-bold text-slate-800">{service.name}</h4>
              <p className="text-xs text-slate-500">From ${service.price}/item</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-4">Ongoing Orders</h3>
          <div className="space-y-3">
            {activeOrders.map(order => (
              <Card key={order.id} className="flex items-center gap-4 cursor-pointer" onClick={() => setView('tracking')}>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Package className="text-blue-600 w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">Order #{order.id.slice(0, 5)}</h4>
                  <p className="text-xs text-slate-500">{order.status.charAt(0).toUpperCase() + order.status.slice(1)} \u2022 {order.items.length} items</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const BookingView = ({ setView, addOrder, user }: { setView: (v: View) => void, addOrder: (o: Order) => void, user: UserType }) => {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedDate, setSelectedDate] = useState('Oct 24, 2023');
  const [selectedTime, setSelectedTime] = useState('10:00 AM - 12:00 PM');
  const [address, setAddress] = useState(user.address);

  const addItem = (id: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.serviceId === id);
      if (existing) {
        return prev.map(i => i.serviceId === id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { serviceId: id, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.serviceId === id);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.serviceId === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.serviceId !== id);
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const service = SERVICES.find(s => s.id === item.serviceId);
      return total + (service?.price || 0) * item.quantity;
    }, 0);
  };

  const handleComplete = () => {
    const newOrder: Order = {
      id: 'ord_' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      items: cart,
      totalPrice: calculateTotal(),
      status: 'pending',
      pickupDate: selectedDate,
      pickupTime: selectedTime,
      address: address,
      createdAt: new Date().toISOString()
    };
    addOrder(newOrder);
    toast.success('Order placed successfully!');
    setView('tracking');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 flex items-center gap-4 bg-white border-b sticky top-0 z-20">
        <button onClick={() => step > 1 ? setStep(step - 1) : setView('home')}>
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h2 className="text-xl font-bold text-slate-900">
          {step === 1 ? 'Select Services' : step === 2 ? 'Schedule Pickup' : 'Review & Pay'}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Step 1: Selection */}
        {step === 1 && (
          <>
            <div className="space-y-4">
              {SERVICES.map(service => {
                const cartItem = cart.find(i => i.serviceId === service.id);
                return (
                  <Card key={service.id} className="flex gap-4">
                    <img src={service.image} className="w-20 h-20 rounded-xl object-cover" alt={service.name} />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{service.name}</h4>
                      <p className="text-sm text-slate-500">${service.price}/item</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => removeItem(service.id)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold">-</button>
                        <span className="font-bold text-sm w-4 text-center">{cartItem?.quantity || 0}</span>
                        <button onClick={() => addItem(service.id)} className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">+</button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h5 className="font-bold text-blue-900 text-sm">Professional Care Guarantee</h5>
                  <p className="text-xs text-blue-700 mt-1">Every garment is treated with eco-friendly cleaning agents and meticulous care.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Schedule */}
        {step === 2 && (
          <div className="space-y-6">
            <section>
              <h3 className="font-bold text-slate-800 mb-4">Pickup Date</h3>
              <div className="grid grid-cols-3 gap-3">
                {['Oct 24', 'Oct 25', 'Oct 26'].map(date => (
                  <button 
                    key={date}
                    onClick={() => setSelectedDate(date + ', 2023')}
                    className={cn("p-3 rounded-xl border text-sm text-center transition-all", 
                      selectedDate.includes(date) ? "bg-blue-600 border-blue-600 text-white font-bold" : "bg-white border-slate-100 text-slate-600"
                    )}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-bold text-slate-800 mb-4">Pickup Time</h3>
              <div className="space-y-3">
                {['08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '02:00 PM - 04:00 PM'].map(time => (
                  <button 
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={cn("w-full p-4 rounded-xl border text-sm text-left flex justify-between items-center transition-all", 
                      selectedTime === time ? "bg-blue-600 border-blue-600 text-white font-bold" : "bg-white border-slate-100 text-slate-600"
                    )}
                  >
                    <span>{time}</span>
                    {selectedTime === time && <CheckCircle2 className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-bold text-slate-800 mb-4">Pickup Address</h3>
              <div className="flex items-center gap-3 bg-white p-4 border border-slate-100 rounded-2xl">
                <MapPin className="text-blue-600 w-5 h-5" />
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{address}</p>
                </div>
                <button className="text-blue-600 text-xs font-bold uppercase">Change</button>
              </div>
            </section>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="space-y-6">
            <Card className="divide-y divide-slate-100">
              <div className="pb-4">
                <h4 className="font-bold text-slate-800 mb-3">Order Summary</h4>
                {cart.map(item => {
                  const service = SERVICES.find(s => s.id === item.serviceId);
                  return (
                    <div key={item.serviceId} className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500">{service?.name} x {item.quantity}</span>
                      <span className="font-medium text-slate-800">${(service?.price || 0) * item.quantity}</span>
                    </div>
                  );
                })}
              </div>
              <div className="pt-4 flex justify-between">
                <span className="font-bold text-slate-800">Total</span>
                <span className="font-bold text-blue-600 text-xl">${calculateTotal()}</span>
              </div>
            </Card>

            <section>
              <h3 className="font-bold text-slate-800 mb-4">Payment Method</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-white border-2 border-blue-600 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-slate-100 rounded flex items-center justify-center font-bold text-[8px]">VISA</div>
                    <span className="font-bold text-sm">\u2022\u2022\u2022\u2022 4242</span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl text-slate-500">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5" />
                    <span className="font-bold text-sm">Add New Card</span>
                  </div>
                </button>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="p-4 bg-white border-t space-y-3">
        {step < 3 ? (
          <Button 
            disabled={cart.length === 0} 
            className="w-full" 
            onClick={() => setStep(step + 1)}
          >
            Continue
          </Button>
        ) : (
          <Button className="w-full" onClick={handleComplete}>
            Confirm & Pay ${calculateTotal()}
          </Button>
        )}
      </div>
    </div>
  );
};

const TrackingView = ({ orders, user }: { orders: Order[], user: UserType }) => {
  const userOrders = orders.filter(o => o.userId === user.id);

  if (userOrders.length === 0) return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
        <Package className="w-10 h-10 text-slate-200" />
      </div>
      <h3 className="font-bold text-xl text-slate-900">No active orders</h3>
      <p className="text-slate-500 text-sm">You haven't placed any orders yet. Start your first cleaning today!</p>
    </div>
  );

  const activeOrder = userOrders[0];
  const steps: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'pending', label: 'Order Placed', icon: Calendar },
    { status: 'accepted', label: 'Accepted', icon: CheckCircle2 },
    { status: 'washing', label: 'In Washing', icon: Clock },
    { status: 'delivery', label: 'Out for Delivery', icon: MapPin },
    { status: 'completed', label: 'Delivered', icon: CheckCircle2 },
  ];

  const getStatusIndex = (status: OrderStatus) => {
    if (status === 'rejected') return -1;
    if (status === 'assigned') return 1;
    if (status === 'washing_complete') return 2;
    return steps.findIndex(s => s.status === status);
  };

  const currentStepIdx = getStatusIndex(activeOrder.status);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 mt-2">Active Order</h2>
      
      <Card className="bg-blue-600 text-white border-0 shadow-lg shadow-blue-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">Order ID</p>
            <h3 className="text-lg font-bold">#{activeOrder.id.toUpperCase().slice(0, 8)}</h3>
          </div>
          <div className="bg-blue-500 px-3 py-1 rounded-full text-xs font-bold">
            Estimate: 2 days
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-blue-100 text-xs">Pickup Date</p>
            <p className="font-bold">{activeOrder.pickupDate}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-xs">Pickup Time</p>
            <p className="font-bold">{activeOrder.pickupTime}</p>
          </div>
        </div>
      </Card>

      <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
        {steps.map((step, idx) => {
          const isDone = idx <= currentStepIdx;
          const isCurrent = idx === currentStepIdx;
          return (
            <div key={step.status} className="relative">
              <div className={cn(
                "absolute -left-[2.05rem] w-7 h-7 rounded-full flex items-center justify-center z-10",
                isDone ? "bg-blue-600 text-white" : "bg-white border-2 border-slate-100 text-slate-300"
              )}>
                <step.icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className={cn("font-bold text-sm", isCurrent ? "text-blue-600" : isDone ? "text-slate-800" : "text-slate-400")}>
                  {step.label}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isCurrent ? "Ongoing process" : isDone ? "Completed" : "Waiting"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4">
        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
          <MessageSquare className="w-4 h-4" /> Chat with Staff
        </Button>
      </div>
    </div>
  );
};

const ProfileView = ({ user, onLogout }: { user: UserType, onLogout: () => void }) => {
  const menuItems = [
    { icon: User, label: 'Personal Information', color: 'text-blue-600' },
    { icon: MapPin, label: 'Manage Addresses', color: 'text-orange-600' },
    { icon: CreditCard, label: 'Payment Methods', color: 'text-green-600' },
    { icon: Star, label: 'Rewards & Offers', color: 'text-purple-600' },
    { icon: HelpCircle, label: 'FAQs & Support', color: 'text-slate-600' },
  ];

  return (
    <div className="p-4 space-y-8">
      <div className="flex flex-col items-center pt-6">
        <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-sm flex items-center justify-center mb-4 overflow-hidden">
          <div className="text-3xl font-bold text-blue-600">{user.name.charAt(0)}</div>
        </div>
        <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
        <p className="text-sm text-slate-500">{user.email}</p>
        {user.role === 'admin' && (
          <span className="mt-2 px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full border border-blue-200">ADMIN</span>
        )}
      </div>

      <div className="space-y-3">
        {menuItems.map((item, idx) => (
          <button key={idx} className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
            <div className={cn("w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center", item.color)}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="flex-1 text-left font-medium text-slate-700">{item.label}</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
        ))}
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors mt-4"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="flex-1 text-left font-bold">Log Out</span>
        </button>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<View>('login');
  const [user, setUser] = useState<UserType | null>(null);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const handleLogin = (role: 'user' | 'admin') => {
    setUser(role === 'admin' ? MOCK_ADMIN : MOCK_USER);
    setView(role === 'admin' ? 'admin-dashboard' : 'home');
    toast.success(`Welcome back, ${role === 'admin' ? 'Admin' : 'Alex'}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
    toast.info('Logged out successfully');
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    toast.info(`Order #${id.slice(0, 5)} status updated to ${status}`);
  };

  const assignWorker = (orderId: string, workerId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, assignedWorkerId: workerId, status: 'assigned' } : o));
  };

  const addOrder = (order: Order) => {
    setOrders([order, ...orders]);
  };

  const renderView = () => {
    if (user?.role === 'admin') {
      switch (view) {
        case 'admin-dashboard': return <AdminDashboard orders={orders} onUpdateStatus={updateOrderStatus} setView={setView} />;
        case 'admin-orders': return <OrderManagement orders={orders} onUpdateStatus={updateOrderStatus} onAssignWorker={assignWorker} />;
        case 'admin-workers': return <WorkerManagement />;
        case 'profile': return <ProfileView user={user!} onLogout={handleLogout} />;
        default: return <AdminDashboard orders={orders} onUpdateStatus={updateOrderStatus} setView={setView} />;
      }
    }

    switch (view) {
      case 'home': return <HomeView user={user!} setView={setView} activeOrders={orders.filter(o => o.userId === user?.id)} />;
      case 'booking': return <BookingView setView={setView} addOrder={addOrder} user={user!} />;
      case 'tracking': return <TrackingView orders={orders} user={user!} />;
      case 'profile': return <ProfileView user={user!} onLogout={handleLogout} />;
      default: return <HomeView user={user!} setView={setView} activeOrders={orders.filter(o => o.userId === user?.id)} />;
    }
  };

  if (view === 'login') return (
    <>
      <LoginView onLogin={handleLogin} />
      <Toaster position="top-center" />
    </>
  );

  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans max-w-md mx-auto shadow-2xl relative border-x border-slate-200">
      <div className="flex-1 overflow-y-auto bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Bar */}
      {view !== 'booking' && (
        <nav className="bg-white border-t border-slate-100 px-6 py-4 flex justify-between items-center sticky bottom-0 z-30 pb-8">
          {isAdmin ? (
            [
              { id: 'admin-dashboard', icon: LayoutDashboard, label: 'Stats' },
              { id: 'admin-orders', icon: ShoppingBag, label: 'Work' },
              { id: 'admin-workers', icon: Users, label: 'Staff' },
              { id: 'profile', icon: Settings, label: 'Setup' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as View)}
                className={cn(
                  "flex flex-col items-center gap-1 transition-colors relative",
                  view === item.id ? "text-blue-600" : "text-slate-400"
                )}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              </button>
            ))
          ) : (
            [
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'booking', icon: Plus, label: 'Book', isFab: true },
              { id: 'tracking', icon: ShoppingBag, label: 'Orders' },
              { id: 'profile', icon: User, label: 'Profile' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as View)}
                className={cn(
                  "flex flex-col items-center gap-1 transition-colors relative",
                  item.isFab ? "bg-blue-600 p-4 rounded-full -mt-12 shadow-lg shadow-blue-200" : "",
                  view === item.id && !item.isFab ? "text-blue-600" : "text-slate-400"
                )}
              >
                <item.icon className={cn("w-6 h-6", item.isFab ? "text-white" : "")} />
                {!item.isFab && <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>}
              </button>
            ))
          )}
        </nav>
      )}

      <Toaster position="top-center" />
    </div>
  );
}