"use client";

export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.35} color="#7bb7ff" />
      <directionalLight position={[6, 8, 5]} intensity={2.2} color="#c8e6ff" />
      <directionalLight position={[-5, -2, -6]} intensity={0.9} color="#5ea8ff" />
      <spotLight
        position={[0, -6, 6]}
        angle={0.45}
        penumbra={0.8}
        intensity={25}
        distance={30}
        color="#62c6ff"
      />
      <pointLight position={[0, -3.6, 1.2]} intensity={18} distance={10} color="#4fd4ff" />
    </>
  );
}
