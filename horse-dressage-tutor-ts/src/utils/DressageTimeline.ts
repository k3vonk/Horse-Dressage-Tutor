/**
 * DressageTimeline : given a dressage sheet in JSON, create the corresponding dressage test using GSAP.
 *
 * @author: Ga Jun Young, 16440714
 */

import * as THREE from 'three';
import {CubicBezierCurve3} from 'three';
import {gsap} from 'gsap';
import {MotionPathPlugin} from "gsap/MotionPathPlugin";
import {CSSPlugin} from 'gsap/CSSPlugin';
import {DressageTest, Point, Step, Steps, Test} from "./types";
import {
    DURATIONS,
    FINAL_STEP, LEFT_COLUMN_LETTERS,
    LETTERS,
    MAX_Y_AXIS,
    MIN_Y_AXIS, RIGHT_COLUMN_LETTERS,
    START
} from "./Constants";
import Vector from "./Vector";
import HorseManager from "../components/HorseManager";

gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(CSSPlugin);

class DressageTimeline {
    private masterTimeline: GSAPTimeline;
    private lifecyclePoint: Point;
    private latestPositionVector: THREE.Vector3;
    private count: number;
    private currStep: Step;

    // horse manager variables required to change during the master timeline lifecycle
    private horseManager: HorseManager;

    constructor(horseManager: HorseManager, data: DressageTest) {
        this.horseManager = horseManager;

        // starting position of the horse (always)
        this.lifecyclePoint = {x: START.x, y: START.y};
        this.latestPositionVector = new THREE.Vector3(START.x, START.y, START.z);
        this.count = 0;
        this.currStep = null;

        this.masterTimeline = gsap.timeline({paused: true});
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
                    this.currStep = steps[stepIndex];

                    switch(this.currStep.action) {
                        case "Halt":
                        case "Immobility":
                        case "Salute": {
                            this.masterTimeline.add(this.halt());
                            break;
                        }
                        case "Straight": {
                            this.masterTimeline.add(this.straight(false));
                            break;
                        }
                        case "Straight-End": {
                            this.masterTimeline.add(this.straight(true));
                            break;
                        }
                        case "Left": {
                            this.masterTimeline.add(this.turnLeft(false, []));
                            break;
                        }
                        case "Left-Midpoint": {
                            this.masterTimeline.add(this.turnLeft(true, []));
                            break;
                        }
                        case "Right": {
                            this.masterTimeline.add(this.turnRight(false, []));
                            break;
                        }
                        case "Right-Midpoint": {
                            this.masterTimeline.add(this.turnRight(true, []));
                            break;
                        }
                        case "Curvy-Straight": {
                            this.masterTimeline.add(this.lineCurve());
                            break;
                        }
                        case "Serpentine-2-Down": {
                            this.masterTimeline.add(this.serpentine(2, true));
                            break;
                        }
                        case "Half-Circle-Left-10": {
                            this.masterTimeline.add(this.halfCircle(10, true));
                            break;
                        }
                        case "Half-Circle-Right-10": {
                            this.masterTimeline.add(this.halfCircle(10, false));
                            break;
                        }
                        case "Half-Circle-Right-15": {
                            this.masterTimeline.add(this.halfCircle(15, false));
                            break;
                        }
                        case "Half-Circle-Left-15": {
                            this.masterTimeline.add(this.halfCircle(15, true));
                            break;
                        }
                        case "Half-Circle-Left-20": {
                            this.masterTimeline.add(this.halfCircle(20, true));
                            break;
                        }
                        case "Half-Circle-Right-20": {
                            this.masterTimeline.add(this.halfCircle(20, false));
                            break;
                        }
                        case "Exit": {
                            this.masterTimeline.add(this.exit());
                            break;
                        }
                        default: {
                            console.log("Action case does not exist! - ", this.currStep.action);
                            break;
                        }
                    }
                }
            }
        }


    }

    // ============= CHILDREN TIMELINE - COMPUTES THE ACTION (GEOMETRY MOVEMENT) & FIGURES OUT THE ANIMATION CLIP TO UTILIZE ================================= //

    /**
     * returns a timeline that corresponds to a horse halting.
     * note: in certain circumstances, this halt is used to change gait
     */
    private halt(): GSAPTimeline {
        const timeline = gsap.timeline();
        const position = this.currStep.position;
        const gait = this.currStep.gait;
        const type = this.currStep.type;

        let duration = DURATIONS[""];
        if (gait !== "") { duration = DURATIONS["change"]; } // in certain cases, the horse animation needs to stop (not visible) and change direction

        timeline.to(this.lifecyclePoint, {duration: duration, x: LETTERS[position[0]].x, y: LETTERS[position[0]].y, onUpdate: () => {
                this.horseManager.horse.position.set(this.lifecyclePoint.x, this.lifecyclePoint.y, 0);
                this.horseManager.setAnimationClip(gait, type);
        }});

        return timeline;
    }

    /**
     * returns a timeline that corresponds to a horse moving in a linear direction
     * @param oneStepBack : 2 step back from its destination (enables a smoother turning animation)
     */
    private straight(oneStepBack: boolean): GSAPTimeline {
        const timeline = gsap.timeline();
        const position = this.currStep.position; // the letter corresponding to position
        const gait = this.currStep.gait; // the gait at that current moment during the timeline loop cycle.
        const type = this.currStep.type;

        // calculate direction horse is traveling & as a result the angle it needs to face
        const directionVector = new THREE.Vector3().subVectors(LETTERS[position[position.length - 1]], LETTERS[position[0]]).normalize();
        const facingAngle  = Vector.lookAtFromLineCurve(LETTERS[position[0]], LETTERS[position[position.length - 1]], directionVector.y >= 0);

        for(let i = 0; i < position.length - 1; i++) {
            const start = {x: LETTERS[position[i]].x, y: LETTERS[position[i]].y};
            const end = new THREE.Vector3(LETTERS[position[i + 1]].x, LETTERS[position[i + 1]].y, 0);

            if (oneStepBack && i === position.length - 2) { end.sub(directionVector.multiplyScalar(2)); } // 2 steps back given by the direction (i.e. 2 step back on the x-axis or y-axis (neg / pos) )

            const time = this.getTimelineDurationFromDistance(start,end); // time of the action

            timeline.to(this.lifecyclePoint,{ease:"none", duration: time,  x: end.x, y: end.y, onUpdate: ()=> {
                    this.horseManager.horse.position.set(this.lifecyclePoint.x, this.lifecyclePoint.y, 0);
                    this.horseManager.horse.rotation.z = facingAngle;

                    this.horseManager.setAnimationClip(gait, type);
                }});

            this.latestPositionVector = end; // save last position
        } // end of for loop...

        return timeline;
    }

    /**
     * returns a timeline that corresponds to a horse turning left N times
     * @param makeMidpoint : create a midpoint for turning twice
     * @param points : optional to use points created from other methods
     */
    private turnLeft(makeMidpoint: boolean, points?: Point[]): GSAPTimeline {
        const timeline = gsap.timeline();

        if (points.length === 0) { points.addStepsToPoint(this.currStep);} // setup points array if it is empty

        this.constructAnchorPoints(makeMidpoint, points);


        for(let i = 0; i < points.length - 1; i++) { // number of turning operation
            let bezPoints = points.setupBezPoints(i, this.latestPositionVector);

            let directionalVector = new THREE.Vector3().subVectors(new THREE.Vector3(points[i+1].x, points[i+1].y, 0), this.latestPositionVector).normalize();

            // Adjust bezPoints based on direction
            if ((directionalVector.x > 0 && directionalVector.y < 0) || (directionalVector.x < 0 && directionalVector.y > 0)) { // Moving - Right Down || Left Up
                bezPoints[1] = bezPoints[2] = {x: points[i].x, y: points[i + 1].y};
            } else if ((directionalVector.x < 0 && directionalVector.y < 0) || (directionalVector.x > 0 && directionalVector.y > 0)) { // Moving - Left Down || Right Up
                bezPoints[1] = bezPoints[2] = {x: points[i+1].x, y: points[i].y};
            }

            this.bezierCurvedTimeline(bezPoints, timeline, directionalVector.y > 0);
        } // end of for loop...
        return timeline;
    }

    /**
     * returns a timeline that corresponds to a horse turning right N times
     * @param makeMidpoint : create a midpoint for turning twice
     * @param points : optional to use points created from other methods
     */
    private turnRight(makeMidpoint: boolean, points?: Point[]): GSAPTimeline {
        const timeline = gsap.timeline();
        if (points.length === 0) {points.addStepsToPoint(this.currStep);} // setup points for the current step if empty
        this.constructAnchorPoints(makeMidpoint, points);

        for(let i = 0; i < points.length - 1; i++) { // number of turning operation
            let bezPoints = points.setupBezPoints(i, this.latestPositionVector);

            let directionalVector = new THREE.Vector3().subVectors(new THREE.Vector3(points[i+1].x, points[i+1].y, 0), this.latestPositionVector).normalize();

            // Adjust bezPoints based on direction
            if((directionalVector.x > 0 && directionalVector.y < 0) || (directionalVector.x < 0 && directionalVector.y > 0)) { // Right Down || Left Up
                bezPoints[1] = bezPoints[2] = {x: points[i+1].x, y: points[i].y};
            } else if((directionalVector.x < 0 && directionalVector.y < 0) || (directionalVector.x > 0 && directionalVector.y > 0)) { // Left Down
                bezPoints[1] = bezPoints[2] = {x: points[i].x, y: points[i + 1].y};
            }

            this.bezierCurvedTimeline(bezPoints, timeline, directionalVector.y > 0);
        }
        return timeline;
    }

    private constructAnchorPoints(makeMidpoint: boolean, points: Point[]) {
        if (this.currStep && makeMidpoint) { // make a midpoint (to carry out 2 short turns) and insert it after the first point.
            let midPointXAddition = 0;

            if (this.currStep.position[0] in LEFT_COLUMN_LETTERS) {
                midPointXAddition = -4.2;
            } else if (this.currStep.position[0] in RIGHT_COLUMN_LETTERS) {
                midPointXAddition = 4.2;
            }

            points.splice(1, 0, {
                x: points[0].x + midPointXAddition,
                y: (points[points.length - 1].y + points[0].y) / 2
            });
        }
    }

    /**
     * returns a timeline that corresponds to a horse moving in a serpentine
     * @param loop : number of serpentine loops between A to B
     * @param isBelowOrigin : direction of serpentine
     */
    private serpentine(loop: number, isBelowOrigin: boolean): GSAPTimeline {
        const timeline = gsap.timeline();
        const position = this.currStep.position;

        let midPoint = { // midpoint of the serpentine
            x: (LETTERS[position[0]].x + LETTERS[position[position.length - 1]].x)/2,
            y: (LETTERS[position[0]].y + LETTERS[position[position.length - 1]].y)/2
        };

        for(let i = 0; i < loop; i++) {
            let destination = { x: (LETTERS[position[i]].x + midPoint.x)/2, y: MAX_Y_AXIS}; // default serpentine ends up on the positive y axis

            let directionalVector = new THREE.Vector3().subVectors(LETTERS[position[position.length - 1]], LETTERS[position[0]]).normalize();

            let points: Point[];
            if (isBelowOrigin) { // Going below origin
                destination.y = MIN_Y_AXIS;
                points = [ LETTERS[position[i]], destination, midPoint ];

                // depending on the direction of movement, horse will make right or left turn
                if (directionalVector.x < 0) {  timeline.add(this.turnRight(false, points)); }
                else { timeline.add(this.turnLeft(false, points)); }

            } else if (!isBelowOrigin){ // Going above origin
                destination.y = MAX_Y_AXIS;
                points = [ midPoint, destination, LETTERS[position[i]] ];

                // depending on the direction of movement, horse will make right or left turn
                if (directionalVector.x < 0) {  timeline.add(this.turnLeft(false, points)); }
                else {  timeline.add(this.turnRight(false, points)); }
            }

            isBelowOrigin = !isBelowOrigin; // alternate between the top and the bottom quadrants
        }

        return timeline;
    }

    private halfCircle(size: number, isLeft: boolean): GSAPTimeline {
        const timeline = gsap.timeline();

        // setup array of points
        let points = [];
        points.addStepsToPoint(this.currStep);

        let directionalVector = new THREE.Vector3().subVectors(new THREE.Vector3(points[points.length - 1].x, points[points.length - 1].y, 0), this.latestPositionVector).normalize();

        if(directionalVector.x === 0) {
            if(directionalVector.y < 0) { // moving down else moving up
                size = -size;
            }
            // create control points based on horse movement direction
            if(isLeft) {
                // Add 2 more control points
                points.splice(1, 0, {x: points[0].x + size * (2/3), y: points[0].y}); // 1st control point
                points.splice(2, 0, {x: points[points.length - 1].x + size * (2/3), y: points[points.length - 1].y}); // 2nd control point
            } else {
                // Add 2 more control points
                points.splice(1, 0, {x: points[0].x - size * (2/3), y: points[0].y}); // 1st control point
                points.splice(2, 0, {x: points[points.length - 1].x - size * (2/3), y: points[points.length - 1].y}); // 2nd control point
            }

            this.bezierCurvedTimeline(points, timeline, directionalVector.y > 0);


        } else { // if circling horizontally
            if(directionalVector.x > 0) { // moving down else moving up
                size = -size;
            }

            if(isLeft) {
                // Add 2 more control points
                points.splice(1, 0, {x: points[0].x , y: points[0].y + size * (21/40)}); // 1st control point
                points.splice(2, 0, {x: points[points.length - 1].x , y: points[points.length - 1].y + size * (21/40)}); // 2nd control point
            } else {
                // Add 2 more control points
                points.splice(1, 0, {x: points[0].x, y: points[0].y  - size * (21/40)}); // 1st control point
                points.splice(2, 0, {x: points[points.length - 1].x , y: points[points.length - 1].y - size * (21/40)}); // 2nd control point
            }

            let lateralVector = new THREE.Vector3().subVectors(new THREE.Vector3(points[1].x, points[1].y, 0), this.latestPositionVector).normalize();

            this.bezierCurvedTimeline(points, timeline, lateralVector.y > 0, true);
        }
        return timeline;
    }

    /**
     * returns a timeline that corresponds to a horse moving in a straight line.
     * Similar to how sine wave looks when passing through the origin.
     */
    private lineCurve(): GSAPTimeline{
        const timeline = gsap.timeline();
        const position = this.currStep.position;

        let points = [];
        points.addStepsToPoint(this.currStep);

        for(let i = 0; i < position.length - 1; i++) {
            let bezPoints = points.setupBezPoints(i, this.latestPositionVector);

            let directionalVector = new THREE.Vector3().subVectors(new THREE.Vector3(points[i+1].x, points[i+1].y, 0), this.latestPositionVector).normalize();

            if (directionalVector.x > 0 &&  (directionalVector.y < 0 || directionalVector.y > 0) ) { // move right - up or down
                if (i === 0) { // Smooth curve into a straight line transition.
                    bezPoints[1] = bezPoints[2] = {x: points[i].x + 2, y: points[i].y};
                } else {
                    bezPoints[1] = bezPoints[2] = {x: points[i + 1].x - 2, y: points[i + 1].y};
                }
            }  else if (directionalVector.x < 0 && (directionalVector.y > 0|| directionalVector.y < 0) ) { // move left - up or down
                if(i === 0) { // Smooth curve into a straight line transition.
                    bezPoints[1] = bezPoints[2] = {x: points[i].x - 2, y: points[i].y};
                } else {
                    bezPoints[1] = bezPoints[2] = {x: points[i + 1].x + 2, y: points[i + 1].y};
                }
            }

            this.bezierCurvedTimeline(bezPoints, timeline, directionalVector.y > 0);
        }

        return timeline;
    }

    /**
     * returns a timeline that corresponds to a horse exiting the arena.
     * Always receives 3 points
     */
    private exit(): GSAPTimeline {
        const timeline = gsap.timeline();
        const position = this.currStep.position;

        // error console message
        if (position.length < 3) { console.log("Exit does not have enough points (3 points required)");}

        // setup points
        let points = [];
        points.addStepsToPoint(this.currStep);
        points.splice(1, 0, {x: points[1].x, y: (points[points.length - 1].y + points[0].y)/2}); // insert in center of array

        // remove this point, as it is unnecessary after the splice
        let removePoint = points[2];
        points = points.filter(obj => obj !== removePoint);

        let directionalVector = new THREE.Vector3().subVectors(LETTERS[position[position.length - 1]], LETTERS[position[0]]).normalize();

        if(directionalVector.x > 0) {
            timeline.add(this.turnLeft(false, points.slice(0,2)));
            timeline.add(this.turnRight(false, points.slice(1,points.length)));
        }

        // Halt at the end
        this.currStep = FINAL_STEP;
        timeline.add(this.halt());

        return timeline;
    }

    /**
     * returns a timeline that corresponds to a horse moving along a bezier curve
     * @param bezPoints : points to create a bezier curve (4 control points)
     * @param timeline : to attach the action to
     * @param isAboveCurve : horse looks at different directions depending if the current point is above or below
     * @param isSwitch
     */
    private bezierCurvedTimeline(bezPoints: Point[], timeline: GSAPTimeline, isAboveCurve: boolean, isSwitch?: boolean) {
        const cubicBezierCurve: CubicBezierCurve3 = bezPoints.convertBezPointsToBezCurve();
        const gait = this.currStep.gait;
        const type = this.currStep.type;

        const currTimelineTotalDuration = timeline.totalDuration();
        const additionalDuration = this.getTimelineDurationFromDistance(null, null, cubicBezierCurve.getLength());

        let directionAngle = (90) * Math.PI/180; // direction based on below the curve
        if (isAboveCurve) { directionAngle = -directionAngle;}
        let changeXDirection;
        let originalAngle = directionAngle.valueOf();
        if (isSwitch) {
            changeXDirection = isSwitch;
        }

        // create a timeline that updates as horse moves along the curve
        timeline.to(this.lifecyclePoint,{ease:"none", duration: additionalDuration, onUpdate: ()=> {
                // move in a bezier curved path in the xy plane.
                this.horseManager.horse.position.set(this.lifecyclePoint.x, this.lifecyclePoint.y, 0);

                // future tick for the next update
                let tick = ((timeline.time() * 60) - (currTimelineTotalDuration * 60))/ (additionalDuration * 60); // look ahead tick
                if (tick > 1) { tick = 1; }

                if(changeXDirection && tick >= 0.5){
                    directionAngle = -originalAngle;
                } else if(changeXDirection && tick <= 0.5) {
                    directionAngle = originalAngle;
                }

                // Rotation in the z-axis
                this.horseManager.updateZRotation(cubicBezierCurve, tick, directionAngle);

                // pick the clip for this action
                this.horseManager.setAnimationClip(gait, type);
            },
            motionPath: {
                path: bezPoints, type: "cubic"
            }
        });

        // update latest end position
        this.latestPositionVector.set(bezPoints[3].x, bezPoints[3].y, 0);
    }

    /**
     * returns the duration of the timeline given either two points or the curved arc distance
     * @param start
     * @param end
     * @param curveDistance
     */
    private getTimelineDurationFromDistance(start: Point, end: Point, curveDistance?: number): number {
        let distance: number;

        if (curveDistance) { distance = curveDistance; }
        else {
            distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)); // distance formula of two points
        }

        // different distance per second for each gait
        const gait = this.currStep.gait;
        const distancePerSecond = DURATIONS[gait];

        return distance / distancePerSecond;
    }

    /**
     * Adds a label to the master timeline at that current point in time
     * @param subIndex
     * @param test : current test
     */
    private addLabelToMasterTimeline(subIndex: number, test: Test) {
        if (subIndex === 0) { // first sub test has an index
            this.masterTimeline.addLabel(test.index + " "+ test.subTests[subIndex].name + " [" + this.count++ + "]"); // Add the phrase
        } else {
            this.masterTimeline.addLabel( test.subTests[subIndex].name + " [" + this.count++ + "]"); // Add the phrase
        }
    }

    public getTimeline(): GSAPTimeline {
        return this.masterTimeline
    }

    public setDatasetForTimeline(data: DressageTest) {
        // starting position of the horse (always)
        this.lifecyclePoint = {x: START.x, y: START.y};
        this.latestPositionVector = new THREE.Vector3(START.x, START.y, START.z);
        this.count = 0;
        this.currStep = null;



        this.masterTimeline = gsap.timeline({paused: true});
        this.buildTimeline(data);
        console.log(this.horseManager.horse.position);
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





