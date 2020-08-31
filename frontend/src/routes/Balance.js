import React, {useState, useEffect} from 'react';
import '../App.css';


function Balance() {
  useEffect(()=>{
    fetchData();
  },[])

const [pairs, setPairs] = useState([])

  const fetchData = async () => {
    const rawData = await fetch('http://127.0.0.1:5555/kraken/balance');
    const data = await rawData.json();
    console.log(data);
    setPairs(data)
  }


  function _renderObject(objects){
    return Object.entries(objects).map(([key, value], i) => {
      return (

        <div className="pairs" key={key}>
          {key} : {value}
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


      <div className="results">
        {_renderObject(objects)}
      </div>

    </div>

  );
}

export default Balance;
