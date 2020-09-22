import React, {useState, useEffect} from 'react';
import {useRouteMatch} from 'react-router-dom';
import Spinner from "../componets/Spinner";

import {fetchDataFromApi, findObj, groupBy} from "../utilities";

import '../App.css';
import '../css/orders.css';


function AddOrder() {

  let tooltip_volume_pair1 = document.querySelector("#tooltip_volume_pair1");
  let tooltip_volume_pair2 = document.querySelector("#tooltip_volume_pair2");

  const match = useRouteMatch('/addorder/:pair');
  // index 3-4 is used for XXBT o ZEUR
  const [selectedPair, setSelectedPair] = useState([match.params.pair.substring(1), "EUR", match.params.pair,"ZEUR"]);

  const [listAssetPairs, setListAssetPairs] = useState()


  const [volumePair, setVolumePair] = useState();
  const [totalPair, setTotalPair] = useState();
  const [balance, setBalance] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  const [price, setPrice] = useState(0);

  const [visibleSpinner, setVisibleSpinner] = useState([])
  const [spinnerWidth, setSpinnerWidth] = useState([])


  // change class for selected and active Element

  const [disableLimitPrice, setDisableLimitPrice] = useState([false, "input-small ralign hmarg0right", "input-medium ralign hmarg0right"]);
  const [navbarOrder, setNavBarOrder] = useState(["active", "", ""]);
  const [orderViewArray, setorderViewArray] = useState(["show", "hide", "hide"]);
  const [btnOrderType, setBtnOrderType] = useState(["btn btn-success", "btn"]);
  const [btnType, setBtnType] = useState(["btn btn-type btn-small", "btn btn-type btn-small active"]);
  const [paramsOrder, setParamsOrder] = useState({
    pair: "XBTUSD",
    type: "buy",
    ordertype: "limit",
    //   leverage: "1:1",
    price: "0",
    volume: volumePair
  })
  const [visibleListSecondPairs, setVisibleListSecondPairs] = useState("dropdown-menu small");

  useEffect(() => {
    setVisibleSpinner("show");
    setSpinnerWidth("width-15");
    Promise.all([() => {
      setSpinnerWidth("width-50")
    }, fetchDataFromApi("assetPairs"), fetchDataFromApi("balance")]).then((ris) => {
      _getBalance(ris[2], match.params.pair).then(r => {
      });
      _getAssetPairs(ris[1], match.params.pair).then(r => {
      });
      setSpinnerWidth("width-100")
      setTimeout(() => {
        setVisibleSpinner("hide");
      }, 1000);

    }).catch((e) => {
      alert(e);
      setVisibleSpinner("hide");
    });

  }, [])

  const _getAssetPairs = async (data) => {

    let arr = Object.entries(data.result).map(([key, value], i) => {
      return value
    });

    const groupByBrand = groupBy('base');
    setListAssetPairs(groupByBrand(arr));
    // setListAssetPairs(data.result);
  }


  const _getBalance = async (data, pair) => {

    setTotalPair(findObj(data.result, pair));
    setBalance(data.result || undefined);

  }


  function _maxVolume() {
    let val = findObj(balance, selectedPair[2] )

    setVolumePair(val);
    setRequestParams("volume", val);
  }


  const addOrder = async () => {
    console.log(paramsOrder);

    /* const rawData = await fetch('http://127.0.0.1:5555/kraken/addOrder', {
       method: 'POST',
       mode: 'cors', // no-cors, *cors, same-origin
       cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
       credentials: 'same-origin', // include, *same-origin, omit
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(paramsOrder)
     }).catch((e) => {
       console.error(e)
       alert(e)
     });

     const data = await rawData.json();
     console.log(data)*/
  }


  function _showOrder(type) {
    switch (type) {
      case "order-simple":
        setNavBarOrder(["active", "", ""]);
        setorderViewArray(["show", "hide", "hide"]);

        break;
      case "order-int":
        setNavBarOrder(["", "active", ""])
        setorderViewArray(["hide", "show", "hide"]);

        break;
      case "order-adv":
        setNavBarOrder(["", "", "active"])
        setorderViewArray(["hide", "hide", "show"]);

        break;
      default:
    }
  }

  function toggleVisibilitySecondPair() {
    if (visibleListSecondPairs === "dropdown-menu small") {
      setVisibleListSecondPairs("dropdown-menu small visible");
    } else {
      setVisibleListSecondPairs("dropdown-menu small");
    }
  }

  function setRequestParams(key, val) {
    let po = paramsOrder;
    po[key] = val;
    setParamsOrder(po);
  }

  function handleVolumePair(e) {

    let value = e.target.value.replace(/[^\d.-]/g, '');

    if (value !== e.target.value) {
      tooltip_volume_pair1.classList.remove('hide');
      tooltip_volume_pair1.classList.add('show');

    } else {
      tooltip_volume_pair1.classList.remove('show');
      tooltip_volume_pair1.classList.add('hide');
    }
    setVolumePair(value);
    setTotalAmount(value * price);
    setRequestParams("volume", value);

  }

  function handlePrice(e) {
    let value = e.target.value.replace(/[^\d.-]/g, '');

    if (value !== e.target.value) {
      tooltip_volume_pair2.classList.remove('hide');
      tooltip_volume_pair2.classList.add('show');

    } else {
      tooltip_volume_pair2.classList.remove('show');
      tooltip_volume_pair2.classList.add('hide');
    }
    setPrice(value);
    setTotalAmount(value * volumePair);
    setRequestParams("price", value);
  }

  function _cancelVolumePair() {
    setVolumePair("");
    setRequestParams("volume", 0);
  }


  function _changeSelectedPair (wsname, base, quote) {
    let pair = (wsname.split("/"));
    setRequestParams("pair", pair[0].concat(pair[1]));
    pair.push(base);
    pair.push(quote);
    setSelectedPair(pair);
    fetchDataFromApi("balance").then((ris)=>{
        _getBalance(ris,base);
    });
  }

  function _renderSelectPair() {
    return (
      <div className="ib hmarg20left">
        <div id="dropdown-list-pairs" className="dropdown" onClick={() =>{ document.querySelector("#dropdown-list-pairs").classList.toggle("open");}}>
          <a className="btn dropdown-toggle">
            <span className="pairtext"> {selectedPair[0]}/{selectedPair[1]}</span>
            <span className="caret"></span>
          </a>
          <ul className="z-index-100000 dropdown-menu pair-selector" role="menu"
              aria-labelledby="dLabel">

            {
              Object.entries(listAssetPairs || {}).map(([key, arr], i) => {
                return (
                  <li className="dropdown-submenu" id={key}>
                    <a href="!#">{key}</a>
                    <ul className="dropdown-menu pairlist" >
                    {
                      Object.entries(arr).map(([keyArr, value]) => {
                        return (
                            <li id={keyArr} ><a className="currpairs" onClick={()=>{_changeSelectedPair(value.wsname, value.base, value.quote)}}>{value.wsname}</a></li>
                        )
                      })
                    }
                    </ul>
                  </li>
                )
              })
            }
          </ul>


        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Add Order</h1>
      <Spinner visibleSpinner={visibleSpinner} spinnerWidth={spinnerWidth}></Spinner>

      <div class="margin-top-10">
        <span class="margin-right-20">
        Total Balance {selectedPair[0]} {totalPair}
        </span>
        {_renderSelectPair()}
      </div>
      <div className="tab-pane active" id="new-order">
        <div id="order-form-nav">
          <ul className="nav nav-pills spaced20 mini dark vmarg30bot">
            <li className="margin-left-20" onClick={() => {
              _showOrder("order-simple");
            }}>
              <a id="order-simple" href="!#" className={navbarOrder[0]}>Simple </a>
            </li>
            <li className="margin-left-20" onClick={() => {
              _showOrder("order-int");
            }}>
              <a id="order-int" href="!#" className={navbarOrder[1]}>Intermediate </a>
            </li>
            <li className="margin-left-20" onClick={() => {
              _showOrder("order-adv");
            }}>
              <a id="order-adv" href="!#" className={navbarOrder[2]}>Advanced </a>
            </li>
          </ul>
        </div>

        <form className="form-order form-order-simple jq-validate-form vmarg5top" noValidate="novalidate">
          <fieldset>

            <div id="order-simple" className={orderViewArray[0]}>
              <div className="ib hmarg20right font-size-14">
                <div className="ib btn-group" data-toggle="buttons-radio" name="type">
                  <button type="button" value="buy" className={btnOrderType[0]} autoComplete="off" onClick={() => {
                    setBtnOrderType(["btn btn-success", "btn"]);
                    setRequestParams("type", "buy");
                  }}>Buy
                  </button>
                  <button type="button" value="sell" className={btnOrderType[1]} autoComplete="off" onClick={() => {
                    setBtnOrderType(["btn", "btn btn-danger"]);
                    setRequestParams("type", "sell");
                  }}>Sell
                  </button>
                </div>
              </div>

              <div className="btn totalcoin" onClick={() => {
                _maxVolume()
              }}>All In
              </div>

              <div className="ib control-group">
                <div className="input-append">
                  <input placeholder="Amount" tabIndex="1" type="text" autoComplete="off" value={volumePair}
                         onChange={handleVolumePair}
                         className="input-medium ralign hmarg0right" name="volume"/>
                  <div id="tooltip_volume_pair1" className="tooltip hide"> Only digit and "." for decimal</div>

                  <div className="ib posrel">
                    <div className="dropdown" onClick={() => {
                      toggleVisibilitySecondPair();
                    }}>
                      <a title="" className="btn add-on volume-currency-toggle dropdown-toggle tt"
                         data-toggle="dropdown"
                         data-original-title="Click to switch amount currency.">
                        {selectedPair[0]} <span className="caret"></span>
                      </a>
                      <ul className={visibleListSecondPairs}>
                        <li onClick={() => {
                          setSelectedPair([selectedPair[0], selectedPair[1],selectedPair[2],selectedPair[3]]);
                          fetchDataFromApi("balance").then((ris)=>{
                            _getBalance(ris,selectedPair[2]);
                          });
                        }}>
                          <a tabIndex="1">({selectedPair[0]})</a>
                        </li>
                        <li onClick={() => {
                          setSelectedPair([selectedPair[1], selectedPair[0],selectedPair[3],selectedPair[2]]);
                          fetchDataFromApi("balance").then((ris)=>{
                            _getBalance(ris,selectedPair[3]);
                          });
                        }}>
                          <a tabIndex="1">({selectedPair[1]})</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <p className="control-hint">Amount of {selectedPair[0]} to {paramsOrder.type}. </p>

              </div>
              <div className="ib symbol calc-op-symbol pointer" onClick={() => {
                _cancelVolumePair();
              }}>×
              </div>

              <div className="ib control-group">
                <div className="ib">
                  <div className="input-append">
                    <input type="text" placeholder="Price" tabIndex="2" className={disableLimitPrice[1]} value={price}
                           onChange={handlePrice}
                           name="price" autoComplete="off" disabled={disableLimitPrice[0]}/><span
                    className="add-on pair hmarg20right">EUR</span>
                    <div id="tooltip_volume_pair2" className="tooltip hide"> Only digit and "." for decimal</div>

                  </div>
                </div>
                <div className="ib ordertype-wrap">
                  <div className="btn-group" data-toggle="buttons-radio" name="ordertype">
                    <button type="button" className={btnType[0]} value="market" autoComplete="off" onClick={() => {
                      setBtnType(["btn btn-type btn-small active", "btn btn-type btn-small"]);
                      setRequestParams("ordertype", "market");
                      setDisableLimitPrice([true, 'input-small ralign hmarg0right disabled', "input-medium ralign hmarg0right disabled"]);
                    }}>Market
                    </button>
                    <button type="button" className={btnType[1]} value="limit" autoComplete="off" onClick={() => {
                      setBtnType(["btn btn-type btn-small", "btn btn-type btn-small active"]);
                      setRequestParams("ordertype", "limit");
                      setDisableLimitPrice([false, 'input-small ralign hmarg0right', "input-medium ralign hmarg0right"]);
                    }}>Limit
                    </button>
                  </div>
                </div>
                <p className="control-hint" name="ordertype-hint"><span
                  className="capitalize">{paramsOrder.type}</span> at a {paramsOrder.ordertype} price
                  per {selectedPair[0]}.</p>
              </div>
              <div className="ib symbol">=</div>
              <div className="ib control-group">
                <div className="input-append">
                  <input placeholder="Total" type="text" tabIndex="3" autoComplete="off" value={totalAmount}
                         onChange={() => {
                         }}
                         className={disableLimitPrice[2]} name="total" disabled={disableLimitPrice[0]}/><span
                  className="add-on pair">EUR</span>
                </div>
                <p className="control-hint" name="total-hint">Estimated amount of EUR.</p>
              </div>
            </div>

            <div className="row vpad20 center posrel">
              <span className="">
                <button autoComplete="off" type="button" className="btn-order-review btn submit btn-success btn-large"
                        onClick={() => {
                          addOrder()
                        }}>
                  <span
                    className="capitalize">{paramsOrder.type}</span> <span>{selectedPair[0]} with {selectedPair[1]}</span>
                </button>
              </span>
              <span id="skip-confirmation-wrap" className="">
                 <input type="checkbox" name="skip-confirmation"/>Skip order confirmations.
              </span>
            </div>


            <div id="order-int" className={orderViewArray[1]}>
              work in progress
            </div>

            <div id="order-adv" className={orderViewArray[2]}>
              {/*<div className="frame ">*/}
              {/*  <h4 className="line-title vmarg20top"><span className="title">Primary Order</span></h4>*/}

              {/*  <div className="row">*/}
              {/*    <div className="span6">*/}
              {/*      <div className="control-group">*/}
              {/*        <label className="control-label">Order</label>*/}
              {/*        <div className="controls">*/}
              {/*          <div className="ib">*/}
              {/*            <div className="btn-group" data-toggle="buttons-radio" name="type">*/}
              {/*              <button type="button" value="buy" className="btn btn-success active"*/}
              {/*                      autoComplete="off">Buy*/}
              {/*              </button>*/}
              {/*              <button type="button" value="sell" className="btn" autoComplete="off">Sell</button>*/}
              {/*            </div>*/}
              {/*          </div>*/}
              {/*          <div className="ib hmarg20left">*/}
              {/*            <input type="hidden" name="asset" value="XBTEUR"/>*/}
              {/*            <div className="dropdown">*/}
              {/*              <a className="btn dropdown-toggle" data-toggle="dropdown" href="!#">*/}
              {/*                <span className="pairtext">XBT/EUR</span>*/}
              {/*                <span className="caret"></span>*/}
              {/*              </a>*/}
              {/*              <ul className="z-index-100000 dropdown-menu pair-selector" role="menu"*/}
              {/*                  aria-labelledby="dLabel">*/}
              {/*                <li className="dropdown-submenu" id="XBT">*/}
              {/*                  <a tabIndex="-1" href="!#">XBT</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ADAXBT"*/}
              {/*                           data-pair-text="ADA/XBT">ADA/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ALGOXBT"*/}
              {/*                           data-pair-text="ALGO/XBT">ALGO/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ATOMXBT"*/}
              {/*                           data-pair-text="ATOM/XBT">ATOM/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BATXBT"*/}
              {/*                           data-pair-text="BAT/XBT">BAT/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BCHXBT"*/}
              {/*                           data-pair-text="BCH/XBT">BCH/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="COMPXBT"*/}
              {/*                           data-pair-text="COMP/XBT">COMP/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DASHXBT"*/}
              {/*                           data-pair-text="DASH/XBT">DASH/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DOTXBT"*/}
              {/*                           data-pair-text="DOT/XBT">DOT/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EOSXBT"*/}
              {/*                           data-pair-text="EOS/XBT">EOS/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETCXBT"*/}
              {/*                           data-pair-text="ETC/XBT">ETC/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHXBT"*/}
              {/*                           data-pair-text="ETH/XBT">ETH/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="GNOXBT"*/}
              {/*                           data-pair-text="GNO/XBT">GNO/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ICXXBT"*/}
              {/*                           data-pair-text="ICX/XBT">ICX/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="KAVAXBT"*/}
              {/*                           data-pair-text="KAVA/XBT">KAVA/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="KNCXBT"*/}
              {/*                           data-pair-text="KNC/XBT">KNC/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LINKXBT"*/}
              {/*                           data-pair-text="LINK/XBT">LINK/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LSKXBT"*/}
              {/*                           data-pair-text="LSK/XBT">LSK/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LTCXBT"*/}
              {/*                           data-pair-text="LTC/XBT">LTC/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="MLNXBT"*/}
              {/*                           data-pair-text="MLN/XBT">MLN/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="NANOXBT"*/}
              {/*                           data-pair-text="NANO/XBT">NANO/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="OMGXBT"*/}
              {/*                           data-pair-text="OMG/XBT">OMG/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="OXTXBT"*/}
              {/*                           data-pair-text="OXT/XBT">OXT/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="PAXGXBT"*/}
              {/*                           data-pair-text="PAXG/XBT">PAXG/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="QTUMXBT"*/}
              {/*                           data-pair-text="QTUM/XBT">QTUM/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="REPXBT"*/}
              {/*                           data-pair-text="REP/XBT">REP/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="REPV2XBT"*/}
              {/*                           data-pair-text="REPV2/XBT">REPV2/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="SCXBT"*/}
              {/*                           data-pair-text="SC/XBT">SC/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="STORJXBT"*/}
              {/*                           data-pair-text="STORJ/XBT">STORJ/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="TRXXBT"*/}
              {/*                           data-pair-text="TRX/XBT">TRX/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="WAVESXBT"*/}
              {/*                           data-pair-text="WAVES/XBT">WAVES/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTAUD"*/}
              {/*                           data-pair-text="XBT/AUD">XBT/AUD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTCAD"*/}
              {/*                           data-pair-text="XBT/CAD">XBT/CAD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTCHF"*/}
              {/*                           data-pair-text="XBT/CHF">XBT/CHF</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTDAI"*/}
              {/*                           data-pair-text="XBT/DAI">XBT/DAI</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTEUR"*/}
              {/*                           data-pair-text="XBT/EUR">XBT/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTGBP"*/}
              {/*                           data-pair-text="XBT/GBP">XBT/GBP</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTJPY"*/}
              {/*                           data-pair-text="XBT/JPY">XBT/JPY</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTUSD"*/}
              {/*                           data-pair-text="XBT/USD">XBT/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTUSDC"*/}
              {/*                           data-pair-text="XBT/USDC">XBT/USDC</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTUSDT"*/}
              {/*                           data-pair-text="XBT/USDT">XBT/USDT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XDGXBT"*/}
              {/*                           data-pair-text="XDG/XBT">XDG/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XLMXBT"*/}
              {/*                           data-pair-text="XLM/XBT">XLM/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XMRXBT"*/}
              {/*                           data-pair-text="XMR/XBT">XMR/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XRPXBT"*/}
              {/*                           data-pair-text="XRP/XBT">XRP/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XTZXBT"*/}
              {/*                           data-pair-text="XTZ/XBT">XTZ/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ZECXBT"*/}
              {/*                           data-pair-text="ZEC/XBT">ZEC/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="ADA">*/}
              {/*                  <a tabIndex="-1" href="!#">ADA</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ADAETH"*/}
              {/*                           data-pair-text="ADA/ETH">ADA/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ADAEUR"*/}
              {/*                           data-pair-text="ADA/EUR">ADA/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ADAUSD"*/}
              {/*                           data-pair-text="ADA/USD">ADA/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ADAXBT"*/}
              {/*                           data-pair-text="ADA/XBT">ADA/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="ALGO">*/}
              {/*                  <a tabIndex="-1" href="!#">ALGO</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ALGOETH"*/}
              {/*                           data-pair-text="ALGO/ETH">ALGO/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ALGOEUR"*/}
              {/*                           data-pair-text="ALGO/EUR">ALGO/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ALGOUSD"*/}
              {/*                           data-pair-text="ALGO/USD">ALGO/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ALGOXBT"*/}
              {/*                           data-pair-text="ALGO/XBT">ALGO/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="ATOM">*/}
              {/*                  <a tabIndex="-1" href="!#">ATOM</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ATOMETH"*/}
              {/*                           data-pair-text="ATOM/ETH">ATOM/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ATOMEUR"*/}
              {/*                           data-pair-text="ATOM/EUR">ATOM/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ATOMUSD"*/}
              {/*                           data-pair-text="ATOM/USD">ATOM/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ATOMXBT"*/}
              {/*                           data-pair-text="ATOM/XBT">ATOM/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="AUD">*/}
              {/*                  <a tabIndex="-1" href="!#">AUD</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="AUDJPY"*/}
              {/*                           data-pair-text="AUD/JPY">AUD/JPY</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="AUDUSD"*/}
              {/*                           data-pair-text="AUD/USD">AUD/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BCHAUD"*/}
              {/*                           data-pair-text="BCH/AUD">BCH/AUD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHAUD"*/}
              {/*                           data-pair-text="ETH/AUD">ETH/AUD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EURAUD"*/}
              {/*                           data-pair-text="EUR/AUD">EUR/AUD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LTCAUD"*/}
              {/*                           data-pair-text="LTC/AUD">LTC/AUD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDTAUD"*/}
              {/*                           data-pair-text="USDT/AUD">USDT/AUD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTAUD"*/}
              {/*                           data-pair-text="XBT/AUD">XBT/AUD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XRPAUD"*/}
              {/*                           data-pair-text="XRP/AUD">XRP/AUD</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="BAT">*/}
              {/*                  <a tabIndex="-1" href="!#">BAT</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BATETH"*/}
              {/*                           data-pair-text="BAT/ETH">BAT/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BATEUR"*/}
              {/*                           data-pair-text="BAT/EUR">BAT/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BATUSD"*/}
              {/*                           data-pair-text="BAT/USD">BAT/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BATXBT"*/}
              {/*                           data-pair-text="BAT/XBT">BAT/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="BCH">*/}
              {/*                  <a tabIndex="-1" href="!#">BCH</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BCHAUD"*/}
              {/*                           data-pair-text="BCH/AUD">BCH/AUD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BCHETH"*/}
              {/*                           data-pair-text="BCH/ETH">BCH/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BCHEUR"*/}
              {/*                           data-pair-text="BCH/EUR">BCH/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BCHGBP"*/}
              {/*                           data-pair-text="BCH/GBP">BCH/GBP</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BCHUSD"*/}
              {/*                           data-pair-text="BCH/USD">BCH/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BCHUSDT"*/}
              {/*                           data-pair-text="BCH/USDT">BCH/USDT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BCHXBT"*/}
              {/*                           data-pair-text="BCH/XBT">BCH/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="CAD">*/}
              {/*                  <a tabIndex="-1" href="!#">CAD</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHCAD"*/}
              {/*                           data-pair-text="ETH/CAD">ETH/CAD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EURCAD"*/}
              {/*                           data-pair-text="EUR/CAD">EUR/CAD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDCAD"*/}
              {/*                           data-pair-text="USD/CAD">USD/CAD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDTCAD"*/}
              {/*                           data-pair-text="USDT/CAD">USDT/CAD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTCAD"*/}
              {/*                           data-pair-text="XBT/CAD">XBT/CAD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XRPCAD"*/}
              {/*                           data-pair-text="XRP/CAD">XRP/CAD</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="CHF">*/}
              {/*                  <a tabIndex="-1" href="!#">CHF</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHCHF"*/}
              {/*                           data-pair-text="ETH/CHF">ETH/CHF</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EURCHF"*/}
              {/*                           data-pair-text="EUR/CHF">EUR/CHF</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDCHF"*/}
              {/*                           data-pair-text="USD/CHF">USD/CHF</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDTCHF"*/}
              {/*                           data-pair-text="USDT/CHF">USDT/CHF</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTCHF"*/}
              {/*                           data-pair-text="XBT/CHF">XBT/CHF</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="COMP">*/}
              {/*                  <a tabIndex="-1" href="!#">COMP</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="COMPETH"*/}
              {/*                           data-pair-text="COMP/ETH">COMP/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="COMPEUR"*/}
              {/*                           data-pair-text="COMP/EUR">COMP/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="COMPUSD"*/}
              {/*                           data-pair-text="COMP/USD">COMP/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="COMPXBT"*/}
              {/*                           data-pair-text="COMP/XBT">COMP/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="DAI">*/}
              {/*                  <a tabIndex="-1" href="!#">DAI</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DAIEUR"*/}
              {/*                           data-pair-text="DAI/EUR">DAI/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DAIUSD"*/}
              {/*                           data-pair-text="DAI/USD">DAI/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DAIUSDT"*/}
              {/*                           data-pair-text="DAI/USDT">DAI/USDT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHDAI"*/}
              {/*                           data-pair-text="ETH/DAI">ETH/DAI</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTDAI"*/}
              {/*                           data-pair-text="XBT/DAI">XBT/DAI</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="DASH">*/}
              {/*                  <a tabIndex="-1" href="!#">DASH</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DASHEUR"*/}
              {/*                           data-pair-text="DASH/EUR">DASH/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DASHUSD"*/}
              {/*                           data-pair-text="DASH/USD">DASH/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DASHXBT"*/}
              {/*                           data-pair-text="DASH/XBT">DASH/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="DOT">*/}
              {/*                  <a tabIndex="-1" href="!#">DOT</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DOTETH"*/}
              {/*                           data-pair-text="DOT/ETH">DOT/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DOTEUR"*/}
              {/*                           data-pair-text="DOT/EUR">DOT/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DOTUSD"*/}
              {/*                           data-pair-text="DOT/USD">DOT/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DOTXBT"*/}
              {/*                           data-pair-text="DOT/XBT">DOT/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="EOS">*/}
              {/*                  <a tabIndex="-1" href="!#">EOS</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EOSETH"*/}
              {/*                           data-pair-text="EOS/ETH">EOS/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EOSEUR"*/}
              {/*                           data-pair-text="EOS/EUR">EOS/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EOSUSD"*/}
              {/*                           data-pair-text="EOS/USD">EOS/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EOSXBT"*/}
              {/*                           data-pair-text="EOS/XBT">EOS/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="ETC">*/}
              {/*                  <a tabIndex="-1" href="!#">ETC</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETCETH"*/}
              {/*                           data-pair-text="ETC/ETH">ETC/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETCEUR"*/}
              {/*                           data-pair-text="ETC/EUR">ETC/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETCUSD"*/}
              {/*                           data-pair-text="ETC/USD">ETC/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETCXBT"*/}
              {/*                           data-pair-text="ETC/XBT">ETC/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="ETH">*/}
              {/*                  <a tabIndex="-1" href="!#">ETH</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ADAETH"*/}
              {/*                           data-pair-text="ADA/ETH">ADA/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ALGOETH"*/}
              {/*                           data-pair-text="ALGO/ETH">ALGO/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ATOMETH"*/}
              {/*                           data-pair-text="ATOM/ETH">ATOM/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BATETH"*/}
              {/*                           data-pair-text="BAT/ETH">BAT/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BCHETH"*/}
              {/*                           data-pair-text="BCH/ETH">BCH/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="COMPETH"*/}
              {/*                           data-pair-text="COMP/ETH">COMP/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DOTETH"*/}
              {/*                           data-pair-text="DOT/ETH">DOT/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EOSETH"*/}
              {/*                           data-pair-text="EOS/ETH">EOS/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETCETH"*/}
              {/*                           data-pair-text="ETC/ETH">ETC/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHAUD"*/}
              {/*                           data-pair-text="ETH/AUD">ETH/AUD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHCAD"*/}
              {/*                           data-pair-text="ETH/CAD">ETH/CAD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHCHF"*/}
              {/*                           data-pair-text="ETH/CHF">ETH/CHF</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHDAI"*/}
              {/*                           data-pair-text="ETH/DAI">ETH/DAI</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHEUR"*/}
              {/*                           data-pair-text="ETH/EUR">ETH/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHGBP"*/}
              {/*                           data-pair-text="ETH/GBP">ETH/GBP</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHJPY"*/}
              {/*                           data-pair-text="ETH/JPY">ETH/JPY</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHUSD"*/}
              {/*                           data-pair-text="ETH/USD">ETH/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHUSDC"*/}
              {/*                           data-pair-text="ETH/USDC">ETH/USDC</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHUSDT"*/}
              {/*                           data-pair-text="ETH/USDT">ETH/USDT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHXBT"*/}
              {/*                           data-pair-text="ETH/XBT">ETH/XBT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="GNOETH"*/}
              {/*                           data-pair-text="GNO/ETH">GNO/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ICXETH"*/}
              {/*                           data-pair-text="ICX/ETH">ICX/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="KAVAETH"*/}
              {/*                           data-pair-text="KAVA/ETH">KAVA/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="KNCETH"*/}
              {/*                           data-pair-text="KNC/ETH">KNC/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LINKETH"*/}
              {/*                           data-pair-text="LINK/ETH">LINK/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LSKETH"*/}
              {/*                           data-pair-text="LSK/ETH">LSK/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LTCETH"*/}
              {/*                           data-pair-text="LTC/ETH">LTC/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="MLNETH"*/}
              {/*                           data-pair-text="MLN/ETH">MLN/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="NANOETH"*/}
              {/*                           data-pair-text="NANO/ETH">NANO/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="OMGETH"*/}
              {/*                           data-pair-text="OMG/ETH">OMG/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="OXTETH"*/}
              {/*                           data-pair-text="OXT/ETH">OXT/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="PAXGETH"*/}
              {/*                           data-pair-text="PAXG/ETH">PAXG/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="QTUMETH"*/}
              {/*                           data-pair-text="QTUM/ETH">QTUM/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="REPETH"*/}
              {/*                           data-pair-text="REP/ETH">REP/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="REPV2ETH"*/}
              {/*                           data-pair-text="REPV2/ETH">REPV2/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="SCETH"*/}
              {/*                           data-pair-text="SC/ETH">SC/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="STORJETH"*/}
              {/*                           data-pair-text="STORJ/ETH">STORJ/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="TRXETH"*/}
              {/*                           data-pair-text="TRX/ETH">TRX/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="WAVESETH"*/}
              {/*                           data-pair-text="WAVES/ETH">WAVES/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XRPETH"*/}
              {/*                           data-pair-text="XRP/ETH">XRP/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XTZETH"*/}
              {/*                           data-pair-text="XTZ/ETH">XTZ/ETH</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="EUR">*/}
              {/*                  <a tabIndex="-1" href="!#">EUR</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ADAEUR"*/}
              {/*                           data-pair-text="ADA/EUR">ADA/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ALGOEUR"*/}
              {/*                           data-pair-text="ALGO/EUR">ALGO/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ATOMEUR"*/}
              {/*                           data-pair-text="ATOM/EUR">ATOM/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BATEUR"*/}
              {/*                           data-pair-text="BAT/EUR">BAT/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BCHEUR"*/}
              {/*                           data-pair-text="BCH/EUR">BCH/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="COMPEUR"*/}
              {/*                           data-pair-text="COMP/EUR">COMP/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DAIEUR"*/}
              {/*                           data-pair-text="DAI/EUR">DAI/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DASHEUR"*/}
              {/*                           data-pair-text="DASH/EUR">DASH/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DOTEUR"*/}
              {/*                           data-pair-text="DOT/EUR">DOT/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EOSEUR"*/}
              {/*                           data-pair-text="EOS/EUR">EOS/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETCEUR"*/}
              {/*                           data-pair-text="ETC/EUR">ETC/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHEUR"*/}
              {/*                           data-pair-text="ETH/EUR">ETH/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EURAUD"*/}
              {/*                           data-pair-text="EUR/AUD">EUR/AUD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EURCAD"*/}
              {/*                           data-pair-text="EUR/CAD">EUR/CAD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EURCHF"*/}
              {/*                           data-pair-text="EUR/CHF">EUR/CHF</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EURGBP"*/}
              {/*                           data-pair-text="EUR/GBP">EUR/GBP</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EURJPY"*/}
              {/*                           data-pair-text="EUR/JPY">EUR/JPY</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EURUSD"*/}
              {/*                           data-pair-text="EUR/USD">EUR/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="GNOEUR"*/}
              {/*                           data-pair-text="GNO/EUR">GNO/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ICXEUR"*/}
              {/*                           data-pair-text="ICX/EUR">ICX/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="KAVAEUR"*/}
              {/*                           data-pair-text="KAVA/EUR">KAVA/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="KNCEUR"*/}
              {/*                           data-pair-text="KNC/EUR">KNC/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LINKEUR"*/}
              {/*                           data-pair-text="LINK/EUR">LINK/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LSKEUR"*/}
              {/*                           data-pair-text="LSK/EUR">LSK/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LTCEUR"*/}
              {/*                           data-pair-text="LTC/EUR">LTC/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="MLNEUR"*/}
              {/*                           data-pair-text="MLN/EUR">MLN/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="NANOEUR"*/}
              {/*                           data-pair-text="NANO/EUR">NANO/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="OMGEUR"*/}
              {/*                           data-pair-text="OMG/EUR">OMG/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="OXTEUR"*/}
              {/*                           data-pair-text="OXT/EUR">OXT/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="PAXGEUR"*/}
              {/*                           data-pair-text="PAXG/EUR">PAXG/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="QTUMEUR"*/}
              {/*                           data-pair-text="QTUM/EUR">QTUM/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="REPEUR"*/}
              {/*                           data-pair-text="REP/EUR">REP/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="REPV2EUR"*/}
              {/*                           data-pair-text="REPV2/EUR">REPV2/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="SCEUR"*/}
              {/*                           data-pair-text="SC/EUR">SC/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="STORJEUR"*/}
              {/*                           data-pair-text="STORJ/EUR">STORJ/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="TRXEUR"*/}
              {/*                           data-pair-text="TRX/EUR">TRX/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDCEUR"*/}
              {/*                           data-pair-text="USDC/EUR">USDC/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDTEUR"*/}
              {/*                           data-pair-text="USDT/EUR">USDT/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="WAVESEUR"*/}
              {/*                           data-pair-text="WAVES/EUR">WAVES/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTEUR"*/}
              {/*                           data-pair-text="XBT/EUR">XBT/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XDGEUR"*/}
              {/*                           data-pair-text="XDG/EUR">XDG/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XLMEUR"*/}
              {/*                           data-pair-text="XLM/EUR">XLM/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XMREUR"*/}
              {/*                           data-pair-text="XMR/EUR">XMR/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XRPEUR"*/}
              {/*                           data-pair-text="XRP/EUR">XRP/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XTZEUR"*/}
              {/*                           data-pair-text="XTZ/EUR">XTZ/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ZECEUR"*/}
              {/*                           data-pair-text="ZEC/EUR">ZEC/EUR</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="GBP">*/}
              {/*                  <a tabIndex="-1" href="!#">GBP</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BCHGBP"*/}
              {/*                           data-pair-text="BCH/GBP">BCH/GBP</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHGBP"*/}
              {/*                           data-pair-text="ETH/GBP">ETH/GBP</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EURGBP"*/}
              {/*                           data-pair-text="EUR/GBP">EUR/GBP</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="GBPUSD"*/}
              {/*                           data-pair-text="GBP/USD">GBP/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LTCGBP"*/}
              {/*                           data-pair-text="LTC/GBP">LTC/GBP</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDTGBP"*/}
              {/*                           data-pair-text="USDT/GBP">USDT/GBP</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTGBP"*/}
              {/*                           data-pair-text="XBT/GBP">XBT/GBP</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XRPGBP"*/}
              {/*                           data-pair-text="XRP/GBP">XRP/GBP</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="GNO">*/}
              {/*                  <a tabIndex="-1" href="!#">GNO</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="GNOETH"*/}
              {/*                           data-pair-text="GNO/ETH">GNO/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="GNOEUR"*/}
              {/*                           data-pair-text="GNO/EUR">GNO/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="GNOUSD"*/}
              {/*                           data-pair-text="GNO/USD">GNO/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="GNOXBT"*/}
              {/*                           data-pair-text="GNO/XBT">GNO/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="ICX">*/}
              {/*                  <a tabIndex="-1" href="!#">ICX</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ICXETH"*/}
              {/*                           data-pair-text="ICX/ETH">ICX/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ICXEUR"*/}
              {/*                           data-pair-text="ICX/EUR">ICX/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ICXUSD"*/}
              {/*                           data-pair-text="ICX/USD">ICX/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ICXXBT"*/}
              {/*                           data-pair-text="ICX/XBT">ICX/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="JPY">*/}
              {/*                  <a tabIndex="-1" href="!#">JPY</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="AUDJPY"*/}
              {/*                           data-pair-text="AUD/JPY">AUD/JPY</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHJPY"*/}
              {/*                           data-pair-text="ETH/JPY">ETH/JPY</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EURJPY"*/}
              {/*                           data-pair-text="EUR/JPY">EUR/JPY</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDJPY"*/}
              {/*                           data-pair-text="USD/JPY">USD/JPY</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDTJPY"*/}
              {/*                           data-pair-text="USDT/JPY">USDT/JPY</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTJPY"*/}
              {/*                           data-pair-text="XBT/JPY">XBT/JPY</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XRPJPY"*/}
              {/*                           data-pair-text="XRP/JPY">XRP/JPY</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="KAVA">*/}
              {/*                  <a tabIndex="-1" href="!#">KAVA</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="KAVAETH"*/}
              {/*                           data-pair-text="KAVA/ETH">KAVA/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="KAVAEUR"*/}
              {/*                           data-pair-text="KAVA/EUR">KAVA/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="KAVAUSD"*/}
              {/*                           data-pair-text="KAVA/USD">KAVA/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="KAVAXBT"*/}
              {/*                           data-pair-text="KAVA/XBT">KAVA/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="KNC">*/}
              {/*                  <a tabIndex="-1" href="!#">KNC</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="KNCETH"*/}
              {/*                           data-pair-text="KNC/ETH">KNC/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="KNCEUR"*/}
              {/*                           data-pair-text="KNC/EUR">KNC/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="KNCUSD"*/}
              {/*                           data-pair-text="KNC/USD">KNC/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="KNCXBT"*/}
              {/*                           data-pair-text="KNC/XBT">KNC/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="LINK">*/}
              {/*                  <a tabIndex="-1" href="!#">LINK</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LINKETH"*/}
              {/*                           data-pair-text="LINK/ETH">LINK/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LINKEUR"*/}
              {/*                           data-pair-text="LINK/EUR">LINK/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LINKUSD"*/}
              {/*                           data-pair-text="LINK/USD">LINK/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LINKXBT"*/}
              {/*                           data-pair-text="LINK/XBT">LINK/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="LSK">*/}
              {/*                  <a tabIndex="-1" href="!#">LSK</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LSKETH"*/}
              {/*                           data-pair-text="LSK/ETH">LSK/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LSKEUR"*/}
              {/*                           data-pair-text="LSK/EUR">LSK/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LSKUSD"*/}
              {/*                           data-pair-text="LSK/USD">LSK/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LSKXBT"*/}
              {/*                           data-pair-text="LSK/XBT">LSK/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="LTC">*/}
              {/*                  <a tabIndex="-1" href="!#">LTC</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LTCAUD"*/}
              {/*                           data-pair-text="LTC/AUD">LTC/AUD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LTCETH"*/}
              {/*                           data-pair-text="LTC/ETH">LTC/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LTCEUR"*/}
              {/*                           data-pair-text="LTC/EUR">LTC/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LTCGBP"*/}
              {/*                           data-pair-text="LTC/GBP">LTC/GBP</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LTCUSD"*/}
              {/*                           data-pair-text="LTC/USD">LTC/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LTCUSDT"*/}
              {/*                           data-pair-text="LTC/USDT">LTC/USDT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LTCXBT"*/}
              {/*                           data-pair-text="LTC/XBT">LTC/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="MLN">*/}
              {/*                  <a tabIndex="-1" href="!#">MLN</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="MLNETH"*/}
              {/*                           data-pair-text="MLN/ETH">MLN/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="MLNEUR"*/}
              {/*                           data-pair-text="MLN/EUR">MLN/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="MLNUSD"*/}
              {/*                           data-pair-text="MLN/USD">MLN/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="MLNXBT"*/}
              {/*                           data-pair-text="MLN/XBT">MLN/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="NANO">*/}
              {/*                  <a tabIndex="-1" href="!#">NANO</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="NANOETH"*/}
              {/*                           data-pair-text="NANO/ETH">NANO/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="NANOEUR"*/}
              {/*                           data-pair-text="NANO/EUR">NANO/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="NANOUSD"*/}
              {/*                           data-pair-text="NANO/USD">NANO/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="NANOXBT"*/}
              {/*                           data-pair-text="NANO/XBT">NANO/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="OMG">*/}
              {/*                  <a tabIndex="-1" href="!#">OMG</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="OMGETH"*/}
              {/*                           data-pair-text="OMG/ETH">OMG/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="OMGEUR"*/}
              {/*                           data-pair-text="OMG/EUR">OMG/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="OMGUSD"*/}
              {/*                           data-pair-text="OMG/USD">OMG/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="OMGXBT"*/}
              {/*                           data-pair-text="OMG/XBT">OMG/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="OXT">*/}
              {/*                  <a tabIndex="-1" href="!#">OXT</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="OXTETH"*/}
              {/*                           data-pair-text="OXT/ETH">OXT/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="OXTEUR"*/}
              {/*                           data-pair-text="OXT/EUR">OXT/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="OXTUSD"*/}
              {/*                           data-pair-text="OXT/USD">OXT/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="OXTXBT"*/}
              {/*                           data-pair-text="OXT/XBT">OXT/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="PAXG">*/}
              {/*                  <a tabIndex="-1" href="!#">PAXG</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="PAXGETH"*/}
              {/*                           data-pair-text="PAXG/ETH">PAXG/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="PAXGEUR"*/}
              {/*                           data-pair-text="PAXG/EUR">PAXG/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="PAXGUSD"*/}
              {/*                           data-pair-text="PAXG/USD">PAXG/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="PAXGXBT"*/}
              {/*                           data-pair-text="PAXG/XBT">PAXG/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="QTUM">*/}
              {/*                  <a tabIndex="-1" href="!#">QTUM</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="QTUMETH"*/}
              {/*                           data-pair-text="QTUM/ETH">QTUM/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="QTUMEUR"*/}
              {/*                           data-pair-text="QTUM/EUR">QTUM/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="QTUMUSD"*/}
              {/*                           data-pair-text="QTUM/USD">QTUM/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="QTUMXBT"*/}
              {/*                           data-pair-text="QTUM/XBT">QTUM/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="REP">*/}
              {/*                  <a tabIndex="-1" href="!#">REP</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="REPETH"*/}
              {/*                           data-pair-text="REP/ETH">REP/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="REPEUR"*/}
              {/*                           data-pair-text="REP/EUR">REP/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="REPUSD"*/}
              {/*                           data-pair-text="REP/USD">REP/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="REPXBT"*/}
              {/*                           data-pair-text="REP/XBT">REP/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="REPV2">*/}
              {/*                  <a tabIndex="-1" href="!#">REPV2</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="REPV2ETH"*/}
              {/*                           data-pair-text="REPV2/ETH">REPV2/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="REPV2EUR"*/}
              {/*                           data-pair-text="REPV2/EUR">REPV2/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="REPV2USD"*/}
              {/*                           data-pair-text="REPV2/USD">REPV2/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="REPV2XBT"*/}
              {/*                           data-pair-text="REPV2/XBT">REPV2/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="SC">*/}
              {/*                  <a tabIndex="-1" href="!#">SC</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="SCETH"*/}
              {/*                           data-pair-text="SC/ETH">SC/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="SCEUR"*/}
              {/*                           data-pair-text="SC/EUR">SC/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="SCUSD"*/}
              {/*                           data-pair-text="SC/USD">SC/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="SCXBT"*/}
              {/*                           data-pair-text="SC/XBT">SC/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="STORJ">*/}
              {/*                  <a tabIndex="-1" href="!#">STORJ</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="STORJETH"*/}
              {/*                           data-pair-text="STORJ/ETH">STORJ/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="STORJEUR"*/}
              {/*                           data-pair-text="STORJ/EUR">STORJ/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="STORJUSD"*/}
              {/*                           data-pair-text="STORJ/USD">STORJ/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="STORJXBT"*/}
              {/*                           data-pair-text="STORJ/XBT">STORJ/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="TRX">*/}
              {/*                  <a tabIndex="-1" href="!#">TRX</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="TRXETH"*/}
              {/*                           data-pair-text="TRX/ETH">TRX/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="TRXEUR"*/}
              {/*                           data-pair-text="TRX/EUR">TRX/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="TRXUSD"*/}
              {/*                           data-pair-text="TRX/USD">TRX/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="TRXXBT"*/}
              {/*                           data-pair-text="TRX/XBT">TRX/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="USD">*/}
              {/*                  <a tabIndex="-1" href="!#">USD</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ADAUSD"*/}
              {/*                           data-pair-text="ADA/USD">ADA/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ALGOUSD"*/}
              {/*                           data-pair-text="ALGO/USD">ALGO/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ATOMUSD"*/}
              {/*                           data-pair-text="ATOM/USD">ATOM/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="AUDUSD"*/}
              {/*                           data-pair-text="AUD/USD">AUD/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BATUSD"*/}
              {/*                           data-pair-text="BAT/USD">BAT/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BCHUSD"*/}
              {/*                           data-pair-text="BCH/USD">BCH/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="COMPUSD"*/}
              {/*                           data-pair-text="COMP/USD">COMP/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DAIUSD"*/}
              {/*                           data-pair-text="DAI/USD">DAI/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DASHUSD"*/}
              {/*                           data-pair-text="DASH/USD">DASH/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DOTUSD"*/}
              {/*                           data-pair-text="DOT/USD">DOT/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EOSUSD"*/}
              {/*                           data-pair-text="EOS/USD">EOS/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETCUSD"*/}
              {/*                           data-pair-text="ETC/USD">ETC/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHUSD"*/}
              {/*                           data-pair-text="ETH/USD">ETH/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="EURUSD"*/}
              {/*                           data-pair-text="EUR/USD">EUR/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="GBPUSD"*/}
              {/*                           data-pair-text="GBP/USD">GBP/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="GNOUSD"*/}
              {/*                           data-pair-text="GNO/USD">GNO/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ICXUSD"*/}
              {/*                           data-pair-text="ICX/USD">ICX/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="KAVAUSD"*/}
              {/*                           data-pair-text="KAVA/USD">KAVA/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="KNCUSD"*/}
              {/*                           data-pair-text="KNC/USD">KNC/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LINKUSD"*/}
              {/*                           data-pair-text="LINK/USD">LINK/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LSKUSD"*/}
              {/*                           data-pair-text="LSK/USD">LSK/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LTCUSD"*/}
              {/*                           data-pair-text="LTC/USD">LTC/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="MLNUSD"*/}
              {/*                           data-pair-text="MLN/USD">MLN/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="NANOUSD"*/}
              {/*                           data-pair-text="NANO/USD">NANO/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="OMGUSD"*/}
              {/*                           data-pair-text="OMG/USD">OMG/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="OXTUSD"*/}
              {/*                           data-pair-text="OXT/USD">OXT/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="PAXGUSD"*/}
              {/*                           data-pair-text="PAXG/USD">PAXG/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="QTUMUSD"*/}
              {/*                           data-pair-text="QTUM/USD">QTUM/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="REPUSD"*/}
              {/*                           data-pair-text="REP/USD">REP/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="REPV2USD"*/}
              {/*                           data-pair-text="REPV2/USD">REPV2/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="SCUSD"*/}
              {/*                           data-pair-text="SC/USD">SC/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="STORJUSD"*/}
              {/*                           data-pair-text="STORJ/USD">STORJ/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="TRXUSD"*/}
              {/*                           data-pair-text="TRX/USD">TRX/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDCAD"*/}
              {/*                           data-pair-text="USD/CAD">USD/CAD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDCHF"*/}
              {/*                           data-pair-text="USD/CHF">USD/CHF</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDJPY"*/}
              {/*                           data-pair-text="USD/JPY">USD/JPY</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDCUSD"*/}
              {/*                           data-pair-text="USDC/USD">USDC/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDTUSD"*/}
              {/*                           data-pair-text="USDT/USD">USDT/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="WAVESUSD"*/}
              {/*                           data-pair-text="WAVES/USD">WAVES/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTUSD"*/}
              {/*                           data-pair-text="XBT/USD">XBT/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XDGUSD"*/}
              {/*                           data-pair-text="XDG/USD">XDG/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XLMUSD"*/}
              {/*                           data-pair-text="XLM/USD">XLM/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XMRUSD"*/}
              {/*                           data-pair-text="XMR/USD">XMR/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XRPUSD"*/}
              {/*                           data-pair-text="XRP/USD">XRP/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XTZUSD"*/}
              {/*                           data-pair-text="XTZ/USD">XTZ/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ZECUSD"*/}
              {/*                           data-pair-text="ZEC/USD">ZEC/USD</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="USDC">*/}
              {/*                  <a tabIndex="-1" href="!#">USDC</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHUSDC"*/}
              {/*                           data-pair-text="ETH/USDC">ETH/USDC</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDCEUR"*/}
              {/*                           data-pair-text="USDC/EUR">USDC/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDCUSD"*/}
              {/*                           data-pair-text="USDC/USD">USDC/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDCUSDT"*/}
              {/*                           data-pair-text="USDC/USDT">USDC/USDT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTUSDC"*/}
              {/*                           data-pair-text="XBT/USDC">XBT/USDC</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="USDT">*/}
              {/*                  <a tabIndex="-1" href="!#">USDT</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="BCHUSDT"*/}
              {/*                           data-pair-text="BCH/USDT">BCH/USDT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="DAIUSDT"*/}
              {/*                           data-pair-text="DAI/USDT">DAI/USDT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ETHUSDT"*/}
              {/*                           data-pair-text="ETH/USDT">ETH/USDT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="LTCUSDT"*/}
              {/*                           data-pair-text="LTC/USDT">LTC/USDT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDCUSDT"*/}
              {/*                           data-pair-text="USDC/USDT">USDC/USDT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDTAUD"*/}
              {/*                           data-pair-text="USDT/AUD">USDT/AUD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDTCAD"*/}
              {/*                           data-pair-text="USDT/CAD">USDT/CAD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDTCHF"*/}
              {/*                           data-pair-text="USDT/CHF">USDT/CHF</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDTEUR"*/}
              {/*                           data-pair-text="USDT/EUR">USDT/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDTGBP"*/}
              {/*                           data-pair-text="USDT/GBP">USDT/GBP</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDTJPY"*/}
              {/*                           data-pair-text="USDT/JPY">USDT/JPY</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="USDTUSD"*/}
              {/*                           data-pair-text="USDT/USD">USDT/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XBTUSDT"*/}
              {/*                           data-pair-text="XBT/USDT">XBT/USDT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XRPUSDT"*/}
              {/*                           data-pair-text="XRP/USDT">XRP/USDT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="WAVES">*/}
              {/*                  <a tabIndex="-1" href="!#">WAVES</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="WAVESETH"*/}
              {/*                           data-pair-text="WAVES/ETH">WAVES/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="WAVESEUR"*/}
              {/*                           data-pair-text="WAVES/EUR">WAVES/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="WAVESUSD"*/}
              {/*                           data-pair-text="WAVES/USD">WAVES/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="WAVESXBT"*/}
              {/*                           data-pair-text="WAVES/XBT">WAVES/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="XDG">*/}
              {/*                  <a tabIndex="-1" href="!#">XDG</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XDGEUR"*/}
              {/*                           data-pair-text="XDG/EUR">XDG/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XDGUSD"*/}
              {/*                           data-pair-text="XDG/USD">XDG/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XDGXBT"*/}
              {/*                           data-pair-text="XDG/XBT">XDG/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="XLM">*/}
              {/*                  <a tabIndex="-1" href="!#">XLM</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XLMEUR"*/}
              {/*                           data-pair-text="XLM/EUR">XLM/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XLMUSD"*/}
              {/*                           data-pair-text="XLM/USD">XLM/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XLMXBT"*/}
              {/*                           data-pair-text="XLM/XBT">XLM/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="XMR">*/}
              {/*                  <a tabIndex="-1" href="!#">XMR</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XMREUR"*/}
              {/*                           data-pair-text="XMR/EUR">XMR/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XMRUSD"*/}
              {/*                           data-pair-text="XMR/USD">XMR/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XMRXBT"*/}
              {/*                           data-pair-text="XMR/XBT">XMR/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="XRP">*/}
              {/*                  <a tabIndex="-1" href="!#">XRP</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XRPAUD"*/}
              {/*                           data-pair-text="XRP/AUD">XRP/AUD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XRPCAD"*/}
              {/*                           data-pair-text="XRP/CAD">XRP/CAD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XRPETH"*/}
              {/*                           data-pair-text="XRP/ETH">XRP/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XRPEUR"*/}
              {/*                           data-pair-text="XRP/EUR">XRP/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XRPGBP"*/}
              {/*                           data-pair-text="XRP/GBP">XRP/GBP</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XRPJPY"*/}
              {/*                           data-pair-text="XRP/JPY">XRP/JPY</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XRPUSD"*/}
              {/*                           data-pair-text="XRP/USD">XRP/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XRPUSDT"*/}
              {/*                           data-pair-text="XRP/USDT">XRP/USDT</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XRPXBT"*/}
              {/*                           data-pair-text="XRP/XBT">XRP/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="XTZ">*/}
              {/*                  <a tabIndex="-1" href="!#">XTZ</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XTZETH"*/}
              {/*                           data-pair-text="XTZ/ETH">XTZ/ETH</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XTZEUR"*/}
              {/*                           data-pair-text="XTZ/EUR">XTZ/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XTZUSD"*/}
              {/*                           data-pair-text="XTZ/USD">XTZ/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="XTZXBT"*/}
              {/*                           data-pair-text="XTZ/XBT">XTZ/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*                <li className="dropdown-submenu" id="ZEC">*/}
              {/*                  <a tabIndex="-1" href="!#">ZEC</a>*/}
              {/*                  <ul className="dropdown-menu pairlist">*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ZECEUR"*/}
              {/*                           data-pair-text="ZEC/EUR">ZEC/EUR</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ZECUSD"*/}
              {/*                           data-pair-text="ZEC/USD">ZEC/USD</a></li>*/}
              {/*                    <li><a className="currpairs" tabIndex="-1" href="!#" data-pair="ZECXBT"*/}
              {/*                           data-pair-text="ZEC/XBT">ZEC/XBT</a></li>*/}
              {/*                  </ul>*/}
              {/*                </li>*/}
              {/*              </ul>*/}
              {/*            </div>*/}
              {/*          </div>*/}
              {/*          <p className="control-hint">Choose to buy or sell a currency pair.</p>*/}
              {/*        </div>*/}
              {/*      </div>*/}
              {/*      <div className="control-group">*/}
              {/*        <label className="control-label">Volume</label>*/}
              {/*        <div className="controls">*/}
              {/*          <div className="input-append">*/}
              {/*            <input type="text" autoComplete="off" className="span2 ralign hmarg0right"*/}
              {/*                   name="volume"/>*/}
              {/*            <div className="ib posrel">*/}
              {/*              <div className="dropdown">*/}
              {/*                <a title="" data-value="XXBT" href="!#"*/}
              {/*                   className="btn add-on volume-currency-toggle rounded dropdown-toggle tt"*/}
              {/*                   data-toggle="dropdown"*/}
              {/*                   data-original-title="Click to switch amount currency.">XBT <span*/}
              {/*                  className="caret"></span></a>*/}
              {/*                <ul className="dropdown-menu small">*/}
              {/*                  <li data-value="XXBT" data-display="XBT" className="disabled">*/}
              {/*                    <a href="!#">Bitcoin (XBT)</a>*/}
              {/*                  </li>*/}
              {/*                  <li data-value="ZEUR" data-display="EUR">*/}
              {/*                    <a href="!#">Euro (EUR)</a>*/}
              {/*                  </li>*/}
              {/*                </ul>*/}
              {/*              </div>*/}
              {/*            </div>*/}
              {/*          </div>*/}
              {/*          <p className="control-hint">Amount of XBT to buy.</p>*/}
              {/*        </div>*/}
              {/*      </div>*/}
              {/*      <div className="adv-ot-wrap">*/}
              {/*        <div className="control-group">*/}
              {/*          <label className="control-label">Order Type</label>*/}
              {/*          <div className="controls">*/}
              {/*            <select name="ordertype" className="input-large ordertype" autoComplete="off">*/}
              {/*              <option value="market">Market</option>*/}
              {/*              <option value="limit">Limit</option>*/}
              {/*              <option value="stop-loss">Stop Loss</option>*/}
              {/*              <option value="take-profit">Take Profit</option>*/}
              {/*              <option value="stop-loss-limit">Stop Loss Limit</option>*/}
              {/*              <option value="take-profit-limit">Take Profit Limit</option>*/}
              {/*              <option value="settle-position">Settle Position</option>*/}
              {/*            </select> <p className="control-hint ordertype-hint">Buy at a fixed price per XBT.</p>*/}
              {/*          </div>*/}
              {/*        </div>*/}
              {/*        <div className="control-group">*/}
              {/*          <label className="control-label pricelabel">Limit Price</label>*/}
              {/*          <div className="controls">*/}
              {/*            <div className="pricetype-wrap">*/}
              {/*              <div className="ib hmarg5right">*/}
              {/*                <div className="ib btn-group">*/}
              {/*                  <button type="button" className="btn btn-mini tt pricetype" value="plus" title=""*/}
              {/*                          autoComplete="off" data-original-title="Positive offset from market price">+*/}
              {/*                  </button>*/}
              {/*                  <button type="button" className="btn btn-mini tt pricetype active btn-info"*/}
              {/*                          value="fixed"*/}
              {/*                          title="" autoComplete="off"*/}
              {/*                          data-original-title="Static, non-relative price">=*/}
              {/*                  </button>*/}
              {/*                  <button type="button" className="btn btn-mini tt pricetype" value="minus" title=""*/}
              {/*                          autoComplete="off" data-original-title="Negative offset from market price">-*/}
              {/*                  </button>*/}
              {/*                </div>*/}
              {/*              </div>*/}
              {/*              <div className="ib hmarg5right">*/}
              {/*                <div className="input-append">*/}
              {/*                  <input type="text" className="span2 ralign hmarg0 price" name="price"*/}
              {/*                         autoComplete="off"/><span className="add-on">EUR</span>*/}
              {/*                </div>*/}
              {/*              </div>*/}
              {/*              <div className="ib">*/}
              {/*                <button type="button" className="btn tt skinny pricetype" value="percent" title=""*/}
              {/*                        autoComplete="off" data-original-title="Percentage of market price">%*/}
              {/*                </button>*/}
              {/*              </div>*/}
              {/*              <p className="control-hint pricehint">+/- relative to market price, = for fixed*/}
              {/*                price.</p>*/}
              {/*            </div>*/}
              {/*          </div>*/}
              {/*        </div>*/}
              {/*        <div className="control-group price2wrap hidden2">*/}
              {/*          <label className="control-label price2label">Secondary Price</label>*/}
              {/*          <div className="controls">*/}
              {/*            <div className="pricetype-wrap">*/}
              {/*              <div className="ib hmarg5right">*/}
              {/*                <div className="ib btn-group">*/}
              {/*                  <button type="button" className="btn btn-mini tt price2type" value="plus"*/}
              {/*                          disabled="disabled" title="" autoComplete="off"*/}
              {/*                          data-original-title="Positive offset from market price">+*/}
              {/*                  </button>*/}
              {/*                  <button type="button" className="btn btn-mini tt price2type" value="fixed"*/}
              {/*                          disabled="disabled" title="" autoComplete="off"*/}
              {/*                          data-original-title="Static, non-relative price">=*/}
              {/*                  </button>*/}
              {/*                  <button type="button" className="btn btn-mini tt price2type" value="minus"*/}
              {/*                          disabled="disabled" title="" autoComplete="off"*/}
              {/*                          data-original-title="Negative offset from market price">-*/}
              {/*                  </button>*/}
              {/*                </div>*/}
              {/*              </div>*/}
              {/*              <div className="ib hmarg5right">*/}
              {/*                <div className="input-append">*/}
              {/*                  <input type="text" disabled="disabled" className="span2 ralign hmarg0 price2"*/}
              {/*                         name="price2" autoComplete="off"/><span className="add-on">EUR</span>*/}
              {/*                </div>*/}
              {/*              </div>*/}
              {/*              <div className="ib">*/}
              {/*                <button type="button" className="btn tt skinny price2type" value="percent"*/}
              {/*                        disabled="disabled" title="" autoComplete="off"*/}
              {/*                        data-original-title="Percentage of market price">%*/}
              {/*                </button>*/}
              {/*              </div>*/}
              {/*              <p className="control-hint price2hint">&nbsp;</p>*/}
              {/*            </div>*/}
              {/*          </div>*/}
              {/*        </div>*/}
              {/*      </div>*/}
              {/*      <div className="control-group">*/}
              {/*        <label className="control-label">Total</label>*/}
              {/*        <div className="controls">*/}
              {/*          <div className="input-append">*/}
              {/*            <input type="text" tabIndex="3" autoComplete="off" className="span2 ralign hmarg0right"*/}
              {/*                   name="total"/><span className="add-on">EUR</span>*/}
              {/*          </div>*/}
              {/*          <p className="control-hint" name="total-hint">Estimated amount of EUR to spend.</p>*/}
              {/*        </div>*/}
              {/*      </div>*/}
              {/*    </div>*/}
              {/*    <div className="span6">*/}
              {/*      <div className="hmarg20left">*/}
              {/*        <div className="control-group">*/}
              {/*          <label className="control-label">Leverage</label>*/}
              {/*          <div className="controls">*/}
              {/*            <div className="btn-toolbar vmarg0" data-toggle="buttons-radio" name="leverage">*/}
              {/*              <div className="leverage-tt">*/}
              {/*                <div className="btn-group">*/}
              {/*                  <button type="button" className="btn trade-margin-selector active" value="none"*/}
              {/*                          autoComplete="off">*/}
              {/*                    None*/}
              {/*                  </button>*/}
              {/*                </div>*/}
              {/*                <div className="btn-group">*/}
              {/*                  <button type="button" className="btn trade-margin-selector" value="2:1"*/}
              {/*                          autoComplete="off">*/}
              {/*                    2*/}
              {/*                  </button>*/}
              {/*                  <button type="button" className="btn trade-margin-selector" value="3:1"*/}
              {/*                          autoComplete="off">*/}
              {/*                    3*/}
              {/*                  </button>*/}
              {/*                  <button type="button" className="btn trade-margin-selector" value="4:1"*/}
              {/*                          autoComplete="off">*/}
              {/*                    4*/}
              {/*                  </button>*/}
              {/*                  <button type="button" className="btn trade-margin-selector" value="5:1"*/}
              {/*                          autoComplete="off">*/}
              {/*                    5*/}
              {/*                  </button>*/}
              {/*                </div>*/}
              {/*              </div>*/}
              {/*            </div>*/}
              {/*            <p className="control-hint">&nbsp;</p>*/}
              {/*          </div>*/}
              {/*        </div>*/}
              {/*        <div className="control-group">*/}
              {/*          <label className="control-label">Start</label>*/}
              {/*          <div className="controls">*/}
              {/*            <select name="start" className="input-large" autoComplete="off">*/}
              {/*              <option>Now</option>*/}
              {/*              <option value="custom">Custom...</option>*/}
              {/*            </select>*/}
              {/*            <div className="custom-start-wrap hidden2 vmarg20top">*/}
              {/*              <div className="startdate-wrap ib input-append date hmarg5right"*/}
              {/*                   data-date-format="mm-dd-yy">*/}
              {/*                <input name="startdate" autoComplete="off" readOnly="readonly"*/}
              {/*                       className="input-smaller hmarg0right" type="text" default="09-08-20"*/}
              {/*                       value="09-08-20"/><span className="add-on"><i*/}
              {/*                className="icon-calendar"></i></span>*/}
              {/*              </div>*/}
              {/*              <div className="ib input-append bootstrap-timepicker-component">*/}
              {/*                <input name="starttime" autoComplete="off" readOnly="readonly"*/}
              {/*                       className="timepicker-default input-smaller hmarg0right" type="text"/><span*/}
              {/*                className="add-on"><i className="icon-time"></i> </span>*/}
              {/*              </div>*/}
              {/*              <a className="hpad10left smaller startreset" href="!#">Reset</a>*/}
              {/*            </div>*/}
              {/*            <p className="control-hint">When this order should be placed on the market.</p>*/}
              {/*          </div>*/}
              {/*        </div>*/}
              {/*        <div className="control-group">*/}
              {/*          <label className="control-label">Expires</label>*/}
              {/*          <div className="controls">*/}
              {/*            <select name="expire" className="input-large" autoComplete="off">*/}
              {/*              <option value="gtc">Good until cancelled</option>*/}
              {/*              <option value="gtd">Good this day</option>*/}
              {/*              <option value="gtw">Good this week</option>*/}
              {/*              <option value="gtm">Good this month</option>*/}
              {/*              <option value="custom">Custom...</option>*/}
              {/*            </select>*/}
              {/*            <div className="custom-expire-wrap hidden2 vmarg20top">*/}
              {/*              <div className="expiredate-wrap ib input-append date hmarg5right"*/}
              {/*                   data-date-format="mm-dd-yy">*/}
              {/*                <input name="expiredate" autoComplete="off" readOnly="readonly"*/}
              {/*                       className="input-smaller hmarg0right" type="text" default="09-08-20"*/}
              {/*                       value="09-08-20"/><span className="add-on"><i*/}
              {/*                className="icon-calendar"></i></span>*/}
              {/*              </div>*/}
              {/*              <div className="ib input-append bootstrap-timepicker-component">*/}
              {/*                <input name="expiretime" autoComplete="off" readOnly="readonly"*/}
              {/*                       className="timepicker-default input-smaller hmarg0right" type="text"*/}
              {/*                /><span*/}
              {/*                className="add-on"><i className="icon-time"></i> </span>*/}
              {/*              </div>*/}
              {/*              <a className="hpad10left smaller expirereset" href="!#">Reset</a>*/}
              {/*            </div>*/}
              {/*            <p className="control-hint">When this order should be canceled (if not filled).</p>*/}
              {/*          </div>*/}
              {/*        </div>*/}
              {/*        <div className="control-group" name="currencypriority">*/}
              {/*          <label className="control-label">Fee Currency</label>*/}
              {/*          <div className="controls">*/}
              {/*            <div className="btn-group" data-toggle="buttons-radio">*/}
              {/*              <button type="button" value="XXBT" className="btn base-currency" autoComplete="off">XBT*/}
              {/*              </button>*/}
              {/*              <button type="button" value="ZEUR" className="btn quote-currency active"*/}
              {/*                      autoComplete="off">EUR*/}
              {/*              </button>*/}
              {/*            </div>*/}
              {/*            <p className="control-hint">Preferred currency to apply fees to.*/}
              {/*            </p></div>*/}
              {/*        </div>*/}
              {/*        <div className="control-group">*/}
              {/*          <label className="control-label">Post limit order</label>*/}
              {/*          <div className="controls">*/}
              {/*            <div className="ib">*/}
              {/*              <div className="input-append hmarg10right">*/}
              {/*                <input type="checkbox" name="postonly"/>*/}
              {/*              </div>*/}
              {/*            </div>*/}
              {/*          </div>*/}
              {/*        </div>*/}
              {/*      </div>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*  <h4 className="line-title vmarg20top"><span className="title">Conditional Close</span></h4>*/}
              {/*  <div className="vpad10 alert alert-block alert-error error-grouped error-cond hidden2"></div>*/}
              {/*  <div className="row adv-ot-cond-wrap">*/}
              {/*    <div className="span6">*/}
              {/*      <div className="control-group">*/}
              {/*        <label className="control-label">Order Type</label>*/}
              {/*        <div className="controls">*/}
              {/*          <select name="cond-eordertype" className="input-large ordertype" autoComplete="off">*/}
              {/*            <option>None</option>*/}
              {/*            <option value="market">Market</option>*/}
              {/*            <option value="limit">Limit</option>*/}
              {/*            <option value="stop-loss">Stop Loss</option>*/}
              {/*            <option value="take-profit">Take Profit</option>*/}
              {/*            <option value="stop-loss-limit">Stop Loss Limit</option>*/}
              {/*            <option value="take-profit-limit">Take Profit Limit</option>*/}
              {/*            <option value="settle-position">Settle Position</option>*/}
              {/*          </select> <p className="control-hint ordertype-hint">Buy XBT at the best market price.</p>*/}
              {/*        </div>*/}
              {/*      </div>*/}
              {/*      <div className="control-group">*/}
              {/*        <label className="control-label pricelabel">Price</label>*/}
              {/*        <div className="controls">*/}
              {/*          <div className="pricetype-wrap">*/}
              {/*            <div className="ib hmarg5right">*/}
              {/*              <div className="ib btn-group">*/}
              {/*                <button type="button" className="btn btn-mini tt pricetype" value="plus"*/}
              {/*                        disabled="disabled"*/}
              {/*                        title="" autoComplete="off"*/}
              {/*                        data-original-title="Positive offset from market price">+*/}
              {/*                </button>*/}
              {/*                <button type="button" className="btn btn-mini active tt pricetype" value="fixed"*/}
              {/*                        disabled="disabled" title="" autoComplete="off"*/}
              {/*                        data-original-title="Static, non-relative price">=*/}
              {/*                </button>*/}
              {/*                <button type="button" className="btn btn-mini tt pricetype" value="minus"*/}
              {/*                        disabled="disabled" title="" autoComplete="off"*/}
              {/*                        data-original-title="Negative offset from market price">-*/}
              {/*                </button>*/}
              {/*              </div>*/}
              {/*            </div>*/}
              {/*            <div className="ib hmarg5right">*/}
              {/*              <div className="input-append">*/}
              {/*                <input type="text" disabled="disabled" className="span2 ralign hmarg0 price"*/}
              {/*                       name="cond-eprice" autoComplete="off"/><span className="add-on">EUR</span>*/}
              {/*              </div>*/}
              {/*            </div>*/}
              {/*            <div className="ib">*/}
              {/*              <button type="button" className="btn tt skinny pricetype" value="percent"*/}
              {/*                      disabled="disabled"*/}
              {/*                      title="" autoComplete="off" data-original-title="Percentage of market price">%*/}
              {/*              </button>*/}
              {/*            </div>*/}
              {/*            <p className="control-hint pricehint">&nbsp;</p>*/}
              {/*          </div>*/}
              {/*        </div>*/}
              {/*      </div>*/}
              {/*      <div className="control-group price2wrap hidden2">*/}
              {/*        <label className="control-label price2label">Secondary Price</label>*/}
              {/*        <div className="controls">*/}
              {/*          <div className="pricetype-wrap">*/}
              {/*            <div className="ib hmarg5right">*/}
              {/*              <div className="ib btn-group">*/}
              {/*                <button type="button" className="btn btn-mini tt price2type" value="plus"*/}
              {/*                        disabled="disabled" title="" autoComplete="off"*/}
              {/*                        data-original-title="Positive offset from market price">+*/}
              {/*                </button>*/}
              {/*                <button type="button" className="btn btn-mini active tt price2type" value="fixed"*/}
              {/*                        disabled="disabled" title="" autoComplete="off"*/}
              {/*                        data-original-title="Static, non-relative price">=*/}
              {/*                </button>*/}
              {/*                <button type="button" className="btn btn-mini tt price2type" value="minus"*/}
              {/*                        disabled="disabled" title="" autoComplete="off"*/}
              {/*                        data-original-title="Negative offset from market price">-*/}
              {/*                </button>*/}
              {/*              </div>*/}
              {/*            </div>*/}
              {/*            <div className="ib hmarg5right">*/}
              {/*              <div className="input-append">*/}
              {/*                <input type="text" disabled="disabled" className="span2 ralign hmarg0 price2"*/}
              {/*                       name="cond-eprice2" autoComplete="off"/><span className="add-on">EUR</span>*/}
              {/*              </div>*/}
              {/*            </div>*/}
              {/*            <div className="ib">*/}
              {/*              <button type="button" className="btn tt skinny price2type" value="percent"*/}
              {/*                      disabled="disabled"*/}
              {/*                      title="" autoComplete="off" data-original-title="Percentage of market price">%*/}
              {/*              </button>*/}
              {/*            </div>*/}
              {/*            <p className="control-hint price2hint">&nbsp;</p>*/}
              {/*          </div>*/}
              {/*        </div>*/}
              {/*      </div>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*  <div className="row vpad20 center posrel">*/}
              {/*    <span className="">*/}
              {/*    <button autoComplete="off" type="button"*/}
              {/*            className="btn-order-review btn submit btn-success btn-large">*/}
              {/*    <span>Buy XBT with EUR</span>*/}
              {/*    </button>*/}
              {/*    </span>*/}
              {/*    <span id="skip-confirmation-wrap" className="">*/}
              {/*        <input type="checkbox" name="skip-confirmation"/>*/}
              {/*        Skip order confirmations.*/}
              {/*  </span>*/}
              {/*  </div>*/}

              {/*</div>*/}
            </div>
          </fieldset>
        </form>
      </div>


    </div>

  );
}

export default AddOrder;
