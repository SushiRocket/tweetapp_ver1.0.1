// frontend/src/TweetCreateForm.jsx

import React, { useState } from "react";
import axios from "axios";

function TweetCreateForm({ onTweetCreated }) {
    // ツイート本文を管理するステート
    const [content, setContent] = useState("");


    // フォーム送信時に呼ばれる関数
    const handleSubmit = (e) => {
        e.preventDefault(); // ページリロードを防ぐ
        
        // axios.post(URL, 送信データ) でAPIにPOSTリクエスト
        axios.post('http://localhost:8000/api/tweets/', {
            content: content, // DRF側の Tweetモデルのフィールド名が "text" のため合わせる
        })
        .then(response => {
            // 新しく作成されたTweetオブジェクトが返ってくる想定 (response.data)
            console.log("Created new tweet:", response.data);

            // フォームをクリア
            setContent("");

        })
        .catch(error => {
            console.error("Failed to create tweet:", error);
            
            if (error.response) {
                // サーバーから応答があったがステータスコードが2xxではない場合
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
              } else if (error.request) {
                // リクエストは送られたがレスポンスがない場合
                console.error("Request:", error.request);
              } else {
                // リクエスト設定そのものに問題があった場合
                console.error("Error message:", error.message);
              }
        
              console.error("Config:", error.config);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="What's Up?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit">Tweet</button>
        </form>
    );
}

export default TweetCreateForm