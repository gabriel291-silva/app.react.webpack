import React from "react";
import { formatPrice, formatDate } from "../../utils/format";

import styles from "./styles.module.css";

export const ShippingRates = ({ data }) => {
  return (
    <ul className={styles.list}>
      {data?.map(({ name, code, price, delivery_date }) => (
        <li className={styles.listItem} key={code}>
          <p className={styles.listItemTitle}>{name}</p>
          <div className={styles.listItemContent}>
            {delivery_date && <p>Receba até {formatDate(delivery_date)}</p>}
            {price > 0 ? <p>{formatPrice(price)}</p> : <p>Grátis</p>}
          </div>
        </li>
      ))}
    </ul>
  );
};
