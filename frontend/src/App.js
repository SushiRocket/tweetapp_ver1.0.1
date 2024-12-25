import React, {useEffect,useState} from 'react';
import axios from 'axios';

function App() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    //コンポーネントがマウントされたときにAPIを呼ぶ
    axios.get('htttps://localhost:8000/api/tweets')
    .then(response => {
      setTweets(response.data);
    })
    .catch(error => {
      console.error('Error fetching tweets:', error);
    });
  }, []);

  return (
    
  )