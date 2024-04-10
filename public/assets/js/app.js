const useState = React.useState;
const useEffect = React.useEffect;
//import React, { useState, useEffect } from 'react';
//import axios from 'axios';

function App() {
    const [urls, setUrls] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Zero-based index for pagination
    const [totalPages, setTotalPages] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editURL, setEditURL] = useState(null);
    const [newURL, setNewURL] = useState({ name: '', url: '' });

    useEffect(() => {
        fetchURLs();
    }, [currentPage]);

    const fetchURLs = async () => {
        try {
            const response = await axios.get(`/urls?page=${currentPage}&size=10`); // Assuming 10 rows per page
            const { items, page, size } = response.data;
            setUrls(items);
            setTotalPages(Math.ceil(size / 10)); // Calculate total pages
        } catch (error) {
            console.error('Error fetching URLs:', error);
        }
    };

    const handleEdit = (url) => {
        setEditURL(url);
        setNewURL({ ...url }); // Populate form fields with URL data
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this URL?')) {
            try {
                await axios.delete(`/urls/${id}`);
                fetchURLs();
            } catch (error) {
                console.error('Error deleting URL:', error);
            }
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setEditURL(null);
        setNewURL({ name: '', url: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewURL({ ...newURL, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editURL) {
                await axios.put(`/urls/${editURL.id}`, newURL);
            } else {
                await axios.post('/urls', newURL);
            }
            fetchURLs();
            handleModalClose();
        } catch (error) {
            console.error('Error submitting URL:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>URL Manager</h1>
                <button
                    className="btn btn-success"
                    onClick={() => {
                        setModalOpen(true);
                        setEditURL(null);
                    }}
                >
                    Add URL
                </button>
            </div>
    
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">URL</th>
                        <th scope="col">Short URL</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {urls.map((url) => (
                        <tr key={url.id}>
                            <td>{url.name}</td>
                            <td>{url.url}</td>
                            <td>{url.shortUrl}</td>
                            <td>
                                <button
                                    className="btn btn-primary btn-sm me-2"
                                    onClick={() => handleEdit(url)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(url.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
    
            <nav>
                <ul className="pagination">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <li
                            key={index}
                            className={`page-item ${currentPage === index ? 'active' : ''}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(index)}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
    
            <div
                className={`modal fade ${modalOpen ? 'show' : ''}`}
                tabIndex="-1"
                role="dialog"
                style={{ display: modalOpen ? 'block' : 'none' }}
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {editURL ? 'Edit URL' : 'Add URL'}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleModalClose}
                                aria-label="Close"
                            ></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={newURL.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="url" className="form-label">
                                        URL
                                    </label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        id="url"
                                        name="url"
                                        value={newURL.url}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleModalClose}
                                >
                                    Close
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editURL ? 'Save Changes' : 'Add URL'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);