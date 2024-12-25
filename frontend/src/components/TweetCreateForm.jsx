import React, { useState } from "react";
import axios from "axios";

function TweetCreateForm({ onTweetCreated }) {
    // ツイート本文を管理するステート
    const [text, setText] = useState("");


    // フォーム送信時に呼ばれる関数
    const handleSubmit = (e) => {
        e.preventDefault(); // ページリロードを防ぐ
        
        // axios.post(URL, 送信データ) でAPIにPOSTリクエスト
        axios.post('http://localhost:8000/api/tweets/', {
            text: text, // DRF側の Tweetモデルのフィールド名が "text" のため合わせる
        })
        .then(response => {
            // 新しく作成されたTweetオブジェクトが返ってくる想定 (response.data)
            console.log("Created new tweet:", response.data);

            // フォームをクリア
            setText("");

             // 親コンポーネントから渡されたコールバック関数があれば呼び出す
            // → 新規ツイートを親コンポーネント側の tweetsリスト に反映したい場合に使う
            if (onTweetCreated) {
                onTweetCreated(response.data);
            }
        })
        .catch(error => {
            console.error("Failed to create tweet:", error);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="What's Up?"
                value={text}
                onChange={(e) => setText(e.target.data)}
            />
            <button type="submit">Tweet</button>
        </form>
    );
}

export default TweetCreateForm;