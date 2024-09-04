'use client'

import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

interface GradientBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

const GradientShader = () => {
  const { viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  useFrame(({ clock }) => {
    const material = meshRef.current?.material as THREE.ShaderMaterial;
    if (material.uniforms?.uTime) {
      material.uniforms.uTime.value = clock.getElapsedTime();
    }
    if (material.uniforms?.uIsDarkMode) {
      material.uniforms.uIsDarkMode.value = isDarkMode;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform bool uIsDarkMode;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      vec3 color1 = uIsDarkMode ? vec3(0.1, 0.1, 0.2) : vec3(1.0, 0.75, 0.8); // Dark blue : Light pink
      vec3 color2 = uIsDarkMode ? vec3(0.2, 0.1, 0.3) : vec3(0.8, 0.6, 1.0); // Dark purple : Light purple
      vec3 color3 = uIsDarkMode ? vec3(0.15, 0.15, 0.25) : vec3(1.0, 0.9, 0.7); // Dark blue-purple : Light yellow
      
      float noise1 = sin(uv.x * 10.0 + uTime * 0.5) * sin(uv.y * 10.0 + uTime * 0.3);
      float noise2 = sin(uv.x * 15.0 - uTime * 0.4) * sin(uv.y * 15.0 - uTime * 0.6);
      
      vec3 color = mix(mix(color1, color2, noise1 * 0.5 + 0.5), color3, noise2 * 0.5 + 0.5);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        key={isDarkMode ? 'dark' : 'light'}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uIsDarkMode: { value: isDarkMode },
        }}
      />
    </mesh>
  );
};

const GradientBackground: React.FC<GradientBackgroundProps> = ({ className, children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Canvas style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
        <GradientShader />
      </Canvas>
      {children}
    </div>
  );
};

export default GradientBackground;
