const { useState, useEffect } = React;
//import React, { useState, useEffect } from 'react';

function App() {

    const [urls, setUrls] = useState([]);
    const [error, setError] = useState(null);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [currentURL, setCurrentURL] = useState({});
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        loadURLs();
    }, [currentPage]);

    const loadURLs = async () => {
        try {

            const encodedSearchText = encodeURIComponent(searchText || '');
            const response = await axios.get(`/urls?page=${currentPage}&size=${pageSize}&search=${encodedSearchText}`);
            const { items, count } = response.data;

            setUrls(items);
            setTotalPages(Math.ceil(count / pageSize));

        } catch (error) {

            error.title = 'Load Error';
            setError(error);

        }
    };

    const handleSearch = async (reset) => {
        if (reset) {
            setSearchText('');
        }
        await loadURLs();
    };

    const handleAdd = () => {
        setCurrentURL({ id: 0, name: '', url: 'https://' });
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

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setCurrentURL({ ...currentURL, [name]: value });
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchText(value);
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

            error.title = 'Save Error';
            setError(error);

        }
    };

    const handleDeleteSubmission = async () => {
        try {

            await axios.delete(`/urls/${currentURL.id}`);

            loadURLs();
            handleDeleteModalClose();

        } catch (error) {

            error.title = 'Delete Error';
            setError(error);

        }
    };

    return (
        <>
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1
                        >URL Shortener
                    </h1>
                    <button
                        className="btn btn-success btn-sm btn-100"
                        onClick={handleAdd}
                    >
                        <i className="bi bi-plus-lg me-1"></i> Add
                    </button>
                </div>
                <div className="d-flex align-items-center mb-3">
                    <div className="col-6 me-2">
                        <div className="input-group">
                            <input
                                id="search"
                                type="text"
                                name="search"
                                className="form-control form-control-sm"
                                onChange={handleSearchChange}
                                value={searchText}
                            />
                            {/* <button
                                className="btn btn-outline-secondary btn-sm"
                                type="button"
                                onClick={() => handleSearch(true)}
                                style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
                            >
                                &times;
                            </button> */}
                        </div>
                    </div>
                    
                    <button
                        className="btn btn-primary btn-sm btn-100"
                        onClick={() => handleSearch(false)}
                    >
                        <i className="bi bi-search me-1"></i> Search
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
                        {urls.map(url => (
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
                                        className="btn btn-primary btn-sm me-2 btn-100"
                                        onClick={() => handleEdit(url)}
                                    >
                                        <i className="bi bi-pencil me-1"></i>
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm btn-100"
                                        onClick={() => handleDelete(url)}
                                    >
                                        <i className="bi bi-trash me-1"></i>
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
                    aria-hidden={!deleteModalOpen}
                    style={{ display: deleteModalOpen ? 'block' : 'none' }}
                    data-backdrop="true" 
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
                                    className="btn btn-secondary btn-sm btn-100"
                                    onClick={handleDeleteModalClose}
                                >
                                    No, Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-danger btn-sm btn-100"
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
                    aria-hidden={!formModalOpen}
                    style={{ display: formModalOpen ? 'block' : 'none' }}
                    data-backdrop="true" 
                >
                    <div className="modal-dialog modal-dialog-centered" role="document">
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
                                        className="form-control form-control-sm"
                                        id="name"
                                        name="name"
                                        value={currentURL.name}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="url" className="form-label">
                                        URL
                                    </label>
                                    <input
                                        type="url"
                                        className="form-control form-control-sm"
                                        id="url"
                                        name="url"
                                        value={currentURL.url}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm btn-100"
                                    onClick={handleFormModalClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm btn-100"
                                    onClick={handleSaveSubmission}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={`modal fade ${error ? 'show' : ''}`}
                    tabIndex="-1"
                    role="dialog"
                    aria-hidden={!error}
                    style={{ display: error ? 'block' : 'none' }}
                    data-backdrop="true" 
                >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {error?.title || 'Error'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setError(null)}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <ul class="list-group list-group-flush">
                                    {(error?.response?.data?.errors || [error?.message || 'Unknown error']).map(e => (
                                        <li class="list-group-item">{e.msg}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm btn-100"
                                    onClick={() => setError(null)}
                                >
                                    OK
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