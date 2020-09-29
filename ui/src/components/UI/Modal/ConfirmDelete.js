import React from 'react';

const confirm = (props) => (
    <div>
        <div className="modal-body">
            <p>Are you sure you want to delete the record?</p>
        </div>
        <div className="text-center mt-2">
            <button className="btn btn-light" onClick={props.close}>Close</button>&nbsp;|&nbsp;
            <button className="btn btn-danger" onClick={props.confirmDelete}>Delete</button>
        </div>
    </div>
);

export default confirm;