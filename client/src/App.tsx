import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage';
import SignUp from './pages/SignUp';

function App() {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route path='/chat'>
            <MainPage />{' '}
          </Route>
          <Route exact path='/' component={SignUp} />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
