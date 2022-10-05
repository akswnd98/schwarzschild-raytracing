const   projection = (n: number, f: number, l: number, r: number, b: number, t: number, a: number) => {
  return [
    [2 * n / (r - l) / a, 0, 0, 0],
    [0, 2 * n / (t - b), 0, 0],
    [(r + l) / (r - l), (t + b) / (t - b), (n + f) / (n - f), -1],
    [0, 0, 2 * n * f / (n - f), 0],
 ];
};

export default projection;
