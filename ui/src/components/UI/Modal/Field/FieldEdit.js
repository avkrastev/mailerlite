import React, { Component } from 'react';
import { fieldTypes } from '../../../options';

class FieldsEdit extends Component {
    state = {
        formData : {
            title: {
                value: this.props.title,
                valid: true,
                touched: false,
                errorText: 'The title is required!'
            },
            type: {
                value: this.props.type,
                valid: true,
                touched: false,
            },
            description: {
                value: this.props.description,
                valid: true,
                touched: false
            },
        },
        field: this.props.field,
        formValid: true,
        errorResponse: this.props.errorResponse
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
        const fieldTypeOptions = fieldTypes.map( (stateName, key) => {
            return <option key={key} value={key}>{stateName}</option>
        });

        return (
            <div>
            <div className="modal-header">
                <h5 className="modal-title">Edit record</h5>
                <button type="button" className="close" onClick={this.props.close}>
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <form>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input 
                            type="text" 
                            className={this.state.formData.title.valid || !this.state.formData.title.touched ? "form-control" : "form-control is-invalid" }
                            id="title" 
                            defaultValue={this.state.formData.title.value} 
                            onChange={(event) => this.inputChangedHandler(event, 'title')}/>
                        <div className="invalid-feedback">
                            {this.state.formData.title.errorText} 
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <select 
                            className="form-control" 
                            id="type" 
                            defaultValue={this.state.formData.type.value} 
                            onChange={(event) => this.inputChangedHandler(event, 'type')}>
                            {fieldTypeOptions}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea 
                            className="form-control" 
                            rows="3" 
                            id="description"
                            defaultValue={this.state.formData.description.value} 
                            onChange={(event) => this.inputChangedHandler(event, 'description')}>
                        </textarea>
                    </div>
                </form>
            </div>
            <div className="text-center mt-2">
                <button className="btn btn-light" onClick={this.props.close}>Close</button>&nbsp;|&nbsp;
                <button className="btn btn-success" onClick={() => this.props.updateField(this.state.formData, this.props.id)}>Save</button>
            </div>
        </div>
        );
    }
}
export default FieldsEdit;