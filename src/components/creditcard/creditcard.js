import React, { useState, useEffect, useMemo } from "react";
import {
  CSSTransition,
  TransitionGroup,
  SwitchTransition,
} from "react-transition-group";
import "./styles.scss";

const cardBackgroundColor = () => {
  let random = Math.floor(Math.random() * 25 + 1);
  return `${random}.jpeg`;
};

const BACKGROUND_IMG = cardBackgroundColor();

const CreditCard = ({
  cardHolder,
  cardNumber,
  cardMonth,
  cardYear,
  cardCvv,
  isCardFlipped,
  currentFocusedElm,
  onCardElementClick,
  cardNumberRef,
  cardHolderRef,
  cardDateRef,
}) => {
  const [style, setStyle] = useState(null);

  const getCardType = (cardNum) => {
    const regex = /(\d)\s+(?=\d)/g;
    const str = cardNum;
    const subst = `$1`;

    const result = str.replace(regex, subst);

    var payCardType = "visa";
    var regexMap = [
      { regEx: /^4[0-9]{5}/gi, cardType: "unionpay" },
      { regEx: /^5[1-5][0-9]{4}/gi, cardType: "mastercard" },
      { regEx: /^3[47][0-9]{3}/gi, cardType: "amex" },
      { regEx: /^(5[06-8]\d{4}|6\d{5})/gi, cardType: "discover" },
    ];

    for (var j = 0; j < regexMap.length; j++) {
      if (result.match(regexMap[j].regEx)) {
        payCardType = regexMap[j].cardType;
        break;
      }
    }

    if (
      result.indexOf("50") === 0 ||
      result.indexOf("60") === 0 ||
      result.indexOf("65") === 0
    ) {
      var g = "508500-508999|606985-607984|608001-608500|652150-653149";
      var i = g.split("|");
      for (var d = 0; d < i.length; d++) {
        var c = parseInt(i[d].split("-")[0], 10);
        var f = parseInt(i[d].split("-")[1], 10);
        if (
          result.substr(0, 6) >= c &&
          result.substr(0, 6) <= f &&
          result.length >= 6
        ) {
          payCardType = "troy";
          break;
        }
      }
    }
    return payCardType;
  };

  const useCardType = useMemo(() => {
    return getCardType(cardNumber);
  }, [cardNumber]);

  const outlineElementStyle = (element) => {
    return element
      ? {
          width: `${element.offsetWidth}px`,
          height: `${element.offsetHeight}px`,
          transform: `translateX(${element.offsetLeft}px) translateY(${element.offsetTop}px)`,
        }
      : null;
  };

  useEffect(() => {
    if (currentFocusedElm) {
      const style = outlineElementStyle(currentFocusedElm.current);
      setStyle(style);
    }
  }, [currentFocusedElm]);

  const maskCardNumber = (cardNumber) => {
    let cardNumberArr = cardNumber.split("");
    cardNumberArr.forEach((val, index) => {
      if (val !== "#") {
        if (index > 4 && index < 14) {
          if (cardNumberArr[index] !== " ") {
            cardNumberArr[index] = "*";
          }
        }
      }
    });

    return cardNumberArr;
  };

  return (
    <div className={"card-item " + (isCardFlipped ? "-active" : "")}>
      <div className="card-item__side -front">
        <div
          className={`card-item__focus ${currentFocusedElm ? `-active` : ``}`}
          style={style}
        />
        <div className="card-item__cover">
          <img
            alt=""
            src={`/card-background/${BACKGROUND_IMG}`}
            className="card-item__bg"
          />
        </div>

        <div className="card-item__wrapper">
          <div className="card-item__top">
            <img src={"/chip.png"} alt="" className="card-item__chip" />
            <div className="card-item__type">
              <img
                alt={useCardType}
                src={`/card-type/${useCardType}.png`}
                className="card-item__typeImg"
              />
            </div>
          </div>

          <label
            className="card-item__number"
            ref={cardNumberRef}
            onClick={() => onCardElementClick("cardNumber")}
          >
            <TransitionGroup className="slide-fade-up" component="div">
              {cardNumber ? (
                maskCardNumber(cardNumber).map((val, index) => (
                  <CSSTransition
                    classNames="slide-fade-up"
                    timeout={250}
                    key={index}
                  >
                    <div className="card-item__numberItem">{val}</div>
                  </CSSTransition>
                ))
              ) : (
                <CSSTransition classNames="slide-fade-up" timeout={250}>
                  <div className="card-item__numberItem">#</div>
                </CSSTransition>
              )}
            </TransitionGroup>
          </label>
          <div className="card-item__content">
            <label
              className="card-item__info"
              onClick={() => onCardElementClick("cardHolder")}
              ref={cardHolderRef}
            >
              <div className="card-item__holder">Card Holder</div>
              <div className="card-item__name">
                <TransitionGroup component="div" className="slide-fade-up">
                  {cardHolder === "FULL NAME" ? (
                    <CSSTransition classNames="slide-fade-up" timeout={250}>
                      <div>FULL NAME</div>
                    </CSSTransition>
                  ) : (
                    cardHolder.split("").map((val, index) => (
                      <CSSTransition
                        timeout={250}
                        classNames="slide-fade-right"
                        key={index}
                      >
                        <span className="card-item__nameItem">{val}</span>
                      </CSSTransition>
                    ))
                  )}
                </TransitionGroup>
              </div>
            </label>
            <div
              className="card-item__date"
              onClick={() => onCardElementClick("cardDate")}
              ref={cardDateRef}
            >
              <label className="card-item__dateTitle">Expires</label>
              <label className="card-item__dateItem">
                <SwitchTransition in-out>
                  <CSSTransition
                    classNames="slide-fade-up"
                    timeout={200}
                    key={cardMonth}
                  >
                    <span>{!cardMonth ? "MM" : cardMonth} </span>
                  </CSSTransition>
                </SwitchTransition>
              </label>
              /
              <label htmlFor="cardYear" className="card-item__dateItem">
                <SwitchTransition out-in>
                  <CSSTransition
                    classNames="slide-fade-up"
                    timeout={250}
                    key={cardYear}
                  >
                    <span>
                      {!cardYear ? "YY" : cardYear.toString().substr(-2)}
                    </span>
                  </CSSTransition>
                </SwitchTransition>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card-item__side -back">
        <div className="card-item__cover">
          <img
            alt=""
            src={`/card-background/${BACKGROUND_IMG}`}
            className="card-item__bg"
          />
        </div>
        <div className="card-item__band" />
        <div className="card-item__cvv">
          <div className="card-item__cvvTitle">CVV</div>
          <div className="card-item__cvvBand">
            <TransitionGroup>
              {cardCvv.split("").map((val, index) => (
                <CSSTransition
                  classNames="zoom-in-out"
                  key={index}
                  timeout={250}
                >
                  <span>{val}</span>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </div>
          <div className="card-item__type">
            <img
              alt={useCardType}
              src={`/card-type/${useCardType}.png`}
              className="card-item__typeImg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
