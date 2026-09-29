import { useLayoutEffect, useMemo } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { AbsoluteFill, continueRender, delayRender, useCurrentFrame, useVideoConfig } from 'remotion';
import { Euler, Matrix3, Matrix4, NoBlending, ShaderMaterial, Vector2, Vector4 } from 'three';
import { fragmentShader, vertexShader } from './chromeShader';
import { paramsAt } from './journey';

function ChromeObject({ width, height, frame, handle }: { width: number; height: number; frame: number; handle: number }) {
  const { gl, scene, camera } = useThree();
  const { durationInFrames, fps } = useVideoConfig();

  /* The material is owned here (not declared as JSX props): R3F copies a `uniforms` prop on
     creation, so later mutations would never reach the GPU and every frame would repeat frame one. */
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: NoBlending,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uRes: { value: new Vector2(width, height) },
          uTime: { value: 0 },
          uW: { value: new Vector4(1, 0, 0, 0) },
          uRadius: { value: 0.4 },
          uTear: { value: 0 },
          uSep: { value: 0 },
          uNeck: { value: 0.3 },
          uTwist: { value: 0 },
          uAmp: { value: 0 },
          uFreq: { value: 2 },
          uEnv: { value: 0 },
          uSquash: { value: 0 },
          uPhase: { value: 0 },
          uRot: { value: new Matrix3() },
        },
      }),
    [width, height],
  );

  // Every value is a pure function of the frame: renders are deterministic and parallel-safe.
  const t = durationInFrames > 1 ? frame / (durationInFrames - 1) : 0;
  const p = paramsAt(t);
  const u = material.uniforms;
  u.uTime.value = frame / fps;
  (u.uW.value as Vector4).set(p.drop, p.pair, p.lens, p.thread);
  u.uRadius.value = p.radius;
  u.uTear.value = p.tear;
  u.uSep.value = p.sep;
  u.uNeck.value = p.neck;
  u.uTwist.value = p.twist;
  u.uAmp.value = p.amp;
  u.uFreq.value = p.freq;
  u.uEnv.value = p.env;
  u.uSquash.value = p.squash;
  u.uPhase.value = p.phase;
  (u.uRot.value as Matrix3).setFromMatrix4(new Matrix4().makeRotationFromEuler(new Euler(p.rx, p.ry, p.rz)).invert());

  /* R3F reconciles the canvas children asynchronously, so the outer tree holds a delayRender handle
     for this frame and releases it only after this frame has been drawn. */
  useLayoutEffect(() => {
    gl.render(scene, camera);
    gl.getContext().finish();
    continueRender(handle);
  }, [gl, scene, camera, handle]);

  return (
    <mesh frustumCulled={false} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

export function ChromeJourney() {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const handle = useMemo(() => delayRender('chrome frame ' + frame), [frame]);
  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <ThreeCanvas
        width={width}
        height={height}
        dpr={1}
        linear
        flat
        gl={{ alpha: true, antialias: false, premultipliedAlpha: true, preserveDrawingBuffer: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ChromeObject width={width} height={height} frame={frame} handle={handle} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
}
