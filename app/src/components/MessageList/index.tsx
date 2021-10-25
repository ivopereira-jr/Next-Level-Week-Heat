import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { api } from '../../services/api';
import { io } from 'socket.io-client';

import { Message, MessageProps } from '../Message';

import { styles } from './styles';

let messagedQueue: MessageProps[] = [];

const socket = io(String(api.defaults.baseURL));
socket.on('new_message', newMessage => {
  messagedQueue.push(newMessage);
});

export function MessageList() {
  const [currentMessages, setCurrentMesages] = useState<MessageProps[]>([]);

  useEffect(() => {
    async function fetchMessages() {
      const messagesResponse = await api.get<MessageProps[]>('/messages/last3');

      setCurrentMesages(messagesResponse.data);
    }

    fetchMessages();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagedQueue.length > 0) {
        setCurrentMesages(prevState => [
          messagedQueue[0],
          prevState[0],
          prevState[1]
        ]);
        messagedQueue.shift();
      }
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    >
      {currentMessages.map(message => (
        <Message key={message.id} data={message} />
      ))}
    </ScrollView>
  );
}
