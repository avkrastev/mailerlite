import React, { Component } from 'react';
// import axios from 'axios';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';

import './MailerLite.css';
import Fields from './Fields/Fields';
import Subscribers from './Subscribers/Subscribers';
import asyncComponent from '../../hoc/asyncComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faUsers } from '@fortawesome/free-solid-svg-icons';

const AsyncNewSubscriber = asyncComponent(() => {
    return import('./NewSubscriber/NewSubscriber');
});

const AsyncNewField = asyncComponent(() => {
    return import('./NewField/NewField');
});

class MailerLite extends Component {
    render () {
        return (
            <div className="MailerLite">
                <header>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <NavLink className="navbar-brand" to="/" exact>
                            MailerLite
                        </NavLink>
                        <button 
                            className="navbar-toggler" 
                            type="button" 
                            data-toggle="collapse" 
                            data-target="#navbarNavAltMarkup" 
                            aria-controls="navbarNavAltMarkup"  
                            aria-expanded="false" 
                            aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div className="navbar-nav">
                            <NavLink className="nav-item nav-link" to="/subscribers">
                                <FontAwesomeIcon icon={faUsers} /> Subscribers <span className="sr-only">(current)</span>
                            </NavLink>
                            <NavLink className="nav-item nav-link" to="/fields">
                                <FontAwesomeIcon icon={faArchive} /> Fields
                            </NavLink>
                            </div>
                        </div>
                    </nav>
                </header>
                <Switch>
                    <Route path="/subscribers" component={Subscribers} />
                    <Route path="/subscribers/?" component={Subscribers} />
                    <Route path="/new-subscriber" component={AsyncNewSubscriber} />
                    <Route path="/fields" component={Fields} />
                    <Route path="/new-field" component={AsyncNewField} />
                    <Redirect from="/" to="/subscribers" exact />
                    <Route render={() => <h1 className="text-center">Not found</h1>}/>
                </Switch>
            </div>
        );
    }
}

export default MailerLite;