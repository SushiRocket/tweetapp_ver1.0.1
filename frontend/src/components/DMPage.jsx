// frontend/src/components/DMPages

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import API from '../axiosConfig';

function DMPage() {
    const { userId } = useParams();
    const [messages, setMessages] = useState([]);
    const [inputContent, setInputContent] = useState('');
    const socketRef = useRef(null);

    //過去のDM
    useEffect(() => {
        fetchDirectMessages();
    }, [userId]);

    const fetchDirectMessages = () => {
        //送受信したDMをGET/api/dm/?などで取得し、フィルタするか
        //ここでは簡易的に全て受け取り
        API.get('dm/')
            .then((res) => {
                const filtered = res.data.filter(
                    (dm) =>
                    (dm.sender === userId && dm.recipient === getMyUserId()) ||
                    (dm.sender === getMyUserId() && dm.recipient ===userId)
                );
                //古い順に並べ直す
                const sorted = filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                setMessages(sorted);
            })
            .catch((error) => console.error(error));
    };

    //websocketの接続
    useEffect(() => {
        const wsUrl = `ws://localhost:8000/ws/dm/${userId}/`;
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log('Websocket DM connected');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.dm_id) {
                //新しいメッセージが届いた
                //fetchDirectMessafes()でも可。単発でステートに追加しても可
                fetchDirectMessages();
            }
        };

        socket.onclose = () => {
            console.log('Websocket DM disconnected');
        };

        return () => {
            socket.close();
        };
    }, [userId]);

    //自分のユーザーID取得
    const getMyUserId = () => {
        // ログイン時にUser.idをローカルストレージに保存している想定
        return Number(localStorage.getitem('user_id'));
    };

    //メッセージ送信
    const sendMessage = () => {
        if (!socketRef.current || inputContent.trim() === '')return;
        //Websocketで送信
        socketRef.current.send(JSON.stringify({message: inputContent}));
        setInputContent('');
    };

    //UI
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">DM with User {userId}</h2>
            <div className="border p-4 mb-4" style={{ height: '300px', overflowY: 'auto' }}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`mb-2 ${msg.sender === getMyUserId() ? 'text-right' : 'text-left'}`}>
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
                    onchange={(e) => setInputContent(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="bg-blue-500 text-white px-4 py-2" onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default DMPage;