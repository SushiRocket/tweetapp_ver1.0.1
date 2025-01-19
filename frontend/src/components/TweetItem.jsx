// frontend/src/components/TweetItem.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function TweetItem({ tweet }) {
    // ツイート本文をハッシュタグリンク化する
    const hashtagRegex = /#(\w+)/g;
    const contentWithLinks = tweet.content.split(' ').map((word, idx) => {
        if (word.match(hashtagRegex)) {
            const tagName = word.replace('#', '').toLowerCase();
            return <Link key={idx} to={`/hashtag/${tagName}`} className='text-blue-500 hover:underline'>{word}</Link>;
        }
        return word + ' ';
    });

    return (
        <div className='p-4 border-b'>
            <div className='font-bold'>{tweet.user.username}</div>
            <div>{contentWithLinks}</div>
        </div>
    );
}

export default TweetItem;