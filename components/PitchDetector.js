import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { startPitchDetection } from 'pitchy';

export default function usePitchDetector() {
  const [pitch, setPitch] = useState(null);

  useEffect(() => {
    let recording, detector;
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') return;

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
      recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HighQuality);
      await recording.startAsync();

      const uri = await recording.getURI();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const stream = audioContext.createMediaStreamSource(await fetch(uri).then(r => r.blob()).then(blob => blob.arrayBuffer()).then(ab => audioContext.decodeAudioData(ab)));
      detector = await startPitchDetection(audioContext, stream);

      const loop = () => {
        const [detectedPitch] = detector.findPitch();
        if (detectedPitch) setPitch(detectedPitch);
        requestAnimationFrame(loop);
      };
      loop();
    })();

    return () => {
      if (recording) recording.stopAndUnloadAsync();
    };
  }, []);

  return pitch;
}
