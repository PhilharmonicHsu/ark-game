import { useEffect } from "react";
import { useBox, useHingeConstraint } from "@react-three/cannon";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import WavesSupport from "@components/WavesSupport";

export default function Ark() {
  const woodTexture = useLoader(TextureLoader, "/textures/wood.jpg");

  const [ref, api] = useBox<THREE.Mesh>(() => ({
    mass: 0.1,
    position: [0, 0.4, 0],
    args: [4, 0.5, 2], // size of ark 
    linearDamping: 0.9,
    angularDamping: 0.9,
    centerOfMass: [0, 100, 0], // make the center of gravity lower
    material: "arkMaterial", // setting ark friction material
  }));

  useEffect(() => {
    api.angularVelocity.subscribe((v) => {
      if (Math.abs(v[0]) > 2) api.angularVelocity.set(2 * Math.sign(v[0]), v[1], v[2]);
      if (Math.abs(v[2]) > 2) api.angularVelocity.set(v[0], v[1], 2 * Math.sign(v[2]));
    });
  }, [api.angularVelocity]);

  const [supportRef] = useBox<THREE.Mesh>(() => ({
    type: "Static",
    position: [0, -0.4, 0], // support position
    args: [0.25, 0.5, 0.125], // size of support 
  }))

  useEffect(() => {
    api.rotation.set(0, 0, 0);
  }, [api.rotation]);

  useHingeConstraint(ref, supportRef, {
    pivotA: [0, -0.2, 0],
    pivotB: [0, 0.2, 0],
    axisA: [1, 0, 0],
    axisB: [1, 0, 0],
  });

  useHingeConstraint(ref, supportRef, {
    pivotA: [0, -0.2, 0],
    pivotB: [0, 0.2, 0],
    axisA: [0, 0, 1],
    axisB: [0, 0, 1],
  });

  return (
    <>
      <mesh ref={ref} castShadow receiveShadow>
        <boxGeometry args={[4, 0.5, 2]} />
        <meshStandardMaterial map={woodTexture} />
      </mesh>
      <WavesSupport />
    </>
  );
}