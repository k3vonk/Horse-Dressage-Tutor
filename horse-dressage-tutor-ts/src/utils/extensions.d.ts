

interface Array<T> {
    addStepsToPoint(step?: Step): void;
    setupBezPoints(i: number, vector: THREE.Vector3): Point[];
    convertBezPointsToBezCurve(): CubicBezierCurve3;
}

