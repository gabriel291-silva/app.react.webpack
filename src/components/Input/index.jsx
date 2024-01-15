import React, { useEffect, useRef } from "react";
import { useField } from "@unform/core";

import styles from "./styles.module.css";

export const Input = ({ name, ...rest }) => {
  const inputRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value",
    });
  }, [fieldName, registerField]);

  return (
    <label className={styles.label}>
      <input
        className={styles.input}
        ref={inputRef}
        defaultValue={defaultValue}
        {...rest}
      />
      {error && <span className={styles.require}>{error}</span>}
    </label>
  );
};
