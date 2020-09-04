import React from 'react';
import '../App.css';
import {Link} from "react-router-dom";


function Navbar() {
  return (
    <nav className="top-nav">
      <ul className="primary">

        <li>
          <Link to="/">Home </Link>
          {/*<ul className="hidden-submenu">*/}
          {/*  <li>*/}
          {/*    <div>*/}
          {/*      <ul>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/security">Sicurezza</a></li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/fee-schedule">Prospetto delle*/}
          {/*          commissioni</a></li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/funding-options">Opzioni di*/}
          {/*          Deposito</a></li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/staking-coins">Staking</a></li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/24-7-support">Supporto 24/7</a>*/}
          {/*        </li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/liquidity">Liquidità</a></li>*/}
          {/*      </ul>*/}
          {/*    </div>*/}
          {/*    <div>*/}
          {/*      <ul>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/margin-trading">Trading con*/}
          {/*          Margine</a></li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/indices">Indici</a></li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/futures">Futures</a></li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/otc-exchange">OTC</a></li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/account-management">Account*/}
          {/*          Management</a></li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/cryptowatch">Cryptowatch</a></li>*/}
          {/*      </ul>*/}
          {/*    </div>*/}
          {/*  </li>*/}
          {/*</ul>*/}
        </li>


        <li><Link to="/balance">Balance</Link>
          {/*<ul className="hidden-submenu">*/}
          {/*  <li>*/}
          {/*    <div>*/}
          {/*      <ul>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/security">Sicurezza</a></li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/fee-schedule">Prospetto delle*/}
          {/*          commissioni</a></li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/funding-options">Opzioni di*/}
          {/*          Deposito</a></li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/staking-coins">Staking</a></li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/24-7-support">Supporto 24/7</a>*/}
          {/*        </li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/liquidity">Liquidità</a></li>*/}
          {/*      </ul>*/}
          {/*    </div>*/}
          {/*    <div>*/}
          {/*      <ul>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/margin-trading">Trading con*/}
          {/*          Margine</a></li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/indices">Indici</a></li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/futures">Futures</a></li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/otc-exchange">OTC</a></li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/features/account-management">Account*/}
          {/*          Management</a></li>*/}
          {/*        <li><a data-testid="site-link" href="/it-it/cryptowatch">Cryptowatch</a></li>*/}
          {/*      </ul>*/}
          {/*    </div>*/}
          {/*  </li>*/}
          {/*</ul>*/}
        </li>
        <li><Link to="/addorder">Add Order</Link></li>
        <li><Link to="/tradesHistory">Trades History</Link></li>
        <li><Link to="/openPositions">Open Positions</Link></li>
        <li><Link to="/openOrders">Open Orders</Link></li>

      </ul>
      <ul className="secondary">
        <li>
          <Link to="/login" className="kraken-cta inverted">Accedi</Link>
        </li>
        <li>
          <Link to="/signup" className="kraken-cta">Crea un Account</Link>
        </li>

      </ul>
    </nav>
  );
}

export default Navbar;