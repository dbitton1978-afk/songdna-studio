export const calculateSimilarity = (a, b) => {
  let score = 0;

  // BPM
  const bpmDiff = Math.abs(a.bpm - b.bpm);
  if (bpmDiff < 3) score += 0.2;
  else if (bpmDiff < 6) score += 0.1;

  // Harmony
  if (a.harmony === b.harmony) score += 0.1;

  // Structure
  if (JSON.stringify(a.structure) === JSON.stringify(b.structure)) {
    score += 0.25;
  }

  // Style
  if (a.style_tags[0] === b.style_tags[0]) {
    score += 0.15;
  }

  // Energy curve
  score += compareArrays(a.energy_curve, b.energy_curve) * 0.3;

  return Math.min(1, score);
};

const compareArrays = (arr1, arr2) => {
  let match = 0;

  for (let i = 0; i < arr1.length; i++) {
    if (Math.abs(arr1[i] - arr2[i]) < 0.1) {
      match++;
    }
  }

  return match / arr1.length;
};
