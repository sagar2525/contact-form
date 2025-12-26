import React, { useEffect, useState } from 'react';

const SubmissionsList = () => {
    // State for storing the list of submissions from API
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the modal popup
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    // State for filtering (Tabs)
    const [filter, setFilter] = useState('new'); // 'new' or 'resolved'

    // Function to fetch data from our Backend API
    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/contact');
            if (!response.ok) {
                throw new Error('Failed to fetch submissions');
            }
            const data = await response.json();
            setSubmissions(data.submissions);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when component mounts
    useEffect(() => {
        fetchSubmissions();
    }, []);

    // Handle clicking on a row to open modal
    const handleRowClick = (submission) => {
        setSelectedSubmission(submission);
    };

    // Close the details modal
    const closeModal = () => {
        setSelectedSubmission(null);
    };

    // Mark a ticket as Resolved
    const handleResolve = async () => {
        if (!selectedSubmission) return;
        try {
            const response = await fetch(`http://localhost:3000/api/contact/${selectedSubmission.id}/resolve`, {
                method: 'PATCH'
            });
            if (response.ok) {
                // Refresh list and close modal
                await fetchSubmissions();
                closeModal();
            } else {
                alert("Failed to resolve ticket");
            }
        } catch (error) {
            console.error(error);
            alert("Error resolving ticket");
        }
    };

    // Delete a ticket
    const handleDelete = async () => {
        if (!selectedSubmission) return;
        // Confirm before deleting
        if (!confirm("Are you sure you want to delete this submission?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api/contact/${selectedSubmission.id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                await fetchSubmissions();
                closeModal();
            } else {
                alert("Failed to delete ticket");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting ticket");
        }
    };

    // Filter submissions based on the active tab
    const filteredSubmissions = submissions.filter(sub => {
        const status = sub.status || 'new'; // Default to 'new' if status is missing
        return status === filter;
    });

    if (loading && submissions.length === 0) return <div className="loading">Loading submissions...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="admin-container">
            <h2>Admin Submissions</h2>

            {/* Tabs to switch between Inbox and Resolved */}
            <div className="tabs">
                <button
                    className={`tab-btn ${filter === 'new' ? 'active' : ''}`}
                    onClick={() => setFilter('new')}
                >
                    Inbox (New)
                </button>
                <button
                    className={`tab-btn ${filter === 'resolved' ? 'active' : ''}`}
                    onClick={() => setFilter('resolved')}
                >
                    Resolved
                </button>
            </div>

            {filteredSubmissions.length === 0 ? (
                <p className="empty-state">No {filter} submissions found.</p>
            ) : (
                <div className="table-responsive">
                    <table className="submissions-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Subject</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Render rows dynamically */}
                            {filteredSubmissions.map((sub) => (
                                <tr
                                    key={sub.id}
                                    onClick={() => handleRowClick(sub)}
                                    className="clickable-row"
                                >
                                    <td>{sub.id}</td>
                                    <td>{sub.name}</td>
                                    <td>{sub.subject}</td>
                                    <td>{new Date(sub.createdAt).toLocaleString()}</td>
                                    <td>
                                        <span className={`status-badge status-${sub.status || 'new'}`}>
                                            {sub.status || 'new'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for Submission Details */}
            {selectedSubmission && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Submission Details</h3>
                            <button className="close-btn" onClick={closeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-info-grid">
                                <p><strong>ID:</strong> {selectedSubmission.id}</p>
                                <p><strong>Status:</strong> <span className={`status-badge status-${selectedSubmission.status || 'new'}`}>{selectedSubmission.status || 'new'}</span></p>
                                <p><strong>Date:</strong> {new Date(selectedSubmission.createdAt).toLocaleString()}</p>
                                <p><strong>Name:</strong> {selectedSubmission.name}</p>
                                <p><strong>Email:</strong> {selectedSubmission.email}</p>
                                <p><strong>Subject:</strong> {selectedSubmission.subject}</p>
                            </div>
                            <hr />
                            <p><strong>Message:</strong></p>
                            <div className="message-content">
                                {selectedSubmission.message}
                            </div>
                        </div>
                        <div className="modal-footer">
                            {/* Only show 'Resolve' button if ticket is new */}
                            {(selectedSubmission.status || 'new') === 'new' && (
                                <button className="btn-resolve" onClick={handleResolve}>
                                    ✓ Resolve Ticket
                                </button>
                            )}
                            <button className="btn-delete" onClick={handleDelete}>
                                🗑 Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionsList;
