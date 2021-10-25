import React, { useState } from 'react';
import { Alert, Keyboard, TextInput, View } from 'react-native';
import { api } from '../../services/api';
import { COLORS } from '../../theme';
import { Button } from '../Button';

import { styles } from './styles';

export function SendMessageForm() {
  const [message, setMessage] = useState('');
  const [sendMessage, setSendMessage] = useState(false);

  async function handleMessageSubmit() {
    const messageFormatted = message.trim();

    if (messageFormatted.length > 0) {
      setSendMessage(true);

      await api.post('/messages', { message: messageFormatted });

      setMessage('');
      Keyboard.dismiss();
      setSendMessage(false);
      Alert.alert('Menssagem enviada com sucesso!');
    } else {
      Alert.alert('Escreva uma mensagem para enviar.');
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Qual sua expectativa para o evento"
        placeholderTextColor={COLORS.GRAY_PRIMARY}
        keyboardAppearance="dark"
        multiline
        maxLength={140}
        onChangeText={setMessage}
        value={message}
        style={styles.input}
        editable={!sendMessage}
      />

      <Button
        title="ENVIAR MENSSAGEM"
        color={COLORS.WHITE}
        backgroundColor={COLORS.PINK}
        isLoading={sendMessage}
        onPress={handleMessageSubmit}
      />
    </View>
  );
}
