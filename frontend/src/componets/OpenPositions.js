import React, {useState, useEffect} from 'react';
import '../App.css';
import Spinner from "../componets/Spinner";
import {isFiat} from "../utilities";

function OpenPositions() {
  useEffect(() => {
    _fetchOpenPositions();
  }, [])

   const [positions, setPositions] = useState([])
  const [visibleSpinner, setVisibleSpinner] = useState([])
  const [spinnerWidth, setSpinnerWidth] = useState([])
   const [visibleTable, seVisibleTable] = useState(["hide"])
   const tableHeader = [{tablename:"Pairs", value: "pair" },{tablename: "Date", value : "time", isSortable: true},{tablename:"Type",value :"type", isSortable: true }, {tablename:"Order", value :"ordertype", isSortable: true},{ tablename :"Price", value: "price"}, { tablename :"Volume", value: "vol"},{tablename: "Vol Closed", value: "vol_closed"},{tablename: "Cost", value: "cost" } ,{tablename: "Fee", value: "fee"},{tablename: "Terms",value: "terms"},{tablename: "Status",value: "posstatus"}, {tablename: "", value: "X"}]

  const _fetchOpenPositions = async () => {
    setVisibleSpinner("show");
    setSpinnerWidth("width-15");

    const rawData = await fetch('http://127.0.0.1:5555/kraken/openPositions');

    setSpinnerWidth("width-50")

    const data = await rawData.json();

    setPositions(data.result || [])
    setSpinnerWidth("width-100")
    seVisibleTable("show");

    setTimeout(() => {
      setVisibleSpinner("hide");
    }, 1000)
  }

  const canceldOrder = async (key) => {
    try {
      setVisibleSpinner("show");
      setSpinnerWidth("width-15");

      const rawData = await fetch('http://127.0.0.1:5555/kraken/cancelOrder',{ method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'txid': key})
      }).catch( (e) => {
        console.error(e)
      });

      setSpinnerWidth("width-50")

      const data = await rawData.json();

      setPositions(data.result || [])
      setSpinnerWidth("width-100")
      seVisibleTable("show");

      setTimeout(() => {
        setVisibleSpinner("hide");
      }, 1000)
    }catch (e) {
      console.error("errore chiamata",e);
      setSpinnerWidth("width-100")
      setVisibleSpinner("hide");

    }

  }


  function _sortTrades(param,desc){

    let sortedTrades= Object.keys(positions).sort(function(a,b){
      return positions[a][param] - positions[b][param];
    });
    let sorted=  sortedTrades.map( ( key)=>{
      return positions[key];
    })
    if (desc) {
      sorted.reverse();
    }
    setPositions (sorted);
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



  function _renderlistTrades(objects) {
    return Object.entries(objects).map(([key, value], i) => {
      let pair1 = value.pair.substring(1, 4)
      let pair2 = value.pair.substring(5, 9)
      let date = new Date(value.time * 1000)
      let dateString = date.toLocaleDateString("it-It");
      // console.log(key)
      return (

        <tr key={key}>
          <td>{pair1}/{pair2}</td>
          <td> {dateString} {date.getHours()}:{date.getMinutes()}:{date.getSeconds()} </td>
          <td>{value.type}</td>
          <td>{value.ordertype}</td>
          <td>{value.margin} </td>
          <td>{pair1} {isFiat(pair1)? parseFloat(value.vol).toFixed(2) : value.vol }</td>
          <td>{value.vol_closed }</td>
          <td>{pair2} {isFiat(pair2)? parseFloat(value.cost).toFixed(2) : value.cost  }</td>
          <td>{value.fee}</td>
          <td>{value.terms}</td>
          <td>{value.posstatus}</td>
          <td ><button className="btn btn-danger thin tt btn-cancel" onClick={()=>{canceldOrder(key)}}>X</button></td>


          {/*<td > <span className={ value.posstatus=="closed" ? "label label-success": "label label-important" }>{value.posstatus} </span></td>*/}
        </tr>


      )
    });
  }

  var objects = positions || [];
  return (
    <div className="App">
      <h1>Open Positions</h1>
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

export default OpenPositions;
