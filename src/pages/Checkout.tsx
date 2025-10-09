import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user, guestInfo } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState(guestInfo?.phone || '');
  const [pickupTime, setPickupTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !guestInfo) {
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      let customerId: string;

      if (user) {
        // Authenticated user flow
        const { data: customer } = await supabase
          .from('customers')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!customer) {
          const { data: newCustomer, error: customerError } = await supabase
            .from('customers')
            .insert({
              user_id: user.id,
              name: user.user_metadata.name || user.email || '',
              email: user.email || '',
              phone,
            })
            .select()
            .single();

          if (customerError) throw customerError;
          customerId = newCustomer.id;
        } else {
          customerId = customer.id;
          if (customer.phone !== phone) {
            await supabase
              .from('customers')
              .update({ phone })
              .eq('id', customer.id);
          }
        }
      } else if (guestInfo) {
        // Guest user flow - create customer without user_id
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            user_id: null,
            name: guestInfo.name,
            email: guestInfo.email,
            phone: guestInfo.phone,
          })
          .select()
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
      } else {
        throw new Error('No user or guest info available');
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId,
          total: total,
          status: 'pending',
          pickup_time: pickupTime,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        menu_item_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      toast({
        title: 'Order placed!',
        description: `Order #${order.id.slice(0, 8)} confirmed. We'll prepare it shortly!`,
      });
      navigate('/');
      
      // TODO: Implement Stripe payment
      // For now, orders go through without payment
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to place order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user && !guestInfo) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {items.map((item) => (
              <div key={item.name} className="flex justify-between mb-2">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2 font-bold flex justify-between">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pickup Details</CardTitle>
            {guestInfo && (
              <p className="text-sm text-muted-foreground">
                Ordering as: {guestInfo.name} ({guestInfo.email})
              </p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!guestInfo && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="(03) 5152 1234"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="pickup-time">Pickup Time</Label>
                <Input
                  id="pickup-time"
                  type="datetime-local"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
