import { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Center,
  Bounds,
} from "@react-three/drei";

const Model = () => {
  const { scene } = useGLTF("/models/lax-device.glb");

  const model = useMemo(() => scene.clone(true), [scene]);

  return (
    <Bounds fit clip observe margin={1.3}>
      <Center>
        <primitive object={model} scale={2.2} />
      </Center>
    </Bounds>
  );
};

const DeviceModel = () => {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <Canvas
      camera={{
        position: [0, 0, 4],
        fov: 35,
      }}
      dpr={[1, 2]}
      gl={{
        alpha: true,
        antialias: true,
      }}
    >
      <ambientLight intensity={1.5} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={2}
      />

      <pointLight
        position={[-4, 2, 3]}
        color="#a855f7"
        intensity={25}
      />

      <pointLight
        position={[4, -2, -3]}
        color="#2563eb"
        intensity={15}
      />

      <Suspense fallback={null}>
        <Model />
      </Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        enableRotate
        minDistance={2}
        maxDistance={8}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        autoRotate={autoRotate}
        autoRotateSpeed={1.2}
        rotateSpeed={0.8}
        onStart={() => setAutoRotate(false)}
        onEnd={() => setAutoRotate(true)}
      />
    </Canvas>
  );
};

useGLTF.preload("/models/lax-device.glb");

export default DeviceModel;