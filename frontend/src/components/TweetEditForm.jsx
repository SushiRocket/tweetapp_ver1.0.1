import React, { useState } from 'react';
import API from '../axiosConfig';

function TweetEditForm({ tweet, onUpdate, onCancel }) {
    const [content, setContent] = useState(tweet.content);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!Text.trim()) {
            setError('Tweet cannot be empty.');
            return;
        }

        API.put(`tweets/${tweet.id}/`, content)
            .then(response => {
                onUpdate(response.data);
            })
            .catch(error => {
                console.error('Error updating tweet:', error);
                setError('Failed to update tweet');
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows='3'
                cols='50'
                required
            />
            <button type='submit'>Save</button>
            <button type='button' onClick={onCancel}>Cancle</button>
        </form>
    );
}

export default TweetEditForm;