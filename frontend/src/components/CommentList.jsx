import React, { useState } from 'react';
import API from '../axiosConfig';

function CommentList({ tweetId, comments }) {
    const [newComment, setNewComment] = useState('');

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        API.post('comments/', { tweet: tweetId, content: newComment })
            .then(() => {
                setNewComment('');
                window.location.reload();//コメント後にページをリロード
            })
            .catch((error) => {
                console.error('Error posting comment:', error);
            });
    };

    return (
        <div>
            <h3>Comments</h3>
            {comments.legth > 0 ? (
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
                    row="3"
                    placeholder='Write a comment...'
                    required
                ></textarea>
                <button type='submit'>Post Comment</button>
            </form>
        </div>
    );
}

export default CommentList;