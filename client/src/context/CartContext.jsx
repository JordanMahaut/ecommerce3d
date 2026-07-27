import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "ecommerce3d_cart";

function readStoredCart() {
  try {
    const storedCart = localStorage.getItem(STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    const parsedCart = JSON.parse(storedCart);

    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (error) {
    console.error("Impossible de lire le panier :", error);
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readStoredCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Impossible d'enregistrer le panier :", error);
    }
  }, [cart]);

  function addToCart(product, quantity = 1) {
    const requestedQuantity = Math.max(1, Number(quantity) || 1);

    if (!product || !product.id) {
      return {
        success: false,
        message: "Produit invalide.",
      };
    }

    if (Number(product.stock) <= 0) {
      return {
        success: false,
        message: "Ce produit est indisponible.",
      };
    }

    let result = {
      success: true,
      message: "Produit ajouté au panier.",
    };

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id,
      );

      if (existingItem) {
        const nextQuantity =
          existingItem.quantity + requestedQuantity;

        const availableStock = Number(product.stock);

        if (
          Number.isFinite(availableStock) &&
          nextQuantity > availableStock
        ) {
          result = {
            success: false,
            message: `Stock disponible : ${availableStock}.`,
          };

          return currentCart;
        }

        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: nextQuantity,
                stock: product.stock,
                price: product.price,
              }
            : item,
        );
      }

      const availableStock = Number(product.stock);

      if (
        Number.isFinite(availableStock) &&
        requestedQuantity > availableStock
      ) {
        result = {
          success: false,
          message: `Stock disponible : ${availableStock}.`,
        };

        return currentCart;
      }

      return [
        ...currentCart,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: Number(product.price),
          stock: Number(product.stock),
          image: product.image || null,
          category: product.category || null,
          quantity: requestedQuantity,
        },
      ];
    });

    return result;
  }

  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId),
    );
  }

  function updateQuantity(productId, quantity) {
    const nextQuantity = Number(quantity);

    if (!Number.isInteger(nextQuantity)) {
      return;
    }

    if (nextQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        const maximumQuantity =
          Number.isFinite(Number(item.stock)) &&
          Number(item.stock) > 0
            ? Number(item.stock)
            : nextQuantity;

        return {
          ...item,
          quantity: Math.min(nextQuantity, maximumQuantity),
        };
      }),
    );
  }

  function clearCart() {
    setCart([]);
  }

  const totalItems = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + Number(item.quantity),
        0,
      ),
    [cart],
  );

  const totalPrice = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total +
          Number(item.price) * Number(item.quantity),
        0,
      ),
    [cart],
  );

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart doit être utilisé à l'intérieur de CartProvider.",
    );
  }

  return context;
}