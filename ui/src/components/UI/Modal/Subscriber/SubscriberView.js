import React from 'react';
import { stateBadgeClass } from '../../../functions';

const view = (props) => (
    <div>
        <div className="modal-header">
            <h5 className="modal-title">{props.name}</h5>
            <button type="button" className="close" onClick={props.close}>
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div className="modal-body">
            <p><strong>E-mail:</strong> {props.email}</p>
            <p><strong>State:</strong> <span className={stateBadgeClass(props.state)}>{props.state}</span></p>
            <p><strong>Fields:</strong></p>
            {props.fields}
            <hr/>
            <p><strong>Updated:</strong> {props.updated_at}</p>
            <p><strong>Created:</strong> {props.created_at}</p>
        </div>
        <div className="text-center mt-2">
            <button className="btn btn-light" onClick={props.close}>Close</button>
        </div>
    </div>
);

export default view;