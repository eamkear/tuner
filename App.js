import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import TunerScreen from './components/TunerScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <TunerScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
});
