import React from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

import './App.css';

import Home from './routes/Home';
import About from './routes/About';
import Header from "./routes/Header";
import Balance from "./routes/Balance";
import Signup from "./routes/Signup";
import Login from "./routes/Login";
import AddOrder from "./routes/AddOrder";
import TradesHistory from "./routes/TradesHistory";
import OpenPositions from "./componets/OpenPositions";
import OpenOrders from "./componets/OpenOrders";




function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route exact path="/balance" component={Balance}></Route>
          <Route exact path="/about" component={About}></Route>
          <Route exact path="/addorder" component={AddOrder}></Route>
          <Route exact path="/tradesHistory" component={TradesHistory}></Route>
          <Route exact path="/openPositions" component={OpenPositions}></Route>
          <Route exact path="/openOrders" component={OpenOrders}></Route>
          <Route exact path="/loging" component={Login}></Route>
          <Route exact path="/signup" component={Signup}></Route>
        </Switch>
      </div>

    </Router>

  );
}

export default App;
