import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/SocketProvider';
import { User, UserListContext } from '../context/UserListProvider';
import { UserContext } from '../context/UserProvider';

interface NewUser {
  status: boolean;
  username: string;
}

const OnlineUsers = () => {
  //need to query users
  const socket = useContext(SocketContext);
  const [users, setUsersList] = useContext(UserListContext);
  const [user, _] = useContext(UserContext);
  const [newUser, setNewUser] = useState({ status: false, username: '' });

  useEffect(() => {
    socket.on(
      'user update',
      ({ users, newUser }: { users: User[]; newUser: NewUser }) => {
        users.forEach((user) => {
          user.self = user.userID === socket.id;
        });
        const sortedUsers = users.sort((a, b) => {
          const aUsername = a.username.toUpperCase();
          const bUsername = b.username.toUpperCase();
          if (a.self) {
            return -1;
          }
          if (b.self) {
            return 1;
          }
          if (aUsername < bUsername) {
            return -1;
          }
          if (aUsername > b.username) {
            return 1;
          }
          return 0;
        });
        setUsersList(sortedUsers);
        setNewUser({ ...newUser, status: true });
        setTimeout(() => {
          setNewUser({ status: false, username: '' });
        }, 5000);
      }
    );
    return () => {
      socket.off('user update');
    };
  }, [users]);

  return (
    <>
      <div>
        online users:
        {users
          ? users.map((user: User) => (
              <div
                key={user.userID}
                onClick={() => {
                  socket.emit('change room', user.userID);
                }}
              >
                {user.username}
              </div>
            ))
          : null}
      </div>
      {newUser.status ? (
        <div>{newUser.username} has joined the chat</div>
      ) : null}
    </>
  );
};

export default OnlineUsers;
