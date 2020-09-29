import React, { Component } from 'react';
import axios from '../../../axios';
import { Redirect } from 'react-router-dom';

import './NewField.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { fieldTypes } from '../../../components/options';

class NewField extends Component {
    state = {
        formData : {
            title: {
                value: '',
                valid: false,
                touched: false,
                errorText: 'The title is required field!'
            },
            description: {
                value: '',
                valid: true,
                touched: false
            },
            type: {
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

    fieldDataHandler = () => {
        this.setState({loading: true});

        const data = {
            title: this.state.formData.title.value,
            description: this.state.formData.description.value,
            type: this.state.formData.type.value
        };

        axios.post( '/field', data )
            .then( response => {
                this.setState({
                    loading: false,
                    submitted: true
                });
                this.props.history.replace('/fields');
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
            case 'title':
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
            redirect = <Redirect to="/fields" />;
        }

        const fieldTypeOptions = fieldTypes.map( (fieldName, key) => {
            return <option key={key} value={key}>{fieldName}</option>
        });

        let form = (
            <form >
                {redirect}
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input 
                        type="text"    
                        className={this.state.formData.title.valid || !this.state.formData.title.touched ? "form-control" : "form-control is-invalid" }
                        id="title" 
                        value={this.state.formData.title.value} 
                        onChange={( event ) => this.inputChangedHandler(event, 'title')}/>
                    <div className="invalid-feedback">
                        {this.state.formData.title.errorText} 
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="fieldType">Type</label>
                    <select 
                        className="form-control" 
                        id="fieldType"
                        value={this.state.formData.type.value} 
                        onChange={( event ) => this.inputChangedHandler(event, 'type')}>
                        {fieldTypeOptions}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea 
                        className="form-control" 
                        id="description" 
                        rows="3" 
                        value={this.state.formData.description.value} 
                        onChange={( event ) => this.inputChangedHandler(event, 'description')}>
                    </textarea>
                </div>
                <div className="text-center">
                    <button type="button" onClick={this.fieldDataHandler} disabled={!this.state.formValid} className="btn btn-success">Add Field</button>
                </div>
            </form>
        );

        if ( this.state.loading ) {
            form = <Spinner />;
        }

        let alert = null;
        if (this.state.errorResponse !== '') {
            alert = <div className="alert alert-danger" role="alert">{this.state.errorResponse}</div>
        }
        return (
            <div className="NewField">
                {alert}
                {form}
            </div>
        ); 
    }
}

export default NewField;