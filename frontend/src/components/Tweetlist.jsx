// frontend/src/components/TweetList.jsx
import React from 'react';

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
