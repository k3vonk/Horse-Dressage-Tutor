import * as THREE from 'three';
import {CubicBezierCurve3} from 'three';
import {gsap} from 'gsap';
import {MotionPathPlugin} from "gsap/MotionPathPlugin";
import {CSSPlugin} from 'gsap/CSSPlugin';
import {DressageTest, Point, Step, Steps, Test} from "./types";
import {LETTERS, START} from "./Constants";
import Vector from "./Vector";

gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(CSSPlugin);

class DressageTimeline {
    private horse: THREE.Object3D;
    private readonly masterTimeline: GSAPTimeline;
    private count: number;
    private latestPositionVector: THREE.Vector3;
    private readonly lifecyclePoint: Point;

    constructor(horse: THREE.Object3D) {
        // setup
        this.horse = horse;
        this.lifecyclePoint = {x: START.x, y: START.y};
        this.latestPositionVector = new THREE.Vector3(START.x, START.y, START.z);
        this.count = 0;
        this.masterTimeline = gsap.timeline({paused: true});

        const data: DressageTest = require("../sample/novice_dressage_110_2012.json");
        this.buildTimeline(data);
    }

    /**
     * Loop through the dressage test and create a suitable timeline
     * @param data: is a DressageTest object
     */
    buildTimeline(data: DressageTest) {
        for(let testIndex = 0; testIndex < data.tests.length; testIndex++) { // Iterate through tests...
            const test: Test = data.tests[testIndex];
            for(let subIndex = 0; subIndex < test.subTests.length; subIndex++) { // Iterate subTests in a single test

                this.addLabelToMasterTimeline(subIndex, test);

                const steps: Steps = test.subTests[subIndex].steps; // steps for this sub test
                for(let stepIndex = 0; stepIndex < steps.length; stepIndex++) { // Iterate steps within a subTests...
                    const step: Step = steps[stepIndex];

                    switch(step.action) {
                        case "Halt":
                        case "Immobility":
                        case "Salute": {
                            this.masterTimeline.add(this.halt(step));
                            break;
                        }
                        case "Straight": {
                            this.masterTimeline.add(this.straight(step, false));
                            break;
                        }
                        case "Straight-End": {
                            this.masterTimeline.add(this.straight(step, true));
                            break;
                        }
                        case "Left": {
                            this.masterTimeline.add(this.turnLeft(false, step, []));
                            break;
                        }
                        case "Left-Midpoint": {
                            this.masterTimeline.add(this.turnLeft(true, step, []));
                            break;
                        }
                        case "Right": {
                            this.masterTimeline.add(this.turnRight(false, step, []));
                            break;
                        }
                        case "Curvy-Straight": {
                            this.masterTimeline.add(this.curveStraight(step));
                            break;
                        }
                        case "Serpentine-2-Down": {
                            this.masterTimeline.add(this.serpentine(step, 2, true));
                            break;
                        }
                        case "Exit": {
                            this.masterTimeline.add(this.SCurve(step));
                            break;
                        }
                        default: {
                            console.log("Action case does not exist!");
                            break;
                        }
                    }
                }
            }
        }


    }

    // ============= SUB TIMELINE TYPES =================================

    //-----------------------------------------------------------------------------------             Halt
    private halt(step: Step): GSAPTimeline {
        const timeline = gsap.timeline();
        const position = step.position;

        let duration = 0.5;
        if (step.gait !== "") {
            duration = 0.01;
        }
        timeline.to(this.lifecyclePoint, {duration: duration, x: LETTERS[position[0]].x, y: LETTERS[position[0]].y, onUpdate: () => {
                this.horse.position.x = this.lifecyclePoint.x;
                this.horse.position.y = this.lifecyclePoint.y;
            }});

        return timeline;
    }

    //-----------------------------------------------------------------------------------             Straight
    private straight(step: Step, oneStepBack: boolean): GSAPTimeline {
        const timeline = gsap.timeline();
        const position = step.position; // grab step attributes

        let directionVector = new THREE.Vector3().subVectors(LETTERS[position[position.length - 1]], LETTERS[position[0]]).normalize(); // movement direction
        let facingAngle  = Vector.lookAtFromLineCurve(this.latestPositionVector, LETTERS[position[position.length - 1]], directionVector.y >= 0);

        for(let i = 0; i < position.length - 1; i++) {
            let point = {x: LETTERS[position[i + 1]].x, y: LETTERS[position[i + 1]].y};
            let endVector = new THREE.Vector3(LETTERS[position[position.length - 1]].x, LETTERS[position[position.length - 1]].y, 0);

            if (oneStepBack && i === position.length - 2) { // move until 4 points away from destination
                endVector.sub(directionVector.multiplyScalar(2));
                point = endVector;
            }

            timeline.to(this.lifecyclePoint,{ease:"none", duration: 2,  x: point.x, y: point.y, onUpdate: ()=> {
                    this.horse.position.x = this.lifecyclePoint.x;
                    this.horse.position.y = this.lifecyclePoint.y;
                    this.horse.rotation.z = facingAngle;
                }});

            this.latestPositionVector = endVector; // save last position

        }
        return timeline;
    }

    //-----------------------------------------------------------------------------------             TURN LEFT
    private turnLeft(makeMidpoint: boolean, step?: Step, points?: Point[]): GSAPTimeline {
        const timeline = gsap.timeline();

        points.addStepsToPoint(step);
        if(step && makeMidpoint) {
            points.splice(1, 0, {x: points[0].x, y: (points[points.length - 1].y + points[0].y)/2}); // insert in center of array
        }

        for(let i = 0; i < points.length - 1; i++) { // number of turning operation
            // local variables
            let bezPoints = points.setupBezPoints(i, this.latestPositionVector);

            let directionalVector = new THREE.Vector3().subVectors(new THREE.Vector3(points[i+1].x, points[i+1].y, 0), this.latestPositionVector).normalize();
            // Adjust bezPoints based on direction
            if (directionalVector.x < 0 && directionalVector.y < 0 && makeMidpoint) { // left down (special condition w/ step)
                bezPoints[1] = {x: points[i].x, y: points[i].y};
                bezPoints[2] = {x: points[i].x, y: points[i].y};
            } else if ((directionalVector.x > 0 && directionalVector.y < 0) || (directionalVector.x < 0 && directionalVector.y > 0)) { // Moving - Right Down || Left Up
                bezPoints[1] = {x: points[i].x, y: points[i + 1].y};
                bezPoints[2] = {x: points[i].x, y: points[i + 1].y};
            } else if ((directionalVector.x < 0 && directionalVector.y < 0) || (directionalVector.x > 0 && directionalVector.y > 0)) { // Moving - Left Down || Right Up
                bezPoints[1] = {x: points[i+1].x, y: points[i].y};
                bezPoints[2] = {x: points[i+1].x, y: points[i].y};
            }

            this.bezierCurvedTimeline(bezPoints, timeline, directionalVector.y > 0, timeline.totalDuration());
        } // end of for loop...

        return timeline;
    }

    //-----------------------------------------------------------------------------------             TURN RIGHT
    private turnRight(makeMidpoint: boolean, step?: Step, points?: Point[]): GSAPTimeline {
        const timeline = gsap.timeline();
        points.addStepsToPoint(step);

        for(let i = 0; i < points.length - 1; i++) { // number of turning operation
            let bezPoints = points.setupBezPoints(i, this.latestPositionVector);

            let directionalVector = new THREE.Vector3().subVectors(new THREE.Vector3(points[i+1].x, points[i+1].y, 0), this.latestPositionVector).normalize();
            if((directionalVector.x > 0 && directionalVector.y < 0) || (directionalVector.x < 0 && directionalVector.y > 0)) { // Right Down || Left Up
                bezPoints[1] = {x: points[i+1].x, y: points[i].y};
                bezPoints[2] = {x: points[i+1].x, y: points[i].y};
            } else if((directionalVector.x < 0 && directionalVector.y < 0) || (directionalVector.x > 0 && directionalVector.y > 0)) { // Left Down
                bezPoints[1] = {x: points[i].x, y: points[i + 1].y};
                bezPoints[2] = {x: points[i].x, y: points[i + 1].y};
            }

            this.bezierCurvedTimeline(bezPoints, timeline, directionalVector.y > 0, timeline.totalDuration());
        }
        return timeline;
    }

    private curveStraight(step: Step): GSAPTimeline{
        const timeline = gsap.timeline();
        const position = step.position;

        let points = [];
        points.addStepsToPoint(step);
        for(let i = 0; i < position.length - 1; i++) {
            // local variables
            let bezPoints = points.setupBezPoints(i, this.latestPositionVector);

            let directionalVector = new THREE.Vector3().subVectors(new THREE.Vector3(points[i+1].x, points[i+1].y, 0), this.latestPositionVector).normalize();

            if (directionalVector.x > 0 && directionalVector.y > 0) { // Right Up
                if (i === 0) { // Smooth curve into a straight line transition.
                    bezPoints[1] = {x: points[i].x + 2, y: points[i].y};
                    bezPoints[2] = {x: points[i].x + 2, y: points[i].y};
                } else {
                    bezPoints[1] = {x: points[i + 1].x - 2, y: points[i + 1].y};
                    bezPoints[2] = {x: points[i + 1].x - 2, y: points[i + 1].y};
                }
            }  else if (directionalVector.x < 0 && directionalVector.y > 0) {
                if(i === 0) {
                    bezPoints[1] = {x: points[i].x - 2, y: points[i].y};
                    bezPoints[2] = {x: points[i].x - 2, y: points[i].y};
                } else {
                    bezPoints[1] = {x: points[i + 1].x + 2, y: points[i + 1].y};
                    bezPoints[2] = {x: points[i + 1].x + 2, y: points[i + 1].y};
                }
            }

            this.bezierCurvedTimeline(bezPoints, timeline, directionalVector.y > 0, timeline.totalDuration());
        }

        return timeline;
    }

    private serpentine(step: Step, loop: number, isDown: boolean): GSAPTimeline {
        const timeline = gsap.timeline();
        const position = step.position;

        let midPoint = {
            x: (LETTERS[position[0]].x + LETTERS[position[position.length - 1]].x)/2,
            y: (LETTERS[position[0]].y + LETTERS[position[position.length - 1]].y)/2
        };

        for(let i = 0; i < loop; i++) {
            let destination = { x: (LETTERS[position[i]].x + midPoint.x)/2, y: 7};

            let points: Point[];
            let directionalVector = new THREE.Vector3().subVectors(LETTERS[position[position.length - 1]], LETTERS[position[0]]).normalize();
            if (isDown) { // Left Down
                destination.y = -7;
                points = [ {x: LETTERS[position[i]].x, y: LETTERS[position[i]].y}, destination, midPoint];

                if (directionalVector.x < 0) {  timeline.add(this.turnRight(false, null, points)); } // turn left
                else { timeline.add(this.turnLeft(false, null, points)); } // turn right

            } else if (!isDown){ // Up Left
                destination.y = 7;
                points = [ midPoint, destination, {x: LETTERS[position[i]].x, y: LETTERS[position[i]].y}];

                if (directionalVector.x < 0) {  timeline.add(this.turnLeft(false, null, points)); }
                else {  timeline.add(this.turnRight(false, null, points)); }

            }

            isDown = !isDown;
        }

        return timeline;
    }

    private SCurve(step: Step): GSAPTimeline { // always receives 3 points
        const timeline = gsap.timeline();
        const position = step.position;

        // setup points
        let points = [];
        points.addStepsToPoint(step);
        points.splice(1, 0, {x: points[1].x, y: (points[points.length - 1].y + points[0].y)/2}); // insert in center of array

        let removePoint = points[2];
        points = points.filter(obj => obj !== removePoint);
        let directionalVector = new THREE.Vector3().subVectors(LETTERS[position[position.length - 1]], LETTERS[position[0]]).normalize();

        if(directionalVector.x > 0) {
            timeline.add(this.turnLeft(false, null, points.slice(0,2)));
            timeline.add(this.turnRight(false, null, points.slice(1,points.length)));
        }

        return timeline;
    }

    private bezierCurvedTimeline(bezPoints: Point[], timeline: GSAPTimeline, isAboveCurve: boolean, totalDuration: number) {
        let cubicBezierCurve = bezPoints.convertBezPointsToBezCurve();

        let directionAngle = (90) * Math.PI/180;
        if (isAboveCurve) {
            directionAngle = -directionAngle;
        }

        timeline.to(this.lifecyclePoint,{ease:"none", duration: 2, onUpdate: ()=> {
                // move in a bezier curved path in the xy plane.
                this.horse.position.x = this.lifecyclePoint.x;
                this.horse.position.y = this.lifecyclePoint.y;

                let tick = ((timeline.time() * 60) - (totalDuration*60))/120; // look ahead
                if (tick > 1) { tick = 1; } // Three curve from point A-B in 0-100%

                // Rotation in the z-axis
                let tangent = cubicBezierCurve.getTangent(tick).normalize();
                let angle = -Math.atan(tangent.x / tangent.y);
                this.horse.rotation.z = angle + directionAngle; // radians to correct angle at which the horse should be looking at
            },
            motionPath: {
                path: bezPoints, type: "cubic"
            }
        });

        // update latest end position
        this.latestPositionVector.x = bezPoints[3].x;
        this.latestPositionVector.y = bezPoints[3].y;

    }

    ///////////////////////////////  EXTRACTED METHODS TO REDUCE CODE
    private addLabelToMasterTimeline(subIndex: number, test: Test) {
        if (subIndex === 0) { // first sub test has an index
            this.masterTimeline.addLabel(test.index + " "+ test.subTests[subIndex].name + "\t[" + this.count++ + "]"); // Add the phrase
        } else {
            this.masterTimeline.addLabel( test.subTests[subIndex].name + "\t[" + this.count++ + "]"); // Add the phrase
        }
    }

    public getTimeline(): GSAPTimeline {
        return this.masterTimeline
    }
}

export default DressageTimeline;

// Extensions to Array
// eslint-disable-next-line no-extend-native
Array.prototype.addStepsToPoint = function(step?: Step){
    if (step) {
        const position = step.position; // grab step attributes
        for(let i = 0; i < position.length; i++) {
            this.push({x: LETTERS[position[i]].x ,y: LETTERS[position[i]].y});
        }
    }
};

// eslint-disable-next-line no-extend-native
Array.prototype.convertBezPointsToBezCurve = function(): CubicBezierCurve3{

    return new THREE.CubicBezierCurve3(
        new THREE.Vector3(this[0].x, this[0].y, 0),
        new THREE.Vector3(this[1].x, this[1].y, 0),
        new THREE.Vector3(this[2].x, this[2].y, 0),
        new THREE.Vector3(this[3].x, this[3].y, 0)
    );

};

// eslint-disable-next-line no-extend-native
Array.prototype.setupBezPoints = function(i: number, vector: THREE.Vector3): Point[] {
    return [
        {x: vector.x, y: vector.y},
        {x: 0, y: 0},
        {x: 0, y: 0},
        {x: this[i + 1].x, y: this[i + 1].y}
    ];
};





