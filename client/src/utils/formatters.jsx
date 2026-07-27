export function formatPrice(value) {
  const price = Number(value);

  if (!Number.isFinite(price)) {
    return "0,00 €";
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

export function normalizeProductsResponse(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.products)) {
    return data.products;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.data?.products)) {
    return data.data.products;
  }

  return [];
}