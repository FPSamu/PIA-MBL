import React, { useState } from 'react';
import { View } from 'react-native';
import EmailField from '../components/EmailField';
import PasswordField from '../components/PasswordField';

interface UserAuthFieldsProps {
  onChange?: (email: string, password: string) => void;
}

const UserAuthFields: React.FC<UserAuthFieldsProps> = ({ onChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (onChange) onChange(text, password);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (onChange) onChange(email, text);
  };

  return (
    <View>
      <EmailField value={email} onChange={handleEmailChange} />
      <PasswordField value={password} onChange={handlePasswordChange} />
    </View>
  );
};

export default UserAuthFields;
