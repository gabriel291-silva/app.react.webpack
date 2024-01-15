import React, { Fragment } from "react";
import { Form } from "./components/Form";
import { ShippingRates } from "./components/ShippingRates";
import { useErrorMessage } from "./hooks/useErrorMessage";
import { useShippingRates } from "./hooks/useShippingRates";

import "./global.css";
import styles from "./App.module.css";

export const App = () => {
  const { errorMessage } = useErrorMessage();
  const { shippingRates } = useShippingRates();

  return (
    <div className={styles.container}>
      <p className={styles.title}></p>

      <Form />

      <div className={styles.content}>
        {errorMessage && <p>{errorMessage}</p>}
        {shippingRates?.length > 0 && (
          <Fragment>
            <p></p>
            <p></p>
          </Fragment>
        )}
        {shippingRates?.length > 0 && <ShippingRates data={shippingRates} />}
      </div>
    </div>
  );
};

export default App;
