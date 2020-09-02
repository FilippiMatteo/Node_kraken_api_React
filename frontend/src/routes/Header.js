import React from 'react';
import '../App.css';
import '../css/header.css';

import Navbar from "./Navbar";


function Header() {
  return (
    <header className="kraken-header">
      <a  className="header-logo">Kraken</a>
          <Navbar/>
    </header>

  );
}

export default Header;