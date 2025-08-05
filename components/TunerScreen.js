import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import usePitchDetector from './PitchDetector';
import { G_TUNING } from '../constants/tuning';
import { isInTune } from '../utils/frequencyUtils';

export default function TunerScreen() {
  const pitch = usePitchDetector();
  const [selected, setSelected] = useState(null);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  const playTone = async (note) => {
    if (sound) await sound.unloadAsync();
    const { sound: newS } = await Audio.Sound.createAsync(getToneFile(note));
    setSound(newS);
    await newS.playAsync();
  };

  const getToneFile = (note) => ({
    D2: require('../assets/tones/d2.mp3'),
    G2: require('../assets/tones/g2.mp3'),
    D3: require('../assets/tones/d3.mp3'),
    G3: require('../assets/tones/g3.mp3'),
    B3: require('../assets/tones/b3.mp3'),
    D4: require('../assets/tones/d4.mp3'),
  })[note];

  return (
    <View style={styles.container}>
      <Image source={require('../assets/headstock.png')} style={styles.headstock} />
      {G_TUNING.map(({ stringNum, note, freq }) => {
        const sel = selected === stringNum;
        const tick = sel && isInTune(pitch, freq);
        return (
          <TouchableOpacity
            key={stringNum}
            onPress={() => {
              setSelected(stringNum);
              playTone(note);
            }}
            style={[styles.row, sel && styles.selected]}
          >
            <Text style={styles.label}>String {stringNum} ({note})</Text>
            {tick && <Text style={styles.tuned}>✅</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', alignItems: 'center', paddingTop: 40 },
  headstock: { width: 300, height: 120, resizeMode: 'contain', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 10, marginVertical: 5 },
  selected: { backgroundColor: '#333', borderRadius: 8 },
  label: { color: '#fff', fontSize: 18, marginRight: 10 },
  tuned: { fontSize: 22, color: 'lime' },
});
