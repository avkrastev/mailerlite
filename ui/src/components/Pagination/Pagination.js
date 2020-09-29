import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Pagination extends Component {
    
    render () {
        const prevPage = parseInt(this.props.currentPage) - 1;
        const nextPage = parseInt(this.props.currentPage) + 1;

        let orderType = Object.keys(this.props.params).length > 0 ? this.props.params.type : this.props.orderType;
        let pagination = null;

        if (this.props.numberOfRecords > this.props.recordsPerPage) {
            let pages = [];
            const pagesCount = Math.ceil(this.props.numberOfRecords / this.props.recordsPerPage);
            for (let i = 1; i <= pagesCount; i++) {
                pages.push(<li key={i} className={i === parseInt(this.props.currentPage) ? "page-item active" : "page-item"}>
                                <Link 
                                    className="page-link" 
                                    to={{
                                        pathname: '/subscribers',
                                        search: '?order='+this.props.order+'&type='+orderType+'&page='+i
                                    }}
                                >{i}</Link>
                           </li>); 
            }

            pagination = (
                <nav>
                    <ul className="pagination justify-content-center">
                        <li className={parseInt(this.props.currentPage) === 1 ? "page-item disabled" : "page-item"}>
                            <Link className="page-link" to={{
                                pathname: '/subscribers',
                                search: '?order='+this.props.order+'&type='+orderType+'&page='+prevPage
                            }}>Previous</Link>
                        </li>
                        {pages}
                        <li className={parseInt(this.props.currentPage) === pagesCount ? "page-item disabled" : "page-item"}>
                            <Link className="page-link" to={{
                                pathname: '/subscribers',
                                search: '?order='+this.props.order+'&type='+orderType+'&page='+nextPage
                            }}>Next</Link>
                        </li>
                    </ul>
                </nav>
            );
        }
        return (
            <div>
                {pagination}
            </div>   
        );
    }
}
export default Pagination;