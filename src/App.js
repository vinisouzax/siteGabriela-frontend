import React, { useState } from 'react';

import Routes from './routes'
import Sidebar from './pages/Sidebar'
import Mainmenu from './pages/Mainmenu'

function App(){
  const [ isSBToogled, setIsSBToogled ] = useState(true);

    return (
      <div className={isSBToogled ? "d-flex" : "d-flex toggled"} id="wrapper">
        <div className="bg-light border-right" id="sidebar-wrapper">
          <div className="sidebar-heading" align="center">
            <img src={require('./assets/logo.png')} 
            className="logo"
            alt="logo"/>
          </div>
          <div className="list-group list-group-flush">
            <div id="loader_middle" none></div>
            <Sidebar />
          </div>
        </div>
  
        <div id="page-content-wrapper">
  
          <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <button onClick={
              () => setIsSBToogled(!isSBToogled)} 
              className="btn btn-primary" id="menu-toggle">Conteúdos</button>
  
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <Mainmenu />
          </nav>
  
          <div className="container-fluid">
            <div id="loader" none></div>
            <Routes />
          </div>

        </div>
  
      </div>
  
    );
  
}

export default App;
