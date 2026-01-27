import { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // cada item: {id, nombre, precioUnitario, imagen, cantidad}

  const addItem = (cookie) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === cookie.id);
      if (existing) {
        return prev.map((i) =>
          i.id === cookie.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: cookie.id,
          nombre: cookie.nombre,
          precioUnitario: cookie.precioUnitario,
          imagen: cookie.imagen,
          cantidad: 1,
        },
      ];
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id, cantidad) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, cantidad: Math.max(1, cantidad) } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const total = useMemo(
    () => items.reduce((acc, i) => acc + i.cantidad * i.precioUnitario, 0),
    [items]
  );

  const value = {
    items,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
