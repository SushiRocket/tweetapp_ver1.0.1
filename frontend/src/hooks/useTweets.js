import { useState, useEffect, useCallback } from 'react';
import API from '../axiosConfig';

const useTweets = () => {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    const fetchTweets = useCallback(() => {
        API.get('tweets/')
        .then(response => {
            setTweets(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching tweets:', error);
            setError('Failed to load tweets');
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        fetchTweets();
    }, [fetchTweets]);

    return { tweets, setTweets, loading, error, fetchTweets };
};

export default useTweets;