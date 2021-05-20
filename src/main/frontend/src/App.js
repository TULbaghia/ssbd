import React, {Component, useState} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import './App.css';
import NavigationBar from "./components/Navbar";
import {library} from "@fortawesome/fontawesome-svg-core";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {faSignInAlt, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import Home from "./components/Home";
import BlogScreen from "./components/Blog";
import PingPong from "./components/PingPong";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Footer from "./components/Footer";
import ConfirmedAccount from "./components/ConfirmedAccount";
import PasswordReset from "./components/PasswordReset";

library.add(fab, faSignInAlt, faUserPlus);

class App extends Component {
    render() {
        return (
            <div className="App">
                <Router basename={process.env.REACT_APP_ROUTER_BASE || ''}>
                    <div>
                        <NavigationBar />
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <Route path="/blog" component={BlogScreen}/>
                            <Route exact path="/login" component={Login}/>
                            <Route path="/signUp" component={SignUp}/>
                            <Route path="/pong" component={PingPong}/>
                            <Route path="/login/password-reset" component={PasswordReset}/>
                            <Route path="/confirmedAccount" component={ConfirmedAccount} />
                        </Switch>
                        <Footer />
                    </div>
                </Router>
            </div>
        );
    }
}


export default App;
