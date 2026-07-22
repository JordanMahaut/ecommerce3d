import { useEffect, useState } from "react";
import { getOrders } from "../services/order.service";

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadOrders() {
    try {
      setLoading(true);
      setError(null);

      const data = await getOrders();

      setOrders(data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    reload: loadOrders,
  };
}