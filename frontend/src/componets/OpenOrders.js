import React, {useState, useEffect} from 'react';
import '../App.css';
import Spinner from "../componets/Spinner";
import {isFiat, getFiatChar, fetchDataFromApi} from "../utilities";


function OpenOrders() {
  useEffect(() => {
    getOpenOrder();
  }, [])

  const [orders, setOrders] = useState({})
  const [visibleSpinner, setVisibleSpinner] = useState([])
  const [spinnerWidth, setSpinnerWidth] = useState([])
  const [visibleTable, seVisibleTable] = useState(["hide"])
  const tableHeader = [{tablename: "Pairs", value: "pair",}, {
    tablename: "Opened",
    value: "time",
    isSortable: true
  }, {tablename: "Type", value: "type"}, {
    tablename: "Order",
    value: "ordertype",
    isSortable: true
  }, {tablename: "Price", value: "price", isSortable: true}, {
    tablename: "Volume",
    value: "vol",
    isSortable: true
  }, {tablename: "Cost", value: "cost", isSortable: true}, {tablename: "", value: "X"}]



  const getOpenOrder = async () =>{
    setVisibleSpinner("show");
    setSpinnerWidth("width-15");
    fetchDataFromApi("openOrders").then((ris) => {
      setSpinnerWidth("width-50");
      setOrders(ris.result.open || [])
      setSpinnerWidth("width-100")
      seVisibleTable("show");

      setTimeout(() => {
        setVisibleSpinner("hide");
        setSpinnerWidth("width-15");
      }, 1000)
    }).catch((e) => {
      alert(e)
    });
  }

  const canceldOrder = async (key) => {

    fetchDataFromApi("cancelOrder",{'txid': key},"POST").then((ris) => {
        alert("Deleted");
        console.log(ris);
        getOpenOrder();
    }).catch((e) => {
      alert(e)
    });


  }


  function _sortTrades(param, desc) {

    let sortedTrades = Object.keys(orders).sort(function (a, b) {
      return orders[a][param] - orders[b][param];
    });
    let sorted = sortedTrades.map((key) => {
      return orders[key];
    })
    if (desc) {
      sorted.reverse();
    }
    setOrders(sorted);
    debugger
  }

  function _renderTableHeader(arr) {
    return arr.map((item) => {
        if (item.isSortable) {
          return (
            <th className="sorting_th" id={item.tablename} key={item.tablename}>
              <div className="sorting-icon asc" onClick={() => _sortTrades(item.value, false)}></div>
              <span>{item.tablename}</span>
              <div className="sorting-icon desc" onClick={() => _sortTrades(item.value, true)}></div>
            </th>
          );
        } else {
          return (
            <th className="sorting_th" id={item.tablename} key={item.tablename}>
              <span>{item.tablename}</span>
            </th>
          );
        }

      }
    )
  }


  function _renderlistOrder(objects) {

    if (Object.getOwnPropertyNames(objects).length > 0) {
      return Object.entries(objects).map(([key, value], i) => {
        let pair1 = value.descr.pair.substring(0, 3);
        let pair2 = value.descr.pair.substring(3, 6);
        let date = new Date(value.opentm * 1000);
        let dateString = date.toLocaleDateString("it-It");
        //  console.log(key) // log OCI2HW-BVUJ3-GVMUWU per esempio
        return (

          <tr key={key}>

            <td>{pair1}/{pair2}</td>
            <td> {dateString} {date.getHours()}:{date.getMinutes()}:{date.getSeconds()} </td>
            <td>{value.descr.type}</td>
            <td>{value.descr.ordertype}</td>
            <td>{pair2} {isFiat(pair2) ? getFiatChar(pair2) + parseFloat(value.descr.price).toFixed(2) : value.descr.price} </td>
            <td>{pair1} {isFiat(pair1) ? getFiatChar(pair1) + parseFloat(value.vol).toFixed(2) : value.vol}</td>
            <td>{pair2} {isFiat(pair2) ? getFiatChar(pair2) + parseFloat(value.cost).toFixed(2) : value.cost}</td>
            <td>
              <button className="btn btn-danger thin tt btn-cancel" onClick={() => {
                canceldOrder(key)
              }}>X
              </button>
            </td>

            {/*<td > <span className={ value.posstatus=="closed" ? "label label-success": "label label-important" }>{value.posstatus} </span></td>*/}
          </tr>


        )
      });
    } else {
      return (
        <tr>
          No results
        </tr>
      );
    }


  }

  return (
    <div className="App">
      <h1>Open Order</h1>
      <Spinner visibleSpinner={visibleSpinner} spinnerWidth={spinnerWidth}></Spinner>


      <div className="trades">
        <table className={visibleTable}>
          <thead>
          <tr>
            {_renderTableHeader(tableHeader)}

          </tr>

          </thead>
          <tbody>
          {_renderlistOrder(orders)}
          </tbody>
        </table>
      </div>
    </div>

  );
}

export default OpenOrders;
