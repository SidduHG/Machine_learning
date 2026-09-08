'use client';
import { useMemo, useEffect, Component, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import { BufferGeometry, Float32BufferAttribute } from 'three';
import { mse, type Point, type Vec3, type Parameters } from '@/lib/algorithms';
import { colors } from './plot';
type Props = {
  kind: 'surface' | 'clusters';
  data?: Point[];
  parameters?: Parameters;
  path?: Parameters[];
  points?: Vec3[];
  centers?: Vec3[];
  assignments?: number[];
  fallback: ReactNode;
};
class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
function Surface({
  data,
  parameters,
  path,
}: {
  data: Point[];
  parameters: Parameters;
  path: Parameters[];
}) {
  const geometry = useMemo(() => {
    const vertices: number[] = [];
    const count = 32;
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        const w = -2 + (i * 4) / count,
          b = -2 + (j * 4) / count,
          step = 4 / count;
        for (const [x, z] of [
          [w, b],
          [w + step, b],
          [w, b + step],
          [w + step, b],
          [w + step, b + step],
          [w, b + step],
        ])
          vertices.push(x, mse(data, x, z) / 5, z);
      }
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    g.computeVertexNormals();
    return g;
  }, [data]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const marker: Vec3 = [
    parameters.w,
    mse(data, parameters.w, parameters.b) / 5,
    parameters.b,
  ];
  const trail = path
    .filter((p) => Math.abs(p.w) <= 2.5 && Math.abs(p.b) <= 2.5)
    .map((p) => [p.w, mse(data, p.w, p.b) / 5 + 0.02, p.b] as Vec3);
  return (
    <>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color="#609bf5"
          wireframe
          transparent
          opacity={0.48}
        />
      </mesh>
      {trail.length > 1 && (
        <Line points={trail} color="#ffa56c" lineWidth={3} />
      )}
      <mesh position={marker}>
        <sphereGeometry args={[0.085, 20, 20]} />
        <meshStandardMaterial
          color="#ffbd8c"
          emissive="#dc7343"
          emissiveIntensity={0.5}
        />
      </mesh>
      <Html position={[2.4, 0, 0]}>
        <span className="scene-label">slope w</span>
      </Html>
      <Html position={[0, 0, 2.4]}>
        <span className="scene-label">intercept b</span>
      </Html>
      <Html position={[-2, 3, -2]}>
        <span className="scene-label">MSE / 5</span>
      </Html>
    </>
  );
}
export default function Scene(p: Props) {
  return (
    <SceneBoundary fallback={p.fallback}>
      <div
        className="three-scene"
        role="img"
        aria-label={
          p.kind === 'surface'
            ? 'Rotatable regression loss surface. Current model and numeric loss are shown in controls.'
            : 'Rotatable three-dimensional clustering plot. Cluster counts and inertia are shown in controls.'
        }
      >
        <Canvas
          dpr={[1, 1.5]}
          frameloop="demand"
          camera={{ position: [7, 5, 7], fov: 42 }}
          fallback={p.fallback}
        >
          <color attach="background" args={['#12243f']} />
          <ambientLight intensity={1.8} />
          <directionalLight position={[4, 8, 3]} intensity={2} />
          <gridHelper args={[8, 16, '#385473', '#213c5c']} />
          {p.kind === 'surface' && p.data && p.parameters ? (
            <Surface
              data={p.data}
              parameters={p.parameters}
              path={p.path ?? []}
            />
          ) : (
            <>
              {p.points?.map((v, i) => (
                <mesh key={i} position={v}>
                  <sphereGeometry args={[0.07, 10, 10]} />
                  <meshStandardMaterial
                    color={colors[(p.assignments?.[i] ?? 0) % colors.length]}
                  />
                </mesh>
              ))}
              {p.centers?.map((v, i) => (
                <mesh key={i} position={v}>
                  <octahedronGeometry args={[0.2, 0]} />
                  <meshStandardMaterial
                    color={colors[i % colors.length]}
                    emissive={colors[i % colors.length]}
                    emissiveIntensity={0.4}
                  />
                </mesh>
              ))}
              <Html position={[4, 0, 0]}>
                <span className="scene-label">x₁</span>
              </Html>
              <Html position={[0, 4, 0]}>
                <span className="scene-label">x₂</span>
              </Html>
              <Html position={[0, 0, 4]}>
                <span className="scene-label">x₃</span>
              </Html>
            </>
          )}
          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={4}
            maxDistance={18}
            target={[0, 0.7, 0]}
          />
        </Canvas>
        <span className="scene-hint">
          Drag to orbit · Scroll to zoom · Numeric results below
        </span>
      </div>
    </SceneBoundary>
  );
}
