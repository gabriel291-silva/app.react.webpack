import React, { useRef, useState, useEffect } from "react";
import { Form as UnForm } from "@unform/web";
import { Input } from "../Input";
import { mask_cep } from "../../utils/maks";
import { object, string, ValidationError } from "yup";
import { getProvince } from "../../utils/province";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { useShippingRates } from "../../hooks/useShippingRates";
import cepPromise from "cep-promise";
import fetchIntercept from "fetch-intercept";
import { addResponseCallback, unwire, wire } from "../../utils/xhr-intercept";

import styles from "./styles.module.css";

const regex = /(\/cart\/add)|(\/cart\/change)/gm;

export const Form = () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { setShippingRates } = useShippingRates();
  const { setErrorMessage } = useErrorMessage();

  async function validadeForm(data, { reset }) {
    try {
      const schema = object().shape({
        cep: string()
          .min(9, "O cep deve ter no mínimo 8 digitos")
          .max(9, "O cep deve ter no máximo 8 digitos")
          .required("Informe um CEP"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      formRef.current.setErrors({});

      submitForm(data, reset);
    } catch (err) {
      if (err instanceof ValidationError) {
        const errorMessages = {};
        setErrorMessage(null);
        setShippingRates(null);

        err.inner.forEach((error) => {
          errorMessages[error.path] = error.message;
        });

        formRef.current.setErrors(errorMessages);
      }
    }
  }

  function submitForm(data) {
    let { cep } = data;
    cep = cep.replace("-", "");

    setLoading(true);
    setErrorMessage(null);
    setShippingRates(null);

    cepPromise(cep, { providers: ["brasilapi"] })
      .then(({ state }) => {
        const province = getProvince(state);
        const country = "Brazil";

        const url = `/cart/shipping_rates.json?shipping_address[zip]=${cep}&shipping_address[country]=${country}&shipping_address[province]=${province}`;
        const urlEncoded = encodeURI(url);

        fetch(urlEncoded)
          .then((response) => response.json())
          .then(({ shipping_rates }) => setShippingRates(shipping_rates))
          .catch((error) => {
            const message = "SERVIÇO INDISPONÍVEL NO MOMENTO";
            console.error({ error });
            setErrorMessage(message);
          })
          .finally((_) => {
            setLoading(false);
          });
      })
      .catch((error) => {
        const message = "CEP NÃO ENCONTRADO";
        console.error({ error });
        setShippingRates(null);
        setErrorMessage(message);
        setLoading(false);
      });
  }

  function onResponse(xhr) {
    const url = xhr._url;
    if (url.match(regex) && xhr.readyState === 4) {
      formRef.current.submitForm();
    }
  }

  function onResponseFetch(response) {
    const url = response.url;
    if (url.match(regex)) {
      formRef.current.submitForm();
    }

    return response;
  }

  useEffect(() => {
    wire();
    addResponseCallback(onResponse);
    const unregister = fetchIntercept.register({
      response: onResponseFetch,
    });

    return () => {
      unwire();
      unregister();
    };
  }, []);

  return (
    <UnForm className={styles.form} ref={formRef} onSubmit={validadeForm}>
      <Input
        name="cep"
        placeholder="Digite o cep"
        onChange={mask_cep}
        maxLength="9"
        minLength="9"
      />

      <button
        type="submit"
        title=""
        disabled={loading ? "disabled" : ""}
        className={styles.button}
      >
        {loading ? "Enviando frete..." : "Enviar"}
      </button>
    </UnForm>
  );
};
