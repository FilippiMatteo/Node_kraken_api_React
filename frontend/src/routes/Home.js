import React, {useEffect, useState} from 'react';
import '../App.css';

import {fetchDataFromApi} from "../utilities";
import Spinner from "../componets/Spinner";

function Home() {
  const [tempKeys,setTempKeys] = useState(["",""]);
  const [checkBox,setCheckBox] = useState(false);


  const [visibleSpinner, setVisibleSpinner] = useState([])
  const [spinnerWidth, setSpinnerWidth] = useState([])

  useEffect(() => {
    getSecretKeys();
  }, [])

  const getSecretKeys = async () =>{
    setVisibleSpinner("show");
    setSpinnerWidth("width-15");
    fetchDataFromApi("getSecretKey", {},"POST").then((ris) => {
      setSpinnerWidth("width-50");
      setTempKeys([ris.key,ris.secret] || ["",""]);
      setSpinnerWidth("width-100")

      setTimeout(() => {
        setVisibleSpinner("hide");
        setSpinnerWidth("width-15");
      }, 1000)
    }).catch((e) => {
      alert(e);
      setVisibleSpinner("hide");
      setSpinnerWidth("width-15");
    });
  }

  function _handle_api_key (e) {

    setTempKeys([e.target.value,tempKeys[1]]);
  }
  function _handle_api_private_key (e) {
    setTempKeys([tempKeys[0], e.target.value]);
  }
  function _handleCheckBox (e) {
    setCheckBox(e.target.checked);
  }



  function _SaveKeys() {
    if(checkBox){
      setVisibleSpinner("show");
      setSpinnerWidth("width-15");
      fetchDataFromApi("setSecretKey", {key: tempKeys[0] ,secret: tempKeys[1]},"POST").then((ris) => {
        setSpinnerWidth("width-50");
        setSpinnerWidth("width-100")

        setTimeout(() => {
          alert(ris);
          console.log(ris);
          setVisibleSpinner("hide");
          setSpinnerWidth("width-15");
        }, 500)
      })

    }else{
      alert("Check the box for submit the changes!");
    }
  }

  return (
    <div className="App">
      <h1>Home</h1>

      <div className="padding-20">
        <div className="margin-top-10 padding-20">
          <p>Before start to use this project you need to start the backend  with nodejs  </p>
          <p>After this you need to set api secret (only for trades, withdraw and deposit is not implented yet) on <a href="https://www.kraken.com" target="_blank" rel="noopener noreferrer"> Kraken official site </a></p>
          <p>When you obtains your secret code, open "Kraken_Keys.js" and change "key" and "secret" constant with your codes</p>
        </div>


        <Spinner visibleSpinner={visibleSpinner} spinnerWidth={spinnerWidth}></Spinner>

        <div className="margin-top-10 padding-20">
          <div  >
            <p>You can change the codes from here, Don't worry, will be only save on local configuration file "Kraken_Keys.js"</p>
            <form>
              <div className="form-group">
                <label htmlFor="api_key">API Key</label>
                <input type="text" className="form-control" id="api_key"  placeholder="Paste Enter key" value={tempKeys[0]} onChange={_handle_api_key } />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">API Private Key</label>
                <input type="text" className="form-control" id="api_private_key" placeholder="Paste secret here" value={tempKeys[1]} onChange={_handle_api_private_key} />
              </div>
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" value={checkBox} onChange={_handleCheckBox} />
                <label className="form-check-label" htmlFor="exampleCheck1">Are you sure to change Kraken_Keys.js file?</label>
              </div>
              <button type="button" className="btn btn-primary margin-top-10" onClick={()=>{_SaveKeys()}} >Save</button>
            </form>

          </div>


        </div>
      </div>

    </div>

  );
}

export default Home;