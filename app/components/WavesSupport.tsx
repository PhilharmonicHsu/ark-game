import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

// ✅ 定義 ShaderMaterial
const WavesMaterial = shaderMaterial(
    { 
        time: 0,
        color: new THREE.Color("#80c8ff"),
        lightPosition: new THREE.Vector3(5, 10, 5), // ✅ 光源位置
        viewPosition: new THREE.Vector3(), // ✅ 觀察視角
    }, // ✅ 加入 time
    `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float time;
    
    void main() {
        vUv = uv;
        vNormal = normal;
        vPosition = position;

        // ✅ 加強波浪的變化
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

        // ✅ 高光反射
        vec3 halfwayDir = normalize(lightDir + viewDir);
        float specular = pow(max(dot(normal, halfwayDir), 0.0), 50.0);

        // ✅ Fresnel 效果 (邊緣更亮)
        float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);

        // ✅ **讓水顏色與背景匹配**
        float heightFactor = smoothstep(-0.5, 1.5, vPosition.y); // 根據高度調整顏色
        vec3 deepBlue = vec3(0.0, 0.3, 0.8);  // 深藍色 (低處)
        vec3 skyBlue = vec3(0.5, 0.8, 1.0);  // 淡藍色 (高處)
        vec3 waterColor = mix(deepBlue, skyBlue, heightFactor); // ✅ 由深藍到淺藍

        // ✅ **讓透明度更自然變化**
        float waveHeight = sin(vPosition.x * 2.0 + vPosition.z * 2.0 + time * 2.0);
        float dynamicAlpha = 0.4 + 0.3 * waveHeight; // 透明度根據波浪變化
        
        // ✅ **時間影響透明度**
        float timeAlpha = 0.2 + 0.3 * sin(time * 2.0); // 時間影響透明度

        // ✅ **最終透明度**
        float finalAlpha = clamp(dynamicAlpha + timeAlpha, 0.3, 0.85);

        // ✅ **最終顏色 (水的顏色 + 反射光澤 + Fresnel)**
        vec3 finalColor = waterColor + vec3(0.8) * specular + vec3(0.5) * fresnel;

        gl_FragColor = vec4(finalColor, finalAlpha); // ✅ 讓水具有變化透明度
    }
    `
);

// ✅ 註冊 ShaderMaterial
extend({ WavesMaterial });

export default function WavesSupport() {
    const ref = useRef<THREE.Mesh | null>(null);
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);

    // ✅ 確保 `materialRef.current.uniforms` 存在
    useFrame(({ clock, camera }) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = clock.getElapsedTime();
            materialRef.current.uniforms.viewPosition.value = camera.position;
        }
    });

    return (
        <mesh ref={ref} position={[0, -0.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[5, 5, 0.5, 64, 64]} /> {/* ✅ 更細緻 */}
            {/* ✅ 確保 material 變數存在 */}
            <primitive ref={materialRef} attach="material" object={new WavesMaterial()} />
        </mesh>
    );
}
