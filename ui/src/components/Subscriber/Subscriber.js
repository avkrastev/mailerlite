import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faEye } from '@fortawesome/free-regular-svg-icons';
import { stateBadgeClass } from '../../components/functions';

class Subscriber extends Component {

    render() {
        return (
            <tr>
                <td>
                    {this.props.name}
                </td>
                <td>
                    {this.props.email}
                </td>
                <td>
                    <span className={stateBadgeClass(this.props.state)}>{this.props.stateName[this.props.state]}</span>
                </td>
                <td className="text-right">
                    <button type="button" className="btn btn-light" onClick={this.props.view}><FontAwesomeIcon icon={faEye} /></button>&nbsp;|&nbsp; 
                    <button type="button" className="btn btn-light" onClick={this.props.edit}><FontAwesomeIcon icon={faEdit} /></button>&nbsp;|&nbsp; 
                    <button type="button" className="btn btn-danger" onClick={this.props.delete}><FontAwesomeIcon icon={faTrashAlt} /></button>
                </td>
            </tr>
        );
    }
}

export default Subscriber;