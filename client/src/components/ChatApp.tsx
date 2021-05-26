import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/SocketProvider';
import { UserContext } from '../context/UserProvider';

interface Chat {
  message: string;
  from: string;
}
interface Message {
  chat: Chat;
  to: string;
}

interface IsTyping {
  status: boolean;
  from: string;
}

interface User {
  userID: string;
  username: string;
  self?: boolean;
}

interface Notification {
  status: boolean;
  msg: string;
}

const rooms = ['room1', 'room2', 'room3'];

function ChatApp() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([] as Chat[]);
  const [typing, setTyping] = useState({ status: false, from: '' } as IsTyping);
  const [activeRoom, setActiveRoom] = useState('room1');
  const [user, setUser] = useContext(UserContext);
  const [notification, setNotif] = useState({
    status: false,
    msg: '',
  } as Notification);

  const socket = useContext(SocketContext);

  const changeRoom = (room: string) => {
    if (room === activeRoom) {
      return;
    }
    socket.emit('change room', room);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (e: any) => {
    e.preventDefault();
    e.target.blur();
    const msg: Message = {
      chat: { message, from: user.username },
      to: activeRoom,
    };
    return socket.emit('newMsg', msg);
  };

  useEffect(() => {
    socket.emit('retrieve chat', { to: activeRoom });
    socket.on('retrieve chat', (chat: Chat[]) => {
      setChat(chat);
    });
    return () => {
      socket.off('retrieve chat');
    };
  }, [activeRoom]);

  useEffect(() => {
    socket.on('newMsg', (msg: Chat[]) => {
      console.log(msg);
      setChat(msg);
    });
    socket.on('typing', (msg: IsTyping) => {
      return setTyping(msg);
    });

    socket.on('roomJoin', (msg: { username: string; room: string }) => {
      setActiveRoom(msg.room);
      setNotif({ status: true, msg: `${msg.username} has joined the room` });
      setTimeout(() => {
        setNotif({
          status: false,
          msg: '',
        });
      }, 5000);
    });

    return () => {
      setMessage('');
      socket.off('newMsg');
      socket.off('typing');
      socket.off('roomJoin');
    };
  }, [chat]);

  return (
    <div>
      {user.username}: {activeRoom}
      <div>
        <div>
          <nav>
            {rooms.map((room) => (
              <button
                key={room}
                onClick={() => {
                  changeRoom(room);
                }}
              >
                {room}
              </button>
            ))}
          </nav>{' '}
        </div>
        <ul>
          {chat
            ? chat.map((msg) => (
                <li key={msg.message}>
                  {msg.from}:{msg.message}
                </li>
              ))
            : null}
        </ul>
      </div>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <input
          type='text'
          value={message}
          onFocus={(e) => {
            return socket.emit('typing', { status: true, from: user.name });
          }}
          onBlur={() => {
            return socket.emit('typing', { status: false, from: user.name });
          }}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        ></input>
        <div>{user.username} has joined room</div>
        <br />
        <button type='submit'>submit</button>
      </form>
      <div>{typing.status ? <div>{typing.from} is typing</div> : null}</div>
    </div>
  );
}

export default ChatApp;
