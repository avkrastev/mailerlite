import React, { Component } from 'react';
import axios from '../../../../axios';
import { subscriberStates } from '../../../options';
import * as functions from '../../../functions';
import Spinner from '../../../../components/UI/Spinner/Spinner';

class SubscriberEdit extends Component {

    state = {
        formData : {
            email: {
                value: this.props.email,
                valid: true,
                touched: false,
                errorText: 'Please provide a valid e-mail address!'
            },
            name: {
                value: this.props.name,
                valid: true,
                touched: false,
                errorText: 'The name is required!'
            },
            state: {
                value: subscriberStates.indexOf(this.props.state),
                valid: true,
                touched: false
            },
        },
        subscriber: this.props.subscriber,
        formValid: true,
        errorResponse: this.props.errorResponse,
        showFields: false,
        selectedFields: [],
        subscriberFields: this.props.subscriberFields
    }

    addNewField = (id) => {
        axios.get('/subscriber/'+id+'/availableFields')
        .then( response => {
            this.setState({
                showFields: true,
                availableFields: response.data
            })
        })
        .catch( error => {
            console.log(error);
        });
    }

    handleFieldCheckboxChange(id) {
        let selectedFields = this.state.selectedFields;
        selectedFields.push(id);

        this.setState({selectedFields});
    }

    deleteSubscriberField = (fieldId, subscriberId) => {
        axios.delete('/subscriber/' + subscriberId + '/fields/' + fieldId)
            .then( response => {  
                const subscriberFields = this.state.subscriberFields;   
         
                const filteredSubsriberFields = subscriberFields.filter((field) => {
                    return parseInt(field.id) !== parseInt(fieldId)
                });

                this.setState( { 
                    subscriberFields: filteredSubsriberFields,
                    // modalIsOpen: false,
                    loading: false,
                });
            })
            .catch( error => {
                this.setState({
                    error: true, 
                    loading: false,
                });
            });
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

    inputChangedHandler(event, formElement) {
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

    render () {
        const stateOptions = subscriberStates.map( (stateName, key) => {
            return <option key={key} value={key}>{stateName}</option>
        });

        const subscriberFields = this.state.subscriberFields.map( field => {
            return (
                <h6 key={field.id} className="pl-3">{field.title} &nbsp;
                    <span className="badge badge-secondary">
                        {functions.fieldTypes(field.type)}
                    </span>&nbsp;
                    <small className="pointer text-danger" onClick={() => {this.deleteSubscriberField(field.id, this.props.id)}}>Delete</small>
                </h6>
            );
        });

        let alert = null;
        if (this.state.errorResponse !== '') {
            alert = <div className="alert alert-danger" role="alert">{this.state.errorResponse}</div>
        }

        let loader = null;
        if (this.props.loading) {
            loader = <Spinner />;
        }

        let availableFields = null;
        if (this.state.showFields) {
            availableFields = this.state.availableFields.map( field => { 
                return (
                    <div key={field.id} className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id={field.id} onChange={() => this.handleFieldCheckboxChange(field.id)} />
                        <label className="form-check-label" htmlFor={field.id}>
                            <h6 key={field.id}>{field.title} &nbsp;
                                <span className="badge badge-secondary">
                                    {functions.fieldTypes(field.type)}
                                </span>&nbsp;
                            </h6>
                        </label>
                    </div>
                );
            });
        }

        return (
            <div>
                <div className="modal-header">
                    <h5 className="modal-title">Edit record</h5>
                    <button type="button" className="close" onClick={this.props.close}>
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    {loader}
                    {alert}
                    <form>
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input 
                                type="email" 
                                className={this.state.formData.email.valid || !this.state.formData.email.touched ? "form-control" : "form-control is-invalid" }
                                id="email" 
                                defaultValue={this.state.formData.email.value} 
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
                                defaultValue={this.state.formData.name.value} 
                                onChange={( event ) => this.inputChangedHandler(event, 'name')}/>
                            <div className="invalid-feedback">
                                {this.state.formData.name.errorText} 
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="state">State</label>
                            <select 
                                className="form-control" 
                                id="state" 
                                defaultValue={this.state.formData.state.value} 
                                onChange={( event ) => this.inputChangedHandler(event, 'state')}>
                                {stateOptions}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Fields</label>&nbsp;
                            {subscriberFields}
                            <button 
                                type="button" 
                                className="btn btn-success btn-sm" 
                                onClick={() => {this.addNewField(this.props.id)}}>
                                    Add new field
                            </button>
                        </div>
                        <div className={availableFields !== null ? "fields-container" : ""}>
                            {availableFields}
                        </div>
                    </form>
                </div>
                <div className="text-center mt-2">
                    <button className="btn btn-light" onClick={this.props.close}>Close</button>&nbsp;|&nbsp;
                    <button 
                        className="btn btn-success" 
                        disabled={!this.state.formValid} 
                        onClick={() => this.props.updateSubscriber(this.state.formData, this.state.selectedFields, this.props.id)}
                    >
                        Save
                    </button>
                </div>
            </div>
        );
    }
}

export default SubscriberEdit;