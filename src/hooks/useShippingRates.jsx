import { useState, useContext, createContext } from "react";

const ShippingRatesContext = createContext({});

export function ShippingRatesProvider({ children }) {
  const [shippingRates, setShippingRates] = useState(null);

  return (
    <ShippingRatesContext.Provider value={{ shippingRates, setShippingRates }}>
      {children}
    </ShippingRatesContext.Provider>
  );
}

export function useShippingRates() {
  const context = useContext(ShippingRatesContext);

  return context;
}
