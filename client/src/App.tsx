import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import ChatApp from './components/ChatApp';
import OnlineUsers from './components/OnlineUsers';
import SimpleCard from './pages/SignUp';
import SignUp from './pages/SignUp';

function App() {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route exact path='/' component={SignUp} />
          <Route path='/chat'>
            <ChatApp></ChatApp>
            <OnlineUsers></OnlineUsers>
          </Route>
          <Route exact path='/test' component={SimpleCard} />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
