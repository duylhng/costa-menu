import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Order {
  id: string;
  customer_id: string;
  total: number;
  status: string;
  pickup_time: string;
  created_at: string;
  customers: {
    name: string;
    email: string;
    phone: string;
  };
  order_items: Array<{
    menu_item_name: string;
    quantity: number;
    price: number;
  }>;
}

const Admin = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
      setupRealtimeSubscription();
    }
  }, [isAdmin]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers (name, email, phone),
          order_items (menu_item_name, quantity, price)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data as Order[]);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          fetchOrders();
          // Play notification sound
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => console.log('Could not play notification sound'));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      
      toast({
        title: 'Status updated',
        description: `Order marked as ${status}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'preparing':
        return 'bg-blue-500';
      case 'ready':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>

        <div className="grid gap-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No orders yet</p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="mb-2">
                        Order #{order.id.slice(0, 8)}
                      </CardTitle>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}
                      </p>
                      {order.pickup_time && (
                        <p className="text-sm font-semibold">
                          Pickup: {format(new Date(order.pickup_time), 'MMM dd, HH:mm')}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Customer</h4>
                      <p>{order.customers.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customers.email}</p>
                      <p className="text-sm text-muted-foreground">{order.customers.phone}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Items</h4>
                      {order.order_items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>
                            {item.menu_item_name} x {item.quantity}
                          </span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span>${Number(order.total).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          variant="default"
                        >
                          Start Preparing
                        </Button>
                      )}
                      {order.status === 'preparing' && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          variant="default"
                        >
                          Mark as Ready
                        </Button>
                      )}
                      {order.status === 'ready' && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          variant="default"
                        >
                          Complete Order
                        </Button>
                      )}
                      {(order.status === 'pending' || order.status === 'preparing') && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          variant="destructive"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
