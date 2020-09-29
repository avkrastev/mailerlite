import React from 'react';

import './Field.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons';

const field = (props) => (
    <div className="card" >
        <div className="text-center mt-3">
            {props.icon}
        </div>
        <div className="card-body">
            <h5 className="card-title">{props.title}</h5>
            <p className="card-text">{props.description} </p>
            <button className="btn btn-light" onClick={props.edit}><FontAwesomeIcon icon={faEdit} /></button>&nbsp;|&nbsp;
            <button className="btn btn-danger" onClick={props.delete}><FontAwesomeIcon icon={faTrashAlt} /></button>
        </div>
    </div>
);

export default field;
