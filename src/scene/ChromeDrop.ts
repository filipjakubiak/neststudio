import * as THREE from 'three';
import { simplex3 } from './noise.glsl';

/* Kropla płynnego chromu: icosfera z przemieszczeniem szumem w shaderze wierzchołków, materiał metaliczny. */
export class ChromeDrop {
  mesh: THREE.Mesh;
  material: THREE.MeshPhysicalMaterial;
  private uniforms = { uTime: { value: 0 }, uAmp: { value: 0.12 }, uFreq: { value: 0.85 } };

  constructor() {
    const geo = new THREE.IcosahedronGeometry(1, 6);
    this.material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 1,
      roughness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.35,
      transparent: true,
      opacity: 1,
    });
    const u = this.uniforms;
    this.material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = u.uTime;
      shader.uniforms.uAmp = u.uAmp;
      shader.uniforms.uFreq = u.uFreq;
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\nuniform float uTime, uAmp, uFreq;\n${simplex3}\n
vec3 nestDisplace(vec3 p) {
  vec3 n = normalize(p);
  float d = snoise(p * uFreq + vec3(uTime * 0.26, uTime * 0.17, 0.0));
  d += 0.28 * snoise(p * uFreq * 2.1 + vec3(0.0, uTime * 0.31, uTime * 0.22));
  return p + n * d * uAmp;
}`)
        .replace('#include <beginnormal_vertex>', `
vec3 objectNormal = normalize(normal);
{
  vec3 p = position;
  vec3 t1 = normalize(cross(objectNormal, vec3(0.0, 1.0, 0.0) + vec3(0.001, 0.0, 0.0)));
  vec3 t2 = normalize(cross(objectNormal, t1));
  float e = 0.045;
  vec3 pa = nestDisplace(p);
  vec3 pb = nestDisplace(p + t1 * e);
  vec3 pc = nestDisplace(p + t2 * e);
  objectNormal = normalize(cross(pb - pa, pc - pa));
}
#ifdef USE_TANGENT
vec3 objectTangent = vec3( tangent.xyz );
#endif`)
        .replace('#include <begin_vertex>', 'vec3 transformed = nestDisplace(position);');
    };
    this.mesh = new THREE.Mesh(geo, this.material);
    this.mesh.renderOrder = 2;
  }

  update(time: number, amp: number) {
    this.uniforms.uTime.value = time;
    this.uniforms.uAmp.value = amp;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
