import React, { Component } from 'react';
import axios from '../../../axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

import Field from '../../../components/Field/Field';
import './Fields.css';
import ModalFieldEdit from '../../../components/UI/Modal/Field/FieldEdit';
import ModalConfirmDelete from '../../../components/UI/Modal/ConfirmDelete';
import { fieldTypes } from '../../../components/options';
import * as functions from '../../../components/functions';

class Fields extends Component {
    state = {
        fields: [],
        field: [],
        modalIsOpen: false,
        modal: '',
        errorResponse: ''
    }

    componentDidMount () {
        axios.get( '/field' )
            .then( response => {
                this.setState( { fields: response.data } );
            } )
            .catch( error => {
                this.setState({error: true});
            } );

        Modal.setAppElement('body');
    }

    openModal(id, action) {
        this.setState({
            errorResponse: ''
        });
        axios.get('/field/' + id)
            .then( response => {
                this.setState( { 
                    field: response.data,
                    modalIsOpen: true,
                    modal: action 
                });
            })
            .catch( error => {
                let errorResponse = '';
                if (error.response) {
                    errorResponse = error.response.data.error
                }
                this.setState({
                    errorResponse
                });
            });
    }

    updateField(data, id) {
        this.setState({loading: true});

        const updateData = {
            id,
            title: data.title.value,
            type: data.type.value,
            description: data.description.value
        };

        axios.post( '/field/' + id, updateData )
            .then( response => {
                let updatedFields = this.state.fields.map((field) => {
                    if (parseInt(field.id) === parseInt(id)) {
                        field = {...response.data};
                        field.type = fieldTypes.indexOf(response.data.type).toString();
                    }
                    return field;
                });

                this.setState({
                    fields: updatedFields,
                    field: response.data,
                    loading: false,
                    modalIsOpen: false,
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
    
    deleteField() {
        this.setState({
            errorResponse: ''
        });
        axios.delete('/field/' + this.state.field.id)
            .then( response => {  
                const updatedFields = [
                    ...this.state.fields
                ];   
                
                const filteredFields = updatedFields.filter((field) => {
                    return parseInt(field.id) !== parseInt(this.state.field.id)
                });

                this.setState( { 
                    fields: filteredFields,
                    modalIsOpen: false,
                });
            })
            .catch( error => {
                let errorResponse = '';
                if (error.response) {
                    errorResponse = error.response.data.error
                }
                
                this.setState({
                    modalIsOpen: false,
                    errorResponse
                });
            });
    }

    closeModal(){
        this.setState({modalIsOpen: false, errorResponse: ''});
    }

    render () {
        let fields = <p className="text-center">Something went wrong!</p>;

        if ( !this.state.error ) {
            fields = this.state.fields.map( field => {
                return (
                    <div className="col-sm-3" key={field.id}>
                        <div className="card-group mt-5">
                            <Field
                                title={field.title}
                                type={field.type}
                                description={field.description}
                                icon={functions.fieldTypes(field.type, '2x')}
                                edit={() => this.openModal(field.id, 'edit')}
                                delete={() => this.openModal(field.id, 'delete')} />
                        </div>
                    </div>
                );
            } );
        }

        let modal = null;

        if (this.state.modal === 'edit') {
            modal = (
                <ModalFieldEdit
                    id={this.state.field.id}
                    title={this.state.field.title}
                    description={this.state.field.description}
                    type={fieldTypes.indexOf(this.state.field.type)}
                    updateField={this.updateField.bind(this)}
                    close={this.closeModal.bind(this)}
                />
            );
        }

        if (this.state.modal === 'delete') {
            modal = (
                <ModalConfirmDelete
                    confirmDelete={this.deleteField.bind(this)}
                    close={this.closeModal.bind(this)}
                />
            );
        }

        let alert = null;
        if (this.state.errorResponse !== '') {
            alert = (
                <div className="alert alert-danger mt-5" role="alert">
                    <strong>{this.state.field.title}</strong>: "{this.state.errorResponse}"
                </div>
            );
        }

        return (
            <div>       
                <div className="container ">
                    {alert}  
                    <div className="text-right mt-5">
                        <Link className="btn btn-success" to="/new-field">+ New Field</Link>
                    </div>
                    <div className="row">  
                        {fields}
                    </div>
                </div>

                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal.bind(this)}
                    style={{
                        content : {
                            top                   : '50%',
                            left                  : '50%',
                            right                 : 'auto',
                            bottom                : 'auto',
                            marginRight           : '-50%',
                            transform             : 'translate(-50%, -50%)',
                            width                 : '30%'
                        }
                    }}
                >     
                    {modal}
                </Modal>
                
            </div>
        );
    }
}

export default Fields;