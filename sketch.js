const glsl = require('glslify')
const regl = require('regl')()
const createSphere = require('primitive-sphere')

const TAU = 6.283185307179586

const camera = require('regl-camera')(regl, {
  center: [0, 0, 0],
  distance: 3,
})

const sphere = createSphere(1, {
  segments: 100
});

const draw = regl({
  vert: glsl`
  precision mediump float;
  uniform float time;
  uniform mat4 projection, view;
  attribute vec3 position, normal;
  attribute vec2 uv;
  varying vec2 vUv, nNormal;
  varying vec3 vNormal;

  void main() {
    vNormal = normal;
    vUv = uv;
    gl_Position = projection * view * vec4(position, 1.0);
  }
  `,

  frag: `
  precision mediump float;
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vec3 colA = vec3(1.0, 0.38, 0.22);
    vec3 colB = vec3(0.0, 0.64, 0.53);
    gl_FragColor = vec4(mix(colA, colB, vec3(vUv * 1.8, 1.0)), 1.0);
  }

  `,

  attributes: {
    position: sphere.positions,
    normal: sphere.normals,
    uv: sphere.uvs
  },

  elements: sphere.cells,

  uniforms: {
    time: ({time}) => time,
  },
})


regl.frame(() => {
  camera(() => {
    regl.clear({ color: [1, 1, 1, 1] })
    draw()
  })
});
