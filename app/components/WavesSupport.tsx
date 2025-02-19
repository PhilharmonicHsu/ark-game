import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

// define ShaderMaterial
const WavesMaterial = shaderMaterial(
    { 
        time: 0,
        color: new THREE.Color("#80c8ff"),
        lightPosition: new THREE.Vector3(5, 10, 5), // light source position
        viewPosition: new THREE.Vector3(), // Observation perspective
    },
    `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float time;
    
    void main() {
        vUv = uv;
        vNormal = normal;
        vPosition = position;

        // Enhance wave changes
        float wave1 = sin(position.x * 2.0 + time * 2.0) * 0.2;
        float wave2 = cos(position.z * 3.0 + time * 1.5) * 0.15;
        float wave3 = sin(position.x * 1.5 + position.z * 2.0 + time * 2.5) * 0.1;

        vec3 pos = position;
        pos.y += wave1 + wave2 + wave3;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
    `,
    `
    uniform vec3 color;
    uniform vec3 lightPosition;
    uniform vec3 viewPosition;
    uniform float time;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(lightPosition - vPosition);
        vec3 viewDir = normalize(viewPosition - vPosition);

        // High light reflection
        vec3 halfwayDir = normalize(lightDir + viewDir);
        float specular = pow(max(dot(normal, halfwayDir), 0.0), 50.0);

        // Fresnel effect (brighter edges)
        float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);

        // Make the water color match the background
        float heightFactor = smoothstep(-0.5, 1.5, vPosition.y); // Adjust color based on height
        vec3 deepBlue = vec3(0.0, 0.3, 0.8);
        vec3 skyBlue = vec3(0.5, 0.8, 1.0);
        vec3 waterColor = mix(deepBlue, skyBlue, heightFactor);

        // Make transparency change more naturally
        float waveHeight = sin(vPosition.x * 2.0 + vPosition.z * 2.0 + time * 2.0);
        float dynamicAlpha = 0.4 + 0.3 * waveHeight;
        
        // Let time affect transparency
        float timeAlpha = 0.2 + 0.3 * sin(time * 2.0);

        // final transparency
        float finalAlpha = clamp(dynamicAlpha + timeAlpha, 0.3, 0.85);

        // Final Color (Water Color + Reflected Gloss + Fresnel)
        vec3 finalColor = waterColor + vec3(0.8) * specular + vec3(0.5) * fresnel;

        gl_FragColor = vec4(finalColor, finalAlpha); // Give water varying transparency
    }
    `
);

// register ShaderMaterial
extend({ WavesMaterial });

export default function WavesSupport() {
    const ref = useRef<THREE.Mesh | null>(null);
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);

    useFrame(({ clock, camera }) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = clock.getElapsedTime();
            materialRef.current.uniforms.viewPosition.value = camera.position;
        }
    });

    return (
        <mesh ref={ref} position={[0, -0.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[5, 5, 0.5, 64, 64]} />
            <primitive ref={materialRef} attach="material" object={new WavesMaterial()} />
        </mesh>
    );
}
