import React from 'react';
import { View, StyleSheet } from 'react-native';
import Title from '../components/Title';
import Subtitle from '../components/Subtitle';

interface HeaderProps {
  title: string;
  subtitle: string;
}

function Header({ title, subtitle }: HeaderProps) {
  return (
    <View>
      <Title children={title} />
      <Subtitle children={subtitle} />
    </View>
  );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: 30,
      },
})

export default Header;

