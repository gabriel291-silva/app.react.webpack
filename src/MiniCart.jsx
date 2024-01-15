import React, { Fragment, useCallback, useEffect, useState } from "react";
import { formatPriceItemCart, formatPrice } from "./utils/format";
import EmptyState from "./components/EmptyState";
import cep from "cep-promise";
import styles from "./MiniCart.module.css";
const addPromotion = document.getElementById("orderSize");

const teste = (value) => {
  let valueProduct = value / 100;
  let total = 200 - valueProduct;

  return formatPriceItemCart(total, 0);
};

const MiniCart = () => {
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [itensCart, setItensCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingFreight, setLoadingFreight] = useState(false);
  const [valueFreight, setValueFreight] = useState(0);
  const [valueCep, setValueCep] = useState("");
  const [disableButton, setDisableButton] = useState(true);
  const [countItens, setCountItens] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMail, setErrorMail] = useState("");
  const numberItens = localStorage.getItem("itensCart");
  const [widthProgressBar, setWidthProgressBar] = useState("10%");
  const [freeFreight, setFreeFreight] = useState(false);
  const [showEmail, setShowEmail] = useState(true);
  const [showPromotion, setShowPromotion] = useState(false);
  const [valueMail, setValueMail] = useState("");

  const calcProgressBarWidth = useCallback(() => {
    let progressBarQtnTotal = totalPrice / 200;

    if (totalPrice < 20000) {
      setWidthProgressBar(`${progressBarQtnTotal}%`);
      setFreeFreight(false);
      return;
    }
    setWidthProgressBar("100%");
    setFreeFreight(true);
  }, [totalPrice, setWidthProgressBar, setFreeFreight]);

  const getCartList = useCallback(() => {
    setLoading(true);

    fetch("/cart.js")
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json();
        }
      })
      .then((data) => {
        const { items, total_price } = data;
        setItensCart(items);
        setTotalPrice(total_price);
        setLoading(false);

        const teste = items.filter((element) => element.id === 32446702026848);

        if (teste.length > 0) {
          setShowEmail(false);
        }

        const arrayQuantityItems = items.map((element) => {
          return element.quantity;
        });

        const numberOfItems = arrayQuantityItems.reduce((acc, number) => {
          return acc + number;
        }, 0);
        setCountItens(numberOfItems);

        if (numberOfItems > 0) {
          localStorage.setItem("itensCart", numberOfItems);
          return;
        }
        localStorage.removeItem("itensCart", numberOfItems);
      })

      .catch((error) => {
        console.error({ component: "mini-cart", error: error });
        setLoading(false);
      });
  }, [setItensCart, setTotalPrice, setLoading, setCountItens]);

  const handleAddItem = async (item) => {
    let payload = {
      id: item.key,
      quantity: item.quantity + 1,
    };
    let req = await fetch(`/cart/change.js`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    await req.json();
    getCartList();
  };

  const handleRemoveItem = async (item) => {
    let payload = {
      id: item.key,
      quantity: item.quantity - 1,
    };
    let req = await fetch(`/cart/change.js`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    await req.json();

    getCartList();
    calcProgressBarWidth();
  };

  const caclFreight = () => {
    setLoadingFreight(true);
    setErrorMessage("");
    if (valueCep !== "") {
      cep(valueCep, { timeout: 5000, providers: ["brasilapi"] })
        .then(async ({ state }) => {
          const country = "Brazil";
          const url = `/cart/shipping_rates.json?shipping_address[zip]=${valueCep}&shipping_address[country]=${country}&shipping_address[province]=${state}`;
          let req = await fetch(`${url}`);
          let resp = await req.json();

          if (req.status === 200) {
            resp.shipping_rates.map((object) => {
              setValueFreight(Number(object.price));
              setLoadingFreight(false);
              setDisableButton(false);
            });
            return;
          }
          setErrorMessage("Algo deu errado, tente novamente");
        })
        .catch(() => {
          setLoadingFreight(false);
          setErrorMessage("cep inválido, tente novamente");
        });
      return;
    }
    setErrorMessage("preencha o cep");
    setLoadingFreight(false);
  };

  const clearCart = useCallback(async () => {
    let req = await fetch(`/cart/clear.js`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let resp = await req.json();
    if (req.status === 200) {
      setItensCart(resp.items);
      localStorage.removeItem("itensCart");
      setCountItens(0);
    }
  }, [setCountItens]);

  const handleCep = (e) => {
    setValueCep(e.target.value);
  };
  const handleMail = (e) => {
    setValueMail(e.target.value);
  };

  async function handleDiscount() {
    const regexMail =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    let itemsOrder = parseInt(addPromotion.value);
    let payloadItems = {
      id: 32446702026848,
      quantity: 1,
    };

    setErrorMail("");

    if (regexMail.exec(valueMail)) {
      if (itemsOrder > 0) {
        alert("este desconto não está disponivel para você.");
        return;
      }

      try {
        await fetch("/cart/add.js", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(payloadItems),
        }).then((resp) => {
          if (resp.status === 200) {
            setShowEmail(false);
            getCartList();
          }
        });
      } catch (e) {
        console.log(e);
        return;
      }
      return;
    }

    setErrorMail("e-mail inválido, tente novamente");
  }

  useEffect(() => {
    getCartList();
  }, [getCartList]);

  useEffect(() => {
    setCountItens(numberItens);
  }, [numberItens]);

  useEffect(() => {
    calcProgressBarWidth();
  }, [calcProgressBarWidth]);

  useEffect(() => {
    if (addPromotion !== null) {
      setShowPromotion(true);
      return;
    }
  }, [addPromotion]);

  return (
    <Fragment>
      <div className={styles.container}>
        <div className={countItens > 0 ? styles.count : styles.countHidden}>
          {countItens}
        </div>
        <div
          onClick={() => setShowMiniCart(!showMiniCart)}
          className={styles.wrapperBag}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            role="presentation"
            className="icon icon-bag"
            viewBox="0 0 64 64"
          >
            <defs></defs>
            <path
              className="cls-1"
              d="M24.23 18c0-7.75 3.92-14 8.75-14s8.74 6.29 8.74 14M14.74 18h36.51l3.59 36.73h-43.7z"
            />
          </svg>
          <div className={styles.bold}>sacola</div>
        </div>
        {showMiniCart && (
          <div
            className={
              itensCart.length <= 0
                ? styles.wrapperMiniCartEmpty
                : styles.wrapperMiniCart
            }
          >
            {itensCart.length > 0 ? (
              <Fragment>
                <div className={styles.wrapperCalcFreight}>
                  <span>
                    {!freeFreight
                      ? `mais ${teste(totalPrice)} e ganhe frete grátis`
                      : "Uhu! Frete grátis ✨"}
                  </span>
                  <div className={styles.progresBar}>
                    <div
                      className={styles.progresBarItem}
                      style={{ width: widthProgressBar }}
                    ></div>
                  </div>
                </div>
                <div className={styles.WrapperItensCart}>
                  {itensCart.map((element) => (
                    <div className={styles.card} key={element.id}>
                      <img
                        src={`${element.image}`}
                        width="80px"
                        height="120px"
                        alt={`${element.featured_image.alt}`}
                      />
                      <div className={styles.wrapperInfos}>
                        <h4>{element.product_title}</h4>
                        <span>
                          <strong>Cor:</strong>
                          {element.variant_options[0]}
                        </span>
                        <span>
                          <strong>Tamanho:</strong>
                          {element.variant_options[1]}
                        </span>
                        {element.id !== 32446702026848 && (
                          <div className={styles.wrapperAddProduct}>
                            <button onClick={() => handleRemoveItem(element)}>
                              -
                            </button>
                            <span>{element.quantity}</span>
                            <button onClick={() => handleAddItem(element)}>
                              +
                            </button>
                          </div>
                        )}
                      </div>
                      <div className={styles.wrapperPrices}>
                        {/* {loading ? (
                          <div className={styles.loading}></div>
                        ) : (
                          formatPriceItemCart(element.price, 0)
                        )} */}
                        {formatPriceItemCart(element.price, 0)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.footer}>
                  {/* <div className={styles.wrapperCarbon}>
                    <div className={styles.square}></div>
                    <span>frete carbono neutro</span>
                    <span>
                      {loadingFreight ? (
                        <div className={styles.loading}></div>
                      ) : (
                        formatPrice(valueFreight)
                      )}
                    </span>
                  </div> */}
                  <div className={styles.wrapperTotal}>
                    <span> subtotal: </span>
                    <span>
                      {loading ? (
                        <div className={styles.loading}></div>
                      ) : (
                        formatPriceItemCart(totalPrice, 0)
                      )}
                    </span>
                  </div>
                  <div className={styles.wrapperFreight}>
                    <div className={styles.wrapperInput}>
                      <label>frete:</label>
                      <input
                        type="text"
                        placeholder="insira o CEP"
                        onChange={(e) => handleCep(e)}
                        maxLength={8}
                      />
                    </div>
                    <button
                      type="button"
                      className={styles.btn}
                      onClick={caclFreight}
                      // disabled={valueCep.length === 8 ? false : true}
                    >
                      calcular
                    </button>
                    {valueFreight > 0 && (
                      <span>
                        {loadingFreight ? (
                          <div className={styles.loading}></div>
                        ) : !freeFreight ? (
                          formatPrice(valueFreight)
                        ) : (
                          "grátis"
                        )}
                      </span>
                    )}
                  </div>
                  {errorMessage !== "" && (
                    <p className={styles.errorMessage}>{errorMessage}</p>
                  )}
                  <div className={styles.wrapperCoupons}></div>

                  {showPromotion && (
                    <div className={styles.wrapperFreight}>
                      {showEmail ? (
                        <Fragment>
                          <div className={styles.wrapperInputMail}>
                            <label>email:</label>
                            <input
                              type="email"
                              placeholder="e-mail"
                              onChange={(e) => handleMail(e)}
                              maxLength={30}
                            />
                            <button
                              type="button"
                              className={styles.btn}
                              onClick={handleDiscount}
                            >
                              enviar
                            </button>
                          </div>
                        </Fragment>
                      ) : (
                        "você ganhou um saquinho de lavagem ;)"
                      )}
                    </div>
                  )}
                  {!showPromotion && (
                    <div className={styles.wrapperDiscount}>
                      <span className={styles.messageDiscount}>
                        login{" "}
                        <a href="https://www.pantys.com.br/account">aqui</a>{" "}
                        para descontos ou brindes!
                      </span>
                    </div>
                  )}
                  {errorMail !== "" && (
                    <p className={styles.errorMessage}>{errorMail}</p>
                  )}
                  <div className={styles.wrapperTotal}>
                    total:
                    <span>
                      {loading | loadingFreight ? (
                        <div className={styles.loading}></div>
                      ) : (
                        formatPriceItemCart(
                          totalPrice,
                          freeFreight ? 0 : valueFreight
                        )
                      )}
                    </span>
                  </div>
                  {/* <div className={styles.wrapperBottomFooter}>
                    <button className={styles.btnSecondary} onClick={clearCart}>
                      limpar carrinho
                    </button>
                  </div> */}
                  <div className={styles.wrapperBottomFooter}>
                    <button
                      className={styles.btnSecondary}
                      id="finish"
                      // disabled={!freeFreight ? disableButton : false}
                      onClick={() => (window.location.href = "/checkout")}
                    >
                      finalizar compra
                    </button>
                  </div>
                </div>
              </Fragment>
            ) : (
              <EmptyState close={() => setShowMiniCart(false)} />
            )}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default MiniCart;
