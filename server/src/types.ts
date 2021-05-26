interface Chat {
  message: string;
  from: string;
}

export interface Message {
  chat: Chat;
  to: string;
}

export interface IsTyping {
  status: boolean;
  from: string;
}

export interface User {
  username: string;
  id: string;
}
