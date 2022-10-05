const zRotation = (angleInRadians: number) => {
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);

  return [
    [c, s, 0, 0],
    [-s, c, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
};

export default zRotation;
