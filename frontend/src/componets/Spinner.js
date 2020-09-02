import React from 'react';
import '../App.css';


function Spinner(props) {
  let bar= "bar ";
  bar+=props.spinnerWidth || "";
  return (
    <div id="spinner">
      <div className={props.visibleSpinner}>
        <div id="ticker-chart-pulldown">
          <div className="loading">
            <div className="progress progress-info progress-striped active ">
              <div className={bar}></div>
            </div>
            <p className="mono">Loading...</p>
          </div>
        </div>

      </div>

    </div>


  );
}

export default Spinner;