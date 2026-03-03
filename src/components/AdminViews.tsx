import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  CheckCircle2, 
  XCircle, 
  UserPlus, 
  Clock, 
  MapPin, 
  ChevronRight,
  TrendingUp,
  Package,
  AlertCircle,
  MoreVertical,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn, getStatusColor, getStatusLabel, formatCurrency } from '../lib/utils';
import { Order, Worker, OrderStatus } from '../types';

// Mock Workers
export const MOCK_WORKERS: Worker[] = [
  { id: 'w1', name: 'John Doe', status: 'available', phone: '+1 555-0101', completedJobs: 124, specialty: ['Wash & Fold'] },
  { id: 'w2', name: 'Jane Smith', status: 'busy', phone: '+1 555-0102', completedJobs: 89, specialty: ['Dry Clean'] },
  { id: 'w3', name: 'Mike Johnson', status: 'available', phone: '+1 555-0103', completedJobs: 210, specialty: ['Shoes', 'Fabrics'] },
  { id: 'w4', name: 'Sarah Wilson', status: 'off-duty', phone: '+1 555-0104', completedJobs: 45, specialty: ['Wash & Fold'] },
];

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-2xl", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
          <TrendingUp className="w-3 h-3 mr-1" /> {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

export const AdminDashboard = ({ 
  orders, 
  onUpdateStatus, 
  setView 
}: { 
  orders: Order[], 
  onUpdateStatus: (id: string, s: OrderStatus) => void,
  setView: (v: any) => void
}) => {
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const washingOrders = orders.filter(o => o.status === 'washing');
  
  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex justify-between items-center mt-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Panel</h2>
          <p className="text-slate-500 text-sm">Managing laundry operations</p>
        </div>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          A
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          title="New Orders" 
          value={pendingOrders.length} 
          icon={ShoppingBag} 
          color="bg-amber-500" 
          trend="+12%" 
        />
        <StatCard 
          title="In Progress" 
          value={washingOrders.length} 
          icon={Clock} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Revenue" 
          value={formatCurrency(orders.reduce((acc, o) => acc + o.totalPrice, 0))} 
          icon={TrendingUp} 
          color="bg-green-500" 
          trend="+5.4%" 
        />
        <StatCard 
          title="Workers" 
          value={MOCK_WORKERS.filter(w => w.status === 'available').length + "/" + MOCK_WORKERS.length} 
          icon={Users} 
          color="bg-purple-500" 
        />
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Incoming Orders</h3>
          <button onClick={() => setView('admin-orders')} className="text-blue-600 text-sm font-medium">View All</button>
        </div>
        
        {pendingOrders.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center">
            <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm font-medium">No pending orders</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingOrders.slice(0, 3).map(order => (
              <div key={order.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-slate-800">#{order.id.slice(0, 8)}</h4>
                    <p className="text-xs text-slate-500">{order.userName} \u2022 {order.items.length} items</p>
                  </div>
                  <span className={cn("px-2 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider", getStatusColor(order.status))}>
                    {order.status}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => onUpdateStatus(order.id, 'accepted')}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => onUpdateStatus(order.id, 'rejected')}
                    className="flex-1 py-2 bg-slate-50 text-slate-600 border border-slate-100 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export const OrderManagement = ({ 
  orders, 
  onUpdateStatus, 
  onAssignWorker 
}: { 
  orders: Order[], 
  onUpdateStatus: (id: string, s: OrderStatus) => void,
  onAssignWorker: (orderId: string, workerId: string) => void
}) => {
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [assigningTo, setAssigningTo] = useState<string | null>(null);

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const handleAssign = (orderId: string, workerId: string) => {
    onAssignWorker(orderId, workerId);
    setAssigningTo(null);
    toast.success('Job assigned successfully');
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Orders</h2>
        <button className="p-2 bg-slate-100 rounded-xl">
          <Filter className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
        {['all', 'pending', 'accepted', 'assigned', 'washing', 'washing_complete', 'delivery', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all",
              filter === f ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100" : "bg-white border-slate-100 text-slate-500"
            )}
          >
            {getStatusLabel(f)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">#{order.id.slice(0, 8)}</h4>
                  <p className="text-xs text-slate-500">{order.userName}</p>
                </div>
              </div>
              <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider", getStatusColor(order.status))}>
                {getStatusLabel(order.status)}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{order.pickupDate} \u2022 {order.pickupTime}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">{order.address}</span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {order.status === 'pending' && (
                <>
                  <button onClick={() => onUpdateStatus(order.id, 'accepted')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Accept</button>
                  <button onClick={() => onUpdateStatus(order.id, 'rejected')} className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold border border-slate-100">Reject</button>
                </>
              )}

              {order.status === 'accepted' && (
                <button 
                  onClick={() => setAssigningTo(order.id)}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> Assign Worker
                </button>
              )}

              {order.status === 'assigned' && (
                <button 
                  onClick={() => onUpdateStatus(order.id, 'washing')}
                  className="w-full py-2.5 bg-cyan-600 text-white rounded-xl text-xs font-bold"
                >
                  Start Washing
                </button>
              )}

              {order.status === 'washing' && (
                <button 
                  onClick={() => onUpdateStatus(order.id, 'washing_complete')}
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  Confirm Washing Complete
                </button>
              )}

              {order.status === 'washing_complete' && (
                <button 
                  onClick={() => onUpdateStatus(order.id, 'delivery')}
                  className="w-full py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold"
                >
                  Dispatch for Delivery
                </button>
              )}

              {order.status === 'delivery' && (
                <button 
                  onClick={() => onUpdateStatus(order.id, 'completed')}
                  className="w-full py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold"
                >
                  Mark Delivered
                </button>
              )}

              {order.assignedWorkerId && (
                <div className="w-full mt-2 pt-3 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold">
                      {MOCK_WORKERS.find(w => w.id === order.assignedWorkerId)?.name.charAt(0)}
                    </div>
                    <span className="text-[10px] font-medium text-slate-600">
                      Assigned to {MOCK_WORKERS.find(w => w.id === order.assignedWorkerId)?.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Assign Worker Modal */}
      {assigningTo && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
            className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-3xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Assign Worker</h3>
              <button onClick={() => setAssigningTo(null)} className="p-2 hover:bg-slate-100 rounded-full">
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <div className="space-y-3 mb-6">
              {MOCK_WORKERS.filter(w => w.status === 'available').map(worker => (
                <button
                  key={worker.id}
                  onClick={() => handleAssign(assigningTo, worker.id)}
                  className="w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-blue-50 hover:border-blue-100 border border-slate-50 rounded-2xl transition-all group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 font-bold border border-slate-100 group-hover:border-blue-200">
                    {worker.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-bold text-slate-800">{worker.name}</h4>
                    <p className="text-xs text-slate-500">{worker.specialty?.join(', ')}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
              ))}
              {MOCK_WORKERS.filter(w => w.status === 'available').length === 0 && (
                <p className="text-center text-slate-500 text-sm py-4">No available workers right now.</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export const WorkerManagement = () => {
  const [workers, setWorkers] = useState<Worker[]>(MOCK_WORKERS);

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Workers</h2>
        <button className="bg-blue-600 text-white p-2.5 rounded-xl">
          <UserPlus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {workers.map(worker => (
          <div key={worker.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">
                  {worker.name.charAt(0)}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800">{worker.name}</h4>
                <p className="text-xs text-slate-500">{worker.phone}</p>
              </div>
              <div className={cn(
                "px-2 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider",
                worker.status === 'available' ? "bg-green-50 text-green-700 border-green-100" : 
                worker.status === 'busy' ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-slate-100 text-slate-500 border-slate-200"
              )}>
                {worker.status}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
              <div className="flex gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Jobs Done</p>
                  <p className="text-sm font-bold text-slate-700">{worker.completedJobs}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Specialty</p>
                  <p className="text-sm font-bold text-slate-700">{worker.specialty?.[0] || 'General'}</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};