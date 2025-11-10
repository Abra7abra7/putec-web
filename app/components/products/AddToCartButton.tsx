"use client";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addToCart, updateQuantity } from "../../store/slices/cartSlice";
import { Product } from "../../../types/Product";
import { useLocalization } from "../../context/LocalizationContext";
import { showMiniCart } from "../../utils/MiniCartController";
import { Button } from "../ui/button";
import { Plus, Minus } from "lucide-react";

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const dispatch = useAppDispatch();
  const { labels } = useLocalization();
  
  // Check if product is in cart
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItem = cartItems.find((item) => item.ID === product.ID);

  const handleAddToCart = () => {
    dispatch(addToCart(product));

    // Show mini cart popup
    showMiniCart();
  };

  const handleQtyChange = (delta: number) => {
    if (!cartItem) return;

    const newQty = cartItem.quantity + delta;
    if (newQty >= 1) {
      dispatch(updateQuantity({ id: product.ID, quantity: newQty }));
      showMiniCart();
    }
  };

  // If product is not in cart, show "Add to Cart" button
  if (!cartItem) {
    return (
      <Button
        onClick={handleAddToCart}
        className="mt-4 w-full md:w-auto"
      >
        {labels.addToCart || "Add to Cart"}
      </Button>
    );
  }

  // If product is in cart, show quantity counter
  return (
    <div className="mt-4 flex items-center gap-3">
      <button
        onClick={() => handleQtyChange(-1)}
        className="text-foreground border-2 border-accent px-3 py-2 rounded-md hover:bg-accent/10 transition"
      >
        <Minus size={20} />
      </button>
      <span className="text-lg font-semibold min-w-[40px] text-center">
        {cartItem.quantity}
      </span>
      <button
        onClick={() => handleQtyChange(1)}
        className="text-foreground border-2 border-accent px-3 py-2 rounded-md hover:bg-accent/10 transition"
      >
        <Plus size={20} />
      </button>
    </div>
  );
}
