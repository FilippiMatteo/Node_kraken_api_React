import React, {useState, useEffect} from 'react';
import '../App.css';


function AddOrder() {
  // useEffect(()=>{
  //   fetchData();
  // },[])

  // const [pairs, setPairs] = useState([])

  // const fetchData = async () => {
  //   const rawData = await fetch('http://127.0.0.1:5555/kraken/balance');
  //   const data = await rawData.json();
  //   console.log(data);
  //   setPairs(data)
  // }


  // function _renderObject(objects){
  //   return Object.entries(objects).map(([key, value], i) => {
  //     // let img = "/public/cryptocurrency/" + key.toLowerCase() + '.png';
  //     return (
  //
  //       <div className="pairs bc" key={key}>
  //         <img className="crypto-png" src={`${process.env.PUBLIC_URL}/cryptocurrency/${key.toLowerCase()}.png`} /> <span>{key} : {value}</span>
  //       </div>
  //     )
  //   })
  // }


  // var objects = pairs.result || [];

  // const keys = Object.keys(objects);
  // const value = Object.values(objects);




  return (
    <div className="App">
      <h1>Add Order</h1>


      {/*<div className="results b">*/}
      {/*  {_renderObject(objects)}*/}
      {/*</div>*/}

    </div>

  );
}

export default AddOrder;
