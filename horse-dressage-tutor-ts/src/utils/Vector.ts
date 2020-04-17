/**
 * Vector class: enables additional methods for a Vector objects
 */
import * as THREE from "three";

class Vector {

    /**
     * Given a line curve from v1 to v2, adjust where the object looks at as it moves along the curve line
     * @param v1
     * @param v2
     * @param isAboveCurve : angle oppositions depending on this boolean
     */
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
