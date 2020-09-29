import React, { Component } from 'react';
import axios from '../../../axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

import Subscriber from '../../../components/Subscriber/Subscriber';
import Spinner from '../../../components/UI/Spinner/Spinner';
import ModalSubscriberView from '../../../components/UI/Modal/Subscriber/SubscriberView';
import ModalSubscriberEdit from '../../../components/UI/Modal/Subscriber/SubscriberEdit';
import ModalConfirmDelete from '../../../components/UI/Modal/ConfirmDelete';
import { subscriberStates } from '../../../components/options';
import * as functions from '../../../components/functions';
import Pagination from '../../../components/Pagination/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAlphaDown, faSortAlphaUp } from '@fortawesome/free-solid-svg-icons';

class Subscribers extends Component {
    state = {
        subscribers: [],
        subscriber: [],
        error: false,
        loading: false,
        modalIsOpen: false,
        modal: '',
        errorResponse: '',
        currentPage: 1,
        order: 'id',
        orderType: 'desc'
    }

    componentDidMount () {
        this.setState({loading: true});

        const params = this.getQueryStringParams(this.props.location.search);

        axios.get('/subscribers' + this.props.location.search)
            .then( response => {
                this.setState( { 
                    loading: false, 
                    subscribers: response.data,
                    currentPage: (Object.keys(params).length > 0) ? params.page : 1,
                    order: (Object.keys(params).length > 0) ? params.order : 'id'
                });
            })
            .catch( error => {
                this.setState({
                    error: true, 
                    loading: false
                });
            });
        axios.get('/subscriber/count')
            .then( response => {
                this.setState({
                    ...response.data
                })
            })
            .catch( error => {
                console.log(error);
            });

        Modal.setAppElement('body');
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.search !== prevProps.location.search) {
            const params = this.getQueryStringParams(this.props.location.search);
    
            axios.get('/subscribers' + this.props.location.search)
                .then( response => {
                    this.setState( { 
                        loading: false, 
                        subscribers: response.data,
                        currentPage: (Object.keys(params).length > 0) ? params.page : 1,
                        order: (Object.keys(params).length > 0) ? params.order : 'id'
                    });
                })
                .catch( error => {
                    this.setState({
                        error: true, 
                        loading: false
                    });
                });
        }
    }

    getQueryStringParams = query => {
        return query
            ? (/^[?#]/.test(query) ? query.slice(1) : query)
                .split('&')
                .reduce((params, param) => {
                        let [key, value] = param.split('=');
                        params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                        return params;
                    }, {}
                )
            : {}
    };

    openModal(id, action) {
        axios.get('/subscriber/' + id + '/fields')
            .then( response => {
                this.setState( { 
                    subscriber: response.data,
                    modalIsOpen: true,
                    modal: action 
                });
            })
            .catch( error => {
                this.setState({
                    error: true, 
                });
            });
    }

    updateSubscriber = (data, fields, id) => {
        this.setState({loading: true});

        const updateData = {
            id,
            email: data.email.value,
            name: data.name.value,
            state: data.state.value,
            fields
        };

        axios.post( '/subscribers/' + id, updateData )
            .then( response => {
                let updatedSubscribers = this.state.subscribers.map((subscriber) => {
                    if (parseInt(subscriber.id) === parseInt(id)) {
                        subscriber = {...response.data};
                        subscriber.state = subscriberStates.indexOf(response.data.state);
                    }

                    return subscriber;
                });

                this.setState({
                    subscribers: updatedSubscribers,
                    subscriber: response.data,
                    loading: false,
                    modalIsOpen: false,
                });
                // this.props.history.replace('/subscribers');
            })
            .catch( error => {
                let errorResponse = '';
                if (error.response) {
                    errorResponse = error.response.data.error
                }

                this.setState( { loading: false, errorResponse } );
            });
    }

    deleteSubscriber() {
        this.setState({loading: true});
        axios.delete('/subscribers/' + this.state.subscriber.id)
            .then( response => {  
                const updatedSubscribers = [
                    ...this.state.subscribers
                ];   
                
                const filteredSubsribers = updatedSubscribers.filter((subscriber) => {
                    return parseInt(subscriber.id) !== parseInt(this.state.subscriber.id)
                });

                this.setState( { 
                    subscribers: filteredSubsribers,
                    modalIsOpen: false,
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
     
    closeModal(){
        this.setState({modalIsOpen: false, errorResponse: ''});
    }

    render () {
        let loader = null;
        if (this.state.loading) {
            loader = <Spinner />;
        }
        
        let modal = null;
        if (this.state.modal === 'view') {
            const subscriberFields = this.state.subscriber.fields.map( field => {
                return (
                    <h6 key={field.id} className="pl-3">{field.title} &nbsp;
                        <span className="badge badge-secondary">
                            {functions.fieldTypes(field.type)}
                        </span>
                    </h6>
                );
            });
            modal = (
                <ModalSubscriberView
                    name={this.state.subscriber.name}
                    email={this.state.subscriber.email}
                    state={this.state.subscriber.state}
                    updated_at={this.state.subscriber.updated_at}
                    created_at={this.state.subscriber.created_at}
                    close={this.closeModal.bind(this)}
                    fields={subscriberFields}
                />
            );
        }

        if (this.state.modal === 'edit') {
            modal = (
                <ModalSubscriberEdit
                    id={this.state.subscriber.id}
                    name={this.state.subscriber.name}
                    email={this.state.subscriber.email}
                    state={this.state.subscriber.state}
                    close={this.closeModal.bind(this)}
                    errorResponse={this.state.errorResponse}
                    subscriber={this.state.subscriber}
                    subscriberFields={this.state.subscriber.fields}
                    updateSubscriber = {this.updateSubscriber}
                    loading={this.state.loading}
                />
            );
        }

        if (this.state.modal === 'delete') {
            modal = (
                <ModalConfirmDelete
                    confirmDelete={this.deleteSubscriber.bind(this)}
                    close={this.closeModal.bind(this)}
                />
            );
        }

        const params = this.getQueryStringParams(this.props.location.search);

        let type = 'asc';
        let sortIcon = <FontAwesomeIcon icon={faSortAlphaUp} />;
        if (params.type === 'asc') {
            type = 'desc';
            sortIcon = <FontAwesomeIcon icon={faSortAlphaDown} />;
        }
        if (params.type === 'desc') {
            type = 'asc';
        }

        if (!this.state.error) {
            return (
                <div className="container">
                    
                    <Link className="btn btn-success float-right new-subscriber" to="/new-subscriber">+ New Subscriber</Link>
                    <div className="subscribers">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>
                                        <Link 
                                            to={{
                                                pathname: '/subscribers',
                                                search: '?order=name&type='+type+'&page='+this.state.currentPage
                                            }}>
                                            Name {params.order === 'name' ? sortIcon : null}
                                        </Link>
                                    </th>
                                    <th>
                                        <Link 
                                            to={{
                                                pathname: '/subscribers',
                                                search: '?order=email&type='+type+'&page='+this.state.currentPage
                                            }}>
                                            E-mail {params.order === 'email' ? sortIcon : null}
                                        </Link>
                                    </th>
                                    <th>
                                        <Link 
                                            to={{
                                                pathname: '/subscribers',
                                                search: '?order=state&type='+type+'&page='+this.state.currentPage
                                            }}>
                                            State {params.order === 'state' ? sortIcon : null}
                                        </Link>
                                    </th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.subscribers.map( subscriber => (
                                    <Subscriber
                                        key={subscriber.id}
                                        name={subscriber.name}
                                        email={subscriber.email}
                                        state={subscriber.state}
                                        stateName={subscriberStates}                              
                                        view={() => this.openModal(subscriber.id, 'view')}
                                        edit={() => this.openModal(subscriber.id, 'edit')}
                                        delete={() => this.openModal(subscriber.id, 'delete')} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        recordsPerPage={this.state.recordsPerPage}
                        currentPage={this.state.currentPage}
                        numberOfRecords={this.state.allRecordsCount}
                        order={this.state.order}
                        orderType={this.state.orderType}
                        changePage={this.changePage}
                        params={params}/>
                    {loader}
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

        return (
            <div>
                <div className="container">
                    <h2 className="text-center">Something went wrong!</h2>
                </div>
            </div>
        );
    }
}

export default Subscribers;