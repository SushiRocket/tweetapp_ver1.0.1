import React, {useEffect,useState} from 'react';
import axios from 'axios';

function TweetList() {
  // 初期値は空の配列 [] にする。
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    //コンポーネントがマウントされたときにAPIを呼ぶ
    axios.get('htttps://localhost:8000/api/tweets/')
    .then(response => {
      setTweets(response.data);
    })
    .catch(error => {
      console.error('Error fetching tweets:', error);
    });
  }, []);
  // ↑ 第2引数が [] の場合、コンポーネントの初回マウント時のみ useEffect 内の処理が実行される。

  // 取得した tweets の中身を表示する。
  // tweets が配列なので、tweets.map() で繰り返し処理して表示する。

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