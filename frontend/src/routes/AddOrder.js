import React, {useState, useEffect} from 'react';
import '../App.css';
import '../css/orders.css';


function AddOrder() {
  useEffect(()=>{
    fetchPairs();
  },[])

   const [selectedPair, setSelectedPair] = useState([])

  const fetchPairs = async () => {
    const rawData = await fetch('http://127.0.0.1:5555/kraken/allPairs');
    const data = await rawData.json();
    console.log(data);
    setSelectedPair(data)
  }




  // var objects = pairs.result || [];

  // const keys = Object.keys(objects);
  // const value = Object.values(objects);

function _renderlistPairs (objects) {
  return Object.entries(objects).map(([key, value], i) => {
    return (
      <div>

      </div>

    )
  });
}


  return (
    <div className="App">
      <h1>Add Order</h1>


        {_renderlistPairs }



      {/*<div className="results b">*/}
      {/*  {_renderObject(objects)}*/}
      {/*</div>*/}

    </div>

  );
}

export default AddOrder;
