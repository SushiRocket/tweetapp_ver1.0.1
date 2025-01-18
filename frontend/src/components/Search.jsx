import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../axiosConfig';

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim() === '') return;

        API.get(`search/?q=${encodeURIComponent(query)}`)
            .then((response) => {
                setResults(response.data);
            })
            .catch((error) => {
                console.error('Error searching users:', error);
                setResults([]);
                alert('No results found or an error occurred.');
            });
    };

    return (
        <div>
            <h2>User Search</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search users..."
                    required
                />
                <button type="submit">Search</button>
            </form>

            {results.length > 0 ? (
                <ul>
                    {results.map((user)=> (
                        <li key={user.id}>
                            <Link to={`/profile/${user.username}`}>{user.username}</Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found.</p>
            )}
        </div>
    );
}

export default Search;