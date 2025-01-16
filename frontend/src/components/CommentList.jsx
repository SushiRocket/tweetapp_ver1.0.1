// frontend/src/components/CommentList.jsx

import React, { useState } from 'react';
import API from '../axiosConfig';

function CommentList({ tweetId, comments = [] }) {
    const [commentList, setCommentList] = useState(comments);
    const [newComment, setNewComment] = useState('');

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        API.post('comments/', { tweet: tweetId, content: newComment })
            .then(() => {
                setNewComment('');
                setCommentList([...commentList, Response.data]);
            })
            .catch((error) => {
                console.error('Error posting comment:', error);
            });
    };

    return (
        <div>
            <h3>Comments</h3>
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment.id} style={{ marginBottom: '10px' }}>
                        <p><strong>{comment.user}</strong>: {comment.content}</p>
                        <small>{new Date(comment.created_at).toLocaleString()}</small>
                    </div>
                ))
            ) : (
                <p>No Comments yet.</p>
            )}
            <form onSubmit={handleCommentSubmit}>
                <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows="3"
                    placeholder='Write a comment...'
                    required
                ></textarea>
                <button type='submit'>Post Comment</button>
            </form>
        </div>
    );
}

export default CommentList;