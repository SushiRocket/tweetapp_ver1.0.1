// frontend/src/components/DMPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import API from '../axiosConfig';

function DMPage() {
  const { userId } = useParams();        // URLパラメータ (文字列)
  const [messages, setMessages] = useState([]);
  const [inputContent, setInputContent] = useState('');
  const socketRef = useRef(null);

  // ログインユーザーのID（数値）
  const getMyUserId = () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return null;
    }
    return Number(userId);
  };

  // 1) useEffect で「過去のDMを取得」 (インラインで API 呼び出し)
  useEffect(() => {
    // userId は文字列, myId は数値
    const paramUserId = Number(userId);
    const myId = getMyUserId();

    if (!myId) {
      console.error('myId is null or invalid');
      return;
    }

    // API呼び出しをインラインで書く:
    API.get('dm/')
      .then((res) => {
        // ここでサーバーが返した「全てのDM一覧」をまずログ
        console.log(">>> all dms data =", res.data);

        // 2) URLパラメータと自分のIDをチェック
        console.log(">>> paramUserId=", paramUserId, "myId=", myId);

        // フィルタ
        const filtered = res.data.filter((dm) =>
          (dm.sender === paramUserId && dm.recipient === myId) ||
          (dm.sender === myId && dm.recipient === paramUserId)
        );

        console.log(">>> [DMPage] initial fetchDirectMessages: filtered =", filtered);

        // 古い順にソート
        const sorted = filtered.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        setMessages(sorted);
      })
      .catch((error) => console.error(error));
  }, [userId]); 
  // ↑ 依存配列に userId のみを指定する。
  // fetchDirectMessages 関数自体は作っていないため、警告は出ない。

  // 2) WebSocket でリアルタイム接続
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    console.log("JWT Token for WebSocket:", token);
    if (!token) {
      console.error('No JWT token found in localStorage');
    }

    const wsUrl = `ws://localhost:8000/ws/dm/${userId}/?token=${token || ''}`;
    console.log("WebSocket URL:", wsUrl);

    const connectWebSocket = () => {
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket DM connected');
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socket.onmessage = (event) => {
        console.log(">>> [DMPage] onmessage event =", event.data);
        const data = JSON.parse(event.data);
        if (data.dm_id) {
          // 新しいメッセージが届いたら DM一覧を再取得 (同じインラインAPI呼び出し)
          const paramUserId = Number(userId);
          const myId = getMyUserId();
          if (!myId) {
            console.error('myId is null or invalid');
            return;
          }

          API.get('dm/')
            .then((res) => {
              const filtered = res.data.filter((dm) =>
                (dm.sender === paramUserId && dm.recipient === myId) ||
                (dm.sender === myId && dm.recipient === paramUserId)
              );

              console.log(">>> [DMPage] onmessage -> refresh: filtered =", filtered);

              const sorted = filtered.sort(
                (a, b) => new Date(a.created_at) - new Date(b.created_at)
              );
              setMessages(sorted);
            })
            .catch((error) => console.error(error));
        }
      };

    socket.onclose = () => {
      console.log('WebSocket DM disconnected');
      setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };
  };

  connectWebSocket();

  return () => {
    if (socketRef.current) {
      socketRef.current.close();
      console.log('WebSocket DM connection closed.');
    }
  };
}, [userId]);

  // メッセージ送信
  const sendMessage = () => {
    if (!socketRef.current || inputContent.trim() === '') return;
    socketRef.current.send(JSON.stringify({ message: inputContent }));
    setInputContent('');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">DM with User {userId}</h2>
      <div className="border p-4 mb-4" style={{ height: '300px', overflowY: 'auto' }}>
        {messages.map((msg, idx) => (
          <div
            key={msg.id || idx}
            className={`mb-2 ${msg.sender === getMyUserId() ? 'text-right' : 'text-left'}`}
          >
            <div className="inline-block px-2 py-1 bg-gray-200 rounded">
              <p>{msg.content}</p>
              <small className="text-xs text-gray-500">
                {new Date(msg.created_at).toLocaleTimeString()}
              </small>
            </div>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          className="border flex-1 mr-2 p-2"
          placeholder="Type a message..."
          onChange={(e) => setInputContent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          value={inputContent}
        />
        <button className="bg-blue-500 text-white px-4 py-2" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default DMPage;
