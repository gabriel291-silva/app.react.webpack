/**
 * Formata numero em moeda BRL
 */
export const { format: formatPrice } = new Intl.NumberFormat("pt-br", {
  style: "currency",
  currency: "BRL",
});

/**
 * Formata data 00/00/0000 pt-BR
 * @param {Date} date
 * @returns String
 */
export function formatDate(date) {
  let dateObj = new Date(`${date}`);
  let options = { year: "numeric", month: "long", day: "2-digit" };
  return dateObj.toLocaleDateString("pt-BR", options);
}

export const formatPriceItemCart = (price, freight) => {
  const priceString = price.toString();

  if (priceString.length === 7) {
    const priceRemoveLastNumber = priceString.substr(0, 5);
    const finalPrice = parseInt(priceRemoveLastNumber) + freight;
    return finalPrice.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (priceString.length === 6) {
    const priceRemoveLastNumber = priceString.substr(0, 4);
    const finalPrice = parseInt(priceRemoveLastNumber) + freight;
    return finalPrice.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (priceString.length === 5) {
    const priceRemoveLastNumber = priceString.substr(0, 3);
    const finalPrice = parseInt(priceRemoveLastNumber) + freight;
    return finalPrice.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  }
  if (priceString.length === 4) {
    const priceRemoveLastNumber = priceString.substr(0, 2);
    const finalPrice = parseInt(priceRemoveLastNumber) + freight;
    return finalPrice.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  }
  let total = price + freight;
  return total.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
};
