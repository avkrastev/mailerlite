import React, { Component } from 'react';
import axios from '../../../axios';
import { Redirect } from 'react-router-dom';

import './NewSubscriber.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { subscriberStates } from '../../../components/options';

class NewSubscriber extends Component {
    state = {
        formData : {
            email: {
                value: '',
                valid: false,
                touched: false,
                errorText: 'Please provide a valid e-mail address!'
            },
            name: {
                value: '',
                valid: false,
                touched: false,
                errorText: 'The name is required!'
            },
            state: {
                value: '0',
                valid: true,
                touched: false
            },
        },
        loading: false,
        submitted: false,
        formValid: false,
        errorResponse: ''
    }

    subscriberDataHandler = () => {
        this.setState({loading: true});

        const data = {
            email: this.state.formData.email.value,
            name: this.state.formData.name.value,
            state: this.state.formData.state.value
        };

        axios.post( '/subscribers', data )
            .then( response => {
                this.setState({
                    loading: false,
                    submitted: true
                });
                this.props.history.replace('/subscribers');
            })
            .catch( error => {
                let errorResponse = '';
                if (error.response) {
                    errorResponse = error.response.data.error
                }
                this.setState( { loading: false, errorResponse } );
            });
    }

    inputChangedHandler = (event, formElement) => {
        const updatedForm = {
            ...this.state.formData
        };

        updatedForm[formElement].value = event.target.value;
        updatedForm[formElement].valid = this.checkValidity(formElement, updatedForm[formElement].value);
        updatedForm[formElement].touched = true;
        
        let formIsValid = true;
        for (let inputIdentifier in updatedForm) {
            formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
        }

        this.setState({formData: updatedForm, formValid: formIsValid, errorResponse: ''});
    }

    checkValidity(element, value) {
        let isValid = true;

        switch(element) {
            case 'email':
                const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
                isValid = pattern.test(value) && isValid
                break;
            case 'name':
                isValid = value.trim() !== '' && isValid;
                break;
            default:
                isValid = true;
        }

        return isValid;
    }

    render () {
        let redirect = null;
        if (this.state.submitted) {
            redirect = <Redirect to="/subscribers" />;
        }

        const stateOptions = subscriberStates.map( (stateName, key) => {
            return <option key={key} value={key}>{stateName}</option>
        });

        let form = (
            <form >
                {redirect}
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input 
                        type="email"    
                        className={this.state.formData.email.valid || !this.state.formData.email.touched ? "form-control" : "form-control is-invalid" }
                        id="email" 
                        placeholder="name@example.com"
                        value={this.state.formData.email.value} 
                        onChange={( event ) => this.inputChangedHandler(event, 'email')}/>
                    <div className="invalid-feedback">
                        {this.state.formData.email.errorText} 
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input 
                        type="text"    
                        className={this.state.formData.name.valid || !this.state.formData.name.touched ? "form-control" : "form-control is-invalid" }
                        id="name" 
                        value={this.state.formData.name.value} 
                        onChange={( event ) => this.inputChangedHandler(event, 'name')}/>
                    <div className="invalid-feedback">
                        {this.state.formData.name.errorText} 
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleFormControlSelect1">State</label>
                    <select 
                        className="form-control" 
                        id="exampleFormControlSelect1"
                        value={this.state.formData.state.value} 
                        onChange={( event ) => this.inputChangedHandler(event, 'state')}>
                        {stateOptions}
                    </select>
                </div>
                <div className="text-center">
                    <button type="button" onClick={this.subscriberDataHandler} disabled={!this.state.formValid} className="btn btn-success">Add Subscriber</button>
                </div>
            </form>
        );

        if (this.state.loading) {
            form = <Spinner />;
        }

        let alert = null;
        if (this.state.errorResponse !== '') {
            alert = <div className="alert alert-danger" role="alert">{this.state.errorResponse}</div>
        }
        return (
            <div className="NewSubscriber">
                {alert}
                {form}
            </div>
        ); 
    }
}

export default NewSubscriber;