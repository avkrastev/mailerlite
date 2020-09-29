import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faAlignLeft, faListOl } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';

export function fieldTypes(type, size = '1x') {   
    switch(type) {
        case '0': //date
            return <FontAwesomeIcon size={size} icon={faCalendarAlt} />;
        case '1': //bool
            return <FontAwesomeIcon size={size} icon={faTasks} />;
        case '2': //string
            return <FontAwesomeIcon size={size} icon={faAlignLeft} />;
        case '3': //number
            return <FontAwesomeIcon size={size} icon={faListOl} />;
        default:
            return <FontAwesomeIcon size={size} icon={faAlignLeft} />;
    }
}

export function stateBadgeClass(state) {
    let badgeClass = 'badge';

    switch (state) {
        case '0': //unconfirmed
        case 'unconfirmed':
            return badgeClass += ' badge-light';
        case '1': //active
        case 'active':
            return badgeClass += ' badge-success';
        case '2': //unsubscribed
        case 'unsubscribed':
            return badgeClass += ' badge-secondary';
        case '3': //junk
        case 'junk':
            return badgeClass += ' badge-warning';
        case '4': //bounced
        case 'bounced':
            return badgeClass += ' badge-info';
        default:
            return badgeClass = 'badge';
    }
}
