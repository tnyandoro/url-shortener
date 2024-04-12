const useState = React.useState;
const useEffect = React.useEffect;
//import React, { useState, useEffect } from 'react';
//import axios from 'axios';

function App() {

    const [urls, setUrls] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [currentURL, setCurrentURL] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        loadURLs();
    }, [currentPage]);

    const loadURLs = async () => {
        try {
            const response = await axios.get(`/urls?page=${currentPage}&size=${pageSize}`);
            const { items, page, size } = response.data;
            setUrls(items);
            setTotalPages(Math.ceil(size / 10)); // Calculate total pages
        } catch (error) {
            console.error('Error fetching URLs:', error);
        }
    };

    const handleAdd = () => {
        setCurrentURL({...{ id: null, name: null, url: null }});
        setFormModalOpen(true);
    };

    const handleEdit = (url) => {
        setCurrentURL({ ...url });
        setFormModalOpen(true);
    };

    const handleDelete = (url) => {
        setCurrentURL({ ...url });
        setDeleteModalOpen(true);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setCurrentURL({});
    };

    const handleDeleteModalClose = () => {
        setDeleteModalOpen(false);
        setCurrentURL({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentURL({ ...currentURL, [name]: value });
    };

    const handleSaveSubmission = async () => {
        try {
            if (currentURL?.id) {
                await axios.put(`/urls/${currentURL.id}`, currentURL);
            } else {
                await axios.post('/urls', currentURL);
            }
            loadURLs();
            handleFormModalClose();
        } catch (error) {
            console.error('Error submitting URL:', error);
        }
    };

    const handleDeleteSubmission = async () => {
        try {
            await axios.delete(`/urls/${currentURL.id}`);
            loadURLs();
            handleDeleteModalClose();
        } catch (error) {
            console.error('Error deleting URL:', error);
        }
    };

    return (
        <>
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1>URL Shortener</h1>
                    <button
                        className="btn btn-success"
                        onClick={handleAdd}
                    >
                        <i className="bi bi-plus"></i> Add
                    </button>
                </div>    
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">URL</th>
                            <th scope="col">Short URL</th>
                            <th scope="col" className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {urls.map((url) => (
                            <tr key={url.id}>
                                <td>{url.name}</td>
                                <td>
                                    <a 
                                        href={url.url} 
                                        target="_blank"
                                    >
                                        {url.url}
                                    </a>
                                </td>
                                <td>
                                    <a 
                                        href={url.shortUrl} 
                                        target="_blank"
                                    >
                                        {url.shortUrl}
                                    </a>
                                </td>
                                <td className="text-end">
                                    <button
                                        className="btn btn-primary btn-sm me-2"
                                        onClick={() => handleEdit(url)}
                                    >
                                        <i className="bi bi-pencil"></i>
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(url)}
                                    >
                                        <i className="bi bi-trash"></i>
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
                    className={`modal fade ${deleteModalOpen ? 'show' : ''}`}
                    tabIndex="-1"
                    role="dialog"
                    aria-hidden={!formModalOpen}
                    style={{ display: deleteModalOpen ? 'block' : 'none' }}
                >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Delete URL
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleDeleteModalClose}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete {currentURL.name} ?
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleDeleteModalClose}
                                >
                                    No, Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-danger"
                                    onClick={handleDeleteSubmission}
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={`modal fade ${formModalOpen ? 'show' : ''}`}
                    tabIndex="-1"
                    role="dialog"
                    style={{ display: formModalOpen ? 'block' : 'none' }}
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {currentURL?.id ? 'Edit URL' : 'Add URL'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleFormModalClose}
                                    aria-label="Close"
                                ></button>
                            </div>
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
                                        value={currentURL.name}
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
                                        value={currentURL.url}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleFormModalClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    onClick={handleSaveSubmission}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);