// frontend/src/TweetCreateForm.jsx

import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";


function TweetCreateForm({ onTweetCreated }) {
    // ツイート本文を管理するステート
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    // フォーム送信時に呼ばれる関数
    const handleSubmit = (e) => {
        e.preventDefault(); // ページリロードを防ぐ

        if (!content.trim()) {
            setError('Tweet cannot be empty.');
            return;
        }
        
        // axios.post(URL, 送信データ) でAPIにPOSTリクエスト
        axios.post('http://localhost:8000/api/tweets/', { content })
        .then(response => {
            // 新しく作成されたTweetオブジェクトが返ってくる想定 (response.data)
            console.log("Created new tweet:", response.data);

            // フォームをクリア
            setContent('');
            setError('')
            if (onTweetCreated) {
                onTweetCreated(response.data);
            }
        })
        .catch(error => {
            console.error("Failed to create tweet:", error);
            
            if (error.response) {
                // サーバーから応答があったがステータスコードが2xxではない場合
                console.error("Response data:", error.response.data);
                setError("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                setError("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
                setError("Response headers:", error.response.headers);
              } else if (error.request) {
                // リクエストは送られたがレスポンスがない場合
                console.error("Request:", error.request);
                setError("Request:", error.request);
              } else {
                // リクエスト設定そのものに問題があった場合
                console.error("Error message:", error.message);
                setError("Error message:", error.message);
              }
        
              console.error("Config:", error.config);
              setError("Config:", error.config);
        });
    };

    return (
        <div>
            <h3>Create a new Tweet</h3>
            {error && <p style={{ color: 'red',}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="What's Up?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <button type="submit">Tweet</button>
            </form>
        </div>
    );
}

export default TweetCreateForm