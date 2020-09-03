import React, {useState, useEffect} from 'react';
import '../App.css';
import Spinner from "../componets/Spinner";
import {Link} from "react-router-dom";


function Balance() {
  useEffect(()=>{
    fetchData();
  },[])

const [pairs, setPairs] = useState([])
const [visibleSpinner, setVisibleSpinner] = useState([])
const [spinnerWidth, setSpinnerWidth] = useState([])

  const fetchData = async () => {
    setVisibleSpinner("show");
    setSpinnerWidth("width-15");

    const rawData = await fetch('http://127.0.0.1:5555/kraken/balance');

    setSpinnerWidth("width-50")

    const data = await rawData.json();
    setPairs(data)

    setSpinnerWidth("width-100")
    setTimeout(()=>{
      setVisibleSpinner("hide");
    },1000)
  }


  function _renderObject(objects){
    return Object.entries(objects).map(([key, value], i) => {
      return (

        <div className="pairs bc" key={key}>
          <img className="crypto-png" src={`${process.env.PUBLIC_URL}/cryptocurrency/${key.toLowerCase()}.png`} /> <span>{key} : {value}</span> <button className="trade"> <Link to="/addorder"> Trade </Link> </button>
        </div>
      )
    })
  }


    var objects = pairs.result || [];

    // const keys = Object.keys(objects);
    // const value = Object.values(objects);




  return (
    <div className="App">
      <h1>Balance</h1>

      <Spinner visibleSpinner={visibleSpinner} spinnerWidth={spinnerWidth}></Spinner>

      <div className="results b">
        {_renderObject(objects)}
      </div>

    </div>

  );
}

export default Balance;
