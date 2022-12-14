const xRotation = (angleInRadians: number) => {
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);

  return [
    [1, 0, 0, 0],
    [0, c, s, 0],
    [0, -s, c, 0],
    [0, 0, 0, 1],
  ];
};

export default xRotation;
