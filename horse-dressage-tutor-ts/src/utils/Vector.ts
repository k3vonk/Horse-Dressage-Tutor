import * as THREE from "three";


class Vector {

    public static lookAtFromLineCurve(v1: THREE.Vector3, v2: THREE.Vector3, isAboveCurve: boolean): number {
        let curve = new THREE.LineCurve3(
            new THREE.Vector3(v1.x, v1.y, 0),
            new THREE.Vector3(v2.x, v2.y, v2.z)
        );
        let tangent = curve.getTangent(1).normalize();

        let angle = 90 * Math.PI/180;
        if (isAboveCurve) {
            angle = -angle;
        }
        return -Math.atan(tangent.x / tangent.y) + angle;
    }
}

export default Vector;
