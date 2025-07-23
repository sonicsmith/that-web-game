import * as THREE from "three";

export const getHeightWorldPosition = ({
  mesh,
  worldPosition,
}: {
  mesh: THREE.Mesh;
  worldPosition: THREE.Vector2;
}) => {
  mesh.updateMatrixWorld(true);
  const raycaster = new THREE.Raycaster();
  const rayOrigin = new THREE.Vector3(worldPosition.x, worldPosition.y, 10);
  const rayDirection = new THREE.Vector3(0, 0, -1);
  raycaster.set(rayOrigin, rayDirection);
  const intersects = raycaster.intersectObject(mesh, true);
  if (intersects.length > 0) {
    return intersects[0].point.z;
  }
  return null;
};
