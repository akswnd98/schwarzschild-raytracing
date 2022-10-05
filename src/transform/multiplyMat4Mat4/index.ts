const multiplyMat4Mat4 = (m1: number[][], m2: number[][]) => {
  const ret = Array(4).fill(0).map(() => Array(4).fill(0));
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        ret[i][k] += m1[i][j] * m2[j][k];
      }
    }
  }
  return ret;
};

export default multiplyMat4Mat4;
