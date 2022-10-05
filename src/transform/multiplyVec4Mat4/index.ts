const multiplyVec4Mat4 = (vec: number[], mat: number[][]) => {
  const ret = Array(4).fill(0);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      ret[i] += vec[j] * mat[j][i];
    }
  }
  return ret;
};

export default multiplyVec4Mat4;
