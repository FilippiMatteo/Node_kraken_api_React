import React, {useState, useEffect} from 'react';
import '../App.css';
import Spinner from "../componets/Spinner";
import {isFiat} from "../utilities";

function TradesHistory() {
  useEffect(() => {
    _fetchTrades();
  }, [])

  const [trades, setTrades] = useState([])
  const [visibleSpinner, setVisibleSpinner] = useState([])
  const [spinnerWidth, setSpinnerWidth] = useState([])
  const [visibleTable, seVisibleTable] = useState(["hide"])
  const tableHeader = ["Pairs", "Date","Type", "Order", "Price", "Volume","Cost"]

  const _fetchTrades = async () => {
    setVisibleSpinner("show");
    setSpinnerWidth("width-15");

    const rawData = await fetch('http://127.0.0.1:5555/kraken/tradesHistory');

    setSpinnerWidth("width-50")

    const data = await rawData.json();


    setTrades(data.result.trades)
    setSpinnerWidth("width-100")
    seVisibleTable("show");

    setTimeout(() => {
      setVisibleSpinner("hide");
    }, 1000)
  }


  function _sortTrades(param){
    debugger
    console.log(param)
  }

  function _renderTableHeader (arr){
    return arr.map( (item) =>{
      return (
        <th className="sorting_desc" id={item} key={item}>{item} <div className="sorting_desc_icon" onClick={()=>_sortTrades(item,0)}></div></th>
      );
    })
  }


  function _renderlistTrades(objects) {
    return Object.entries(objects).map(([key, value], i) => {
      let pair1 = value.pair.substring(1, 4)
      let pair2 = value.pair.substring(5, 9)
      let date = new Date(value.time * 1000)
      let dateString = date.toLocaleDateString("it-It");
       console.log(value)
      return (

        <tr key={key}>
          <td>{pair1}/{pair2}</td>
          <td> {dateString} {date.getHours()}:{date.getMinutes()}:{date.getSeconds()} </td>
          <td>{value.type}</td>
          <td>{value.ordertype}</td>
          <td>{pair2} {isFiat(pair2)? parseFloat(value.price).toFixed(2) : value.price } </td>
          <td>{pair1} {isFiat(pair1)? parseFloat(value.vol).toFixed(2) : value.vol }</td>
          <td>{pair2} {isFiat(pair2)? parseFloat(value.cost).toFixed(2) : value.cost  }</td>
          {/*<td > <span className={ value.posstatus=="closed" ? "label label-success": "label label-important" }>{value.posstatus} </span></td>*/}
        </tr>


      )
    });
  }

  var objects = trades || [];
  return (
    <div className="App">
      <h1>Trade History</h1>
      <Spinner visibleSpinner={visibleSpinner} spinnerWidth={spinnerWidth}></Spinner>



      <div className="trades" >
        <table className={visibleTable}>
          <thead>
          <tr>
            {_renderTableHeader(tableHeader)}

          </tr>

          </thead>
          <tbody>
            {_renderlistTrades(objects)}
          </tbody>
        </table>
      </div>
    </div>

  );
}

export default TradesHistory;
