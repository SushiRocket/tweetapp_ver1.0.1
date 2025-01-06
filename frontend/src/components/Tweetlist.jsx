// frontend/src/components/TweetList.jsx
import React from 'react';

const [tweets, setTweets] = useState([]);

useEffect(() => {
  fetchTweets();
}, []);

const fetchTweets = () => {
  axios.get('http://localhost:8000/api/tweets/')
    .then(response => {
      setTweets(response.data);
    })
    .catch(error => {
      console.error('Error fetching tweets:', error);
    });
};

const handleTweetCreated = (newTweet) => {
  // 受け取った新規ツイートを先頭に追加してステート更新
  setTweets((prevTweets) => [newTweet, ...prevTweets]);

  // サーバーの正確な状態を再取得（バックグラウンドでリストを最新化）
  fetchTweets();
};


function TweetList({ tweets }) {
  return (
    <div>
      <h1>Tweet List</h1>
      {tweets.map((tweet) => (
        <div key={tweet.id}>
          {tweet.content}
        </div>
      ))}
    </div>
  );
}

export default TweetList;
