import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const CartButton = () => {
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      onClick={() => navigate('/cart')}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
          {itemCount}
        </Badge>
      )}
    </Button>
  );
};

export default CartButton;
