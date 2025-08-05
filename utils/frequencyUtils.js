export function isInTune(pitch, targetFreq, tolerance = 1.0) {
  if (!pitch) return false;
  return Math.abs(pitch - targetFreq) <= tolerance;
}
