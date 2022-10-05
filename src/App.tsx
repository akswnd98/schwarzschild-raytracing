import styled from '@emotion/styled';
import { useEffect, useRef } from 'react';
import multiplyMat4Mat4 from './transform/multiplyMat4Mat4';
import multiplyVec4Mat4 from './transform/multiplyVec4Mat4';
import projection from './transform/projection';
import scaling from './transform/scaling';
import translation from './transform/translation';
import xRotation from './transform/xRotation';
import yRotation from './transform/yRotation';
import zRotation from './transform/zRotation';

const Root = styled.div`
  width: 600px;
  height: 600px;
  canvas {
    width: 100%;
    height: 100%;
  }
`;

const vertexShaderSource = `#version 300 es
in vec3 position;
in vec3 inColor;
out vec3 color;

uniform mat4 matrix;

void main() {
  gl_Position = matrix * vec4(position, 1);
  color = inColor;
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 outColor;
in vec3 color;

void main() {
  outColor = vec4(color, 1.0);
}
`;

const createShader = (gl: WebGL2RenderingContext, type: GLenum, source: string) => {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  } else {
    throw Error('createShader failed');
  }
};

const createProgram = (gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  } else {
    throw Error('createProgram failed');
  }
};

const generateCubeTriangles = () => {
  const ret = [];
  const one_surface = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  const surfaces = [];
  for (let i = 0; i < 3; i++) {
    const a = [];
    for (let j = -1; j <= 1; j += 2) {
      const b = [];
      for (let k = 0; k < 4; k++) {
        b.push([
          i === 0 ? j : one_surface[k][i === 1 ? 1 : 0],
          i === 1 ? j : one_surface[k][1],
          i === 2 ? j : one_surface[k][0],
        ]);
      }
      a.push(b);
    }
    surfaces.push(a);
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        ret.push([
          surfaces[i][j][k],
          surfaces[i][j][k + 1],
          surfaces[i][j][k + 2],
        ]);
      }
    }
  }
  return ret;
};

const generateCubeColors = () => {
  const colorType = [
    [0, 1, 1],
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 0],
  ];
  const ret = [];
  for (let i = 0; i < 6; i++) {
    const sub = [];
    for (let j = 0; j < 6; j++) {
      sub.push(colorType[i]);
    }
    ret.push(sub);
  }
  return ret;
};

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const gl = canvasRef.current!.getContext('webgl2')!;

    gl.canvas.width = gl.canvas.clientWidth;
    gl.canvas.height = gl.canvas.clientHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = createProgram(gl, vertexShader, fragmentShader);

    const vao = gl.createVertexArray()!;

    gl.bindVertexArray(vao);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    const matrixLocation = gl.getUniformLocation(program, 'matrix');
    let matrix = xRotation(30 * Math.PI / 180);
    matrix = multiplyMat4Mat4(matrix, yRotation(30 * Math.PI / 180));
    matrix = multiplyMat4Mat4(matrix, translation(0, 0, -6));
    matrix = multiplyMat4Mat4(matrix, projection(0.1, 10, -0.1, 0.1, -0.1, 0.1, gl.canvas.width / gl.canvas.height));
    gl.uniformMatrix4fv(matrixLocation, false, new Float32Array(matrix.flat()));

    const positionBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positionAttributeLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    const triangles = generateCubeTriangles();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangles.flat().flat()), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    const colorAttributeLocation = gl.getAttribLocation(program, 'inColor');
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    const colors = generateCubeColors();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors.flat().flat()), gl.STATIC_DRAW);

    gl.drawArrays(gl.TRIANGLES, 0, 36);

    gl.clear(gl.DEPTH_BUFFER_BIT);

    console.log(triangles, colors);

    window.addEventListener('resize', () => {
      gl.canvas.width = gl.canvas.clientWidth;
      gl.canvas.height = gl.canvas.clientHeight;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    });
  }, []);

  return (
    <Root>
      <canvas ref={canvasRef}></canvas>
    </Root>
  );
}

export default App;
