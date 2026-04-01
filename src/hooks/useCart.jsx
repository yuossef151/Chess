import { useMemo, useState } from "react";

export default function useCart() {
  const [cart, setCart] = useState([]);

  const addItem = (product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const changeQty = (id, type) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id
            ? { ...i, qty: type === "inc" ? i.qty + 1 : i.qty - 1 }
            : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const totalPrice = useMemo(
    () => cart.reduce((acc, i) => acc + i.pro_price * i.qty, 0),
    [cart]
  );

  return { cart, addItem, removeItem, changeQty, totalPrice, setCart };
}