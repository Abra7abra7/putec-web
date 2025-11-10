"use client";

import { useAppDispatch } from "../../store/hooks";
import { addToCart } from "../../store/slices/cartSlice";
import { Product } from "../../../types/Product";
import { useLocalization } from "../../context/LocalizationContext";
import { showMiniCart } from "../../utils/MiniCartController";
import { Button } from "../ui/button";

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const dispatch = useAppDispatch();
  const { labels } = useLocalization();

  const handleAddToCart = () => {
    dispatch(addToCart(product));

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Show mini cart popup
    showMiniCart();
  };

  return (
    <Button
      onClick={handleAddToCart}
      className="mt-4 w-full md:w-auto"
    >
      {labels.addToCart || "Add to Cart"}
    </Button>
  );
}
