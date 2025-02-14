import { useState, useEffect } from "react";
import { useBox, useHingeConstraint } from "@react-three/cannon";
import * as THREE from "three";

export default function Ark(
  {
    setGameOver, 
    isAnimalRemoved
  }: {
    setGameOver: (value: boolean) => void; 
    isAnimalRemoved: boolean;
  }
) {
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

  const [ref, api] = useBox<THREE.Mesh>(() => ({
    mass: 0.1, // ✅ 提高質量，讓方舟更穩定
    position: [0, 0.4, 0],
    args: [4, 0.5, 2], // 方舟大小
    linearDamping: 0.9,    // 嘗試調高阻尼值
    angularDamping: 0.9,
    centerOfMass: [0, 100, 0], // ✅ 讓重心更低
    material: "arkMaterial", // ✅ 設定方舟的摩擦材質
  }));

  useEffect(() => {
    api.angularVelocity.subscribe((v) => {
      if (Math.abs(v[0]) > 2) api.angularVelocity.set(2 * Math.sign(v[0]), v[1], v[2]);
      if (Math.abs(v[2]) > 2) api.angularVelocity.set(v[0], v[1], 2 * Math.sign(v[2]));
    });
  }, []);

  const [supportRef] = useBox<THREE.Mesh>(() => ({
    type: "Static",
    position: [0, 0.4, 0], // ✅ 提高支架，讓方舟更穩定
    args: [0.25, 0.5, 0.125], // ✅ 增加支架的大小
  }))

  useEffect(() => {
    // ✅ 確保方舟在初始化時角度為 0
    api.rotation.set(0, 0, 0);
  }, []);

  // 讓方舟與支架形成晃動的連結
  useHingeConstraint(ref, supportRef, {
    pivotA: [0, -0.2, 0],
    pivotB: [0, 0.2, 0],
    axisA: [1, 0, 0], // 讓它可以左右搖晃
    axisB: [1, 0, 0],
  });

  useHingeConstraint(ref, supportRef, {
    pivotA: [0, -0.2, 0],
    pivotB: [0, 0.2, 0],
    axisA: [0, 0, 1], // 讓它可以左右搖晃
    axisB: [0, 0, 1],
  });

  // 監測方舟的旋轉角度，判定遊戲是否結束
  // 使用 API 來監聽 quaternion 變化
  useEffect(() => {
    const unsubscribe = api.quaternion.subscribe((q) => {
      const euler = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(q[0], q[1], q[2], q[3]), "XYZ");
      const xRotation = THREE.MathUtils.radToDeg(euler.x);
      const zRotation = THREE.MathUtils.radToDeg(euler.z);

      setRotation([xRotation, zRotation, 0]);

      // 如果傾斜超過 30°，遊戲結束
      if (Math.abs(xRotation) > 20 || Math.abs(zRotation) > 20) {
        setGameOver(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // 當動物被移除時，給方舟一個「回正的力」
  useEffect(() => {
    if (isAnimalRemoved) {
      api.applyTorque([rotation[0] * -0.2, 0, rotation[1] * -0.2]); // 給予回正的扭力
    }
  }, [isAnimalRemoved]);

  return (
    <>
      <mesh ref={ref} castShadow receiveShadow>
        <boxGeometry args={[4, 0.5, 2]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh ref={supportRef} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.6, 0.125]} />
        <meshStandardMaterial color="gray" />
      </mesh>
    </>
  );
}