import * as THREE from 'three';
import {gsap} from 'gsap';
import {MotionPathPlugin} from "gsap/MotionPathPlugin";
import {CSSPlugin} from 'gsap/CSSPlugin';
import {Constants} from "./Constants";
import dressage2012 from '../sample/dressage2012.json';

gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(CSSPlugin);

interface Step{
    pos: string[],
    action: string
}

interface Steps extends Array<Step> {}

interface SubTest {
    name: string,
    steps: Steps
}

interface SubTests extends Array<SubTest> {}

interface Point {
    x: number,
    y: number
}

export default class DressageTimeline {
    private horse: THREE.Object3D;
    private timeline: GSAPTimeline; // master timeline

    constructor(horse: THREE.Object3D) {
        this.horse = horse;

        this.timeline = gsap.timeline( {repeat: -1, onRepeat: function() {
                this.horse.position.set(Constants.START.START_POSITION[0], Constants.START.START_POSITION[1], Constants.START.START_POSITION[2]);
            }});

        const firstTest: SubTests = dressage2012.tests[0].sub_tests; // Array of moves for test 0

        let lastPosition = this.entrance(firstTest);


        for (let i = 1; i < dressage2012.tests.length; i++) {
            console.log(i);
            const currTest: SubTests = dressage2012.tests[i].sub_tests;
            lastPosition = this.createTimeline(currTest, lastPosition);
        }

        // A master timeline with sub timeline to hold other things
        // TODO: take a json file and parse it?
    }

    private entrance(subTests: SubTests): Point {
        console.log(subTests);
        let lastPosition: Point = {x: Constants.START.START_POSITION[0], y: Constants.START.START_POSITION[1] };
        for (let i = 0; i < subTests.length; i++) { // iterate over substeps
            // Some index here to label the first timeline
            for (let step of subTests[i].steps) {
                if (i === 0) { // first step
                    if(step.action === "Trot")
                        this.tweenTrot(step.pos, step.action);
                }
                else if(step.action === "Halt" || step.action === "Immobility" || step.action === "Salute") {
                    this.tweenHaltImmobilitySalute(step.pos, step.action);
                }
                else if(step.action === "Trot-End-Turn") {
                    lastPosition = this.tweenTrotEndGap(step.pos, step.action);
                }
                else if(step.action === "LeftLeft") {
                    lastPosition = this.tweenTurnLeftLeft(step.pos, step.action, lastPosition);
                }
            }
        }

        return lastPosition;
    }

    private createTimeline(subTests: SubTests, startPosition: Point): Point {
        let lastPoint: Point = startPosition;
        for (let i = 0; i < subTests.length; i++) {
            for (let subIndex = 0; subIndex < subTests[i].steps.length; subIndex++) {
                let step = subTests[i].steps[subIndex];
                console.log(step);
                switch(step.action) {
                    case "Trot": {
                        this.tweenTrot(step.pos, step.action);
                        break;
                    }
                    case "Right-Trot": // fallthrough
                    case "Right": {
                        lastPoint = this.tweenTurnRight(step.pos, step.action, lastPoint);
                        break;
                    }
                    case "Serpentine": {
                        break
                    }
                    default: {
                        console.log("Case does not exist in createTimeline!");
                        break;
                    }
                }
            }
        }

        return lastPoint;
    }

    private tweenTrot(pos: string[], action: string) {
        if (pos.length === 1) {
            // 1 destination
        }
        else if (pos.length === 2) {
            this.timeline.fromTo(this.horse.position, {x: Constants.LETTERS[pos[0]][0], y: Constants.LETTERS[pos[0]][1]}, {ease: "none", duration: 2, x: Constants.LETTERS[pos[1]][0], y: Constants.LETTERS[pos[1]][1]});
        }
        else if(pos.length === 3) {
            this.timeline.fromTo(this.horse.position, {x: Constants.LETTERS[pos[0]][0], y: Constants.LETTERS[pos[0]][1]}, {ease: "none", duration: 2, x: Constants.LETTERS[pos[1]][0], y: Constants.LETTERS[pos[1]][1]});
            this.timeline.fromTo(this.horse.position, {x: Constants.LETTERS[pos[1]][0], y: Constants.LETTERS[pos[1]][1]}, {ease: "none", duration: 2, x: Constants.LETTERS[pos[2]][0], y: Constants.LETTERS[pos[2]][1]});
        }
    }

    private tweenTrotEndGap(pos: string[], action: string): Point {
        let xGap = 0;
        let yGap = 0;

        if( Constants.LETTERS[pos[0]][0] !== Constants.LETTERS[pos[1]][0]) {
            xGap = Constants.LETTERS[pos[0]][0] > Constants.LETTERS[pos[1]][0] ? 4: -4
        }
        if( Constants.LETTERS[pos[0]][1] !== Constants.LETTERS[pos[1]][1]) {
            yGap = Constants.LETTERS[pos[0]][1] > Constants.LETTERS[pos[1]][1] ? 4: -4
        }

        if (pos.length === 2) {
            this.timeline.fromTo(this.horse.position, {x: Constants.LETTERS[pos[0]][0], y: Constants.LETTERS[pos[0]][1]}, {ease: "none", duration: 2, x: Constants.LETTERS[pos[1]][0] + xGap, y: Constants.LETTERS[pos[1]][1] + yGap})
        }
        return {x: Constants.LETTERS[pos[1]][0] + xGap,  y: Constants.LETTERS[pos[1]][1] + yGap};

    }

    private tweenTurnRight(pos: string[], action: string, lastPosition: Point): Point {
        // Need to know if its first half or second half
        let bezPoints: {}[];
        // TODO: quadrant decision
        if (Constants.LETTERS[pos[1]][1] >= 0) {
            bezPoints = [{x: Constants.LETTERS[pos[0]][0], y: Constants.LETTERS[pos[0]][1]},
                {x: Constants.LETTERS[pos[1]][0] + 1, y: Constants.LETTERS[pos[0]][1]}, // Anchor point
                {x: Constants.LETTERS[pos[1]][0], y: Constants.LETTERS[pos[0]][1]}, // Anchor point
                {x: Constants.LETTERS[pos[1]][0], y: Constants.LETTERS[pos[1]][1]}
            ];
        } else {
            bezPoints = [{x: Constants.LETTERS[pos[0]][0], y: Constants.LETTERS[pos[0]][1]},
                {x: Constants.LETTERS[pos[0]][0], y: Constants.LETTERS[pos[1]][1]}, // Anchor point
                {x: Constants.LETTERS[pos[0]][0] + 1, y: Constants.LETTERS[pos[1]][1]}, // Anchor point
                {x: Constants.LETTERS[pos[1]][0], y: Constants.LETTERS[pos[1]][1]}
            ];
        }

        lastPosition = bezPoints[3] as Point; // new Point
        console.log("Entered tweenTurnRight");
        this.timeline.to(this.horse.position, {duration: 2, ease: "none" , motionPath: {
                path: bezPoints,
                type: "cubic"
            }});

        return lastPosition;
    }

    private tweenTurnLeftLeft(pos: string[], action: string, lastPosition: Point): Point {

        this.horse.position.set(lastPosition.x, lastPosition.y, 0);
        // First Left
        let bezPoints: {}[]= [{x: lastPosition.x, y: lastPosition.y},
            {x: Constants.LETTERS[pos[0]][0] - 1, y: Constants.LETTERS[pos[0]][1]}, // Anchor point
            {x: Constants.LETTERS[pos[0]][0], y: Constants.LETTERS[pos[0]][1]}, // Anchor point
            {x: Constants.LETTERS[pos[0]][0], y:  Constants.LETTERS[pos[0]][1] + (Constants.LETTERS[pos[1]][1] - Constants.LETTERS[pos[0]][1])/2}
        ];
        let points = new THREE.CubicBezierCurve3(
            new THREE.Vector3(lastPosition.x, lastPosition.y,  0),
            new THREE.Vector3(Constants.LETTERS[pos[0]][0] - 1, Constants.LETTERS[pos[0]][1], 0),
            new THREE.Vector3(Constants.LETTERS[pos[0]][0], Constants.LETTERS[pos[0]][1],0),
            new THREE.Vector3(Constants.LETTERS[pos[0]][0], (Constants.LETTERS[pos[0]][1] + (Constants.LETTERS[pos[1]][1] - Constants.LETTERS[pos[0]][1])/2), 0)
        );
        var p = points.getPoints( 50 );
        var geometry = new THREE.BufferGeometry().setFromPoints( p );
        var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

// Create the final object to add to the scene
        var curveObject = new THREE.Line( geometry, material );
        this.horse.add(curveObject);
       lastPosition = bezPoints[3] as Point; // new Point


        // TODO: testing
/*
        this.timeline.to(this.horse.position, {duration: 2, ease: "none",
            motionPath: {
                path: bezPoints,
                type: "cubic"
            }
        }, "Hello");*/


        var coords = {x: lastPosition.x, y: lastPosition.y};
        var h = this.horse;
        console.log(lastPosition);
        console.log("hello");
        //var horsePosition = new THREE.Vector3();
        //var horseTarget = new THREE.Vector3();
        var startPosition = 0;
        this.timeline.to(coords, {duration: 2, ease: "none" , onUpdate: function() {

                startPosition += 1/120;
                var point = points.getPointAt(startPosition);
                h.position.x = point.x;
                h.position.y = point.y;
                let tangent = points.getTangent(startPosition).normalize();

                // change tangent to 3
                var angle = -Math.atan(tangent.x / tangent.y);
                // set the quaternion
                console.log(angle);
                h.rotation.z = angle + (90) * Math.PI/180;
            },
            motionPath: {
                    path: bezPoints,
                    type: "cubic",
                }
            }, "Hello");
        /*

                this.timeline.to(this.horse, {duration: 2, ease: "none", onUpdate: function() {
                       // var newPosition = points.getPoint( startPosition );
                       // horse.position.set(newPosition.x, newPosition.y, newPosition.z);
                        startPosition += .001;
        //Also update the car's orientation so it looks at the road
                        var target = points.getPoint( startPosition );
                        horse.lookAt( target );
        //Also update the car's orientation so it looks at the road
                    }
                    }, "Hello"); */


        // Second Left
        bezPoints = [{x: lastPosition.x, y: lastPosition.y},
            {x: Constants.LETTERS[pos[0]][0], y:  Constants.LETTERS[pos[1]][1]}, // Anchor point
            {x: Constants.LETTERS[pos[0]][0] - 1, y: Constants.LETTERS[pos[1]][1]}, // Anchor point
            {x: Constants.LETTERS[pos[1]][0], y:  Constants.LETTERS[pos[1]][1]}
        ];

        points = new THREE.CubicBezierCurve3(
            new THREE.Vector3(lastPosition.x, lastPosition.y,  0),
            new THREE.Vector3(Constants.LETTERS[pos[0]][0], Constants.LETTERS[pos[1]][1], 0),
            new THREE.Vector3(Constants.LETTERS[pos[0]][0] - 1, Constants.LETTERS[pos[1]][1],0),
            new THREE.Vector3(Constants.LETTERS[pos[1]][0], Constants.LETTERS[pos[1]][1], 0)
        );

        lastPosition = bezPoints[3] as Point; // new Point

        var startPosition = 0;
        this.timeline.to(coords, {duration: 2, ease: "none" , onUpdate: function() {

                startPosition += 1/120;
                var point = points.getPointAt(startPosition);
                h.position.x = point.x;
                h.position.y = point.y;
                let tangent = points.getTangent(startPosition).normalize();

                // change tangent to 3
                var angle = -Math.atan(tangent.x / tangent.y);
                // set the quaternion
                console.log(angle);
                h.rotation.z = angle + (90) * Math.PI/180;
            },
            motionPath: {
                path: bezPoints,
                type: "cubic",
            }
        }, "Hello2");

        return lastPosition;
    }

    private tweenHaltImmobilitySalute(pos: string[], action: string) {
        this.timeline.to(this.horse.position, {duration: 1, x: Constants.LETTERS[pos[0]][0]});
        console.log(action);
    }

    private serpentineRight(pos: string[], action: string) {


    }

    getAngle( position: number, path: THREE.CubicBezierCurve3){
        let tangent = path.getTangent(position).normalize();

        // change tangent to 3D
        return -Math.atan(tangent.x / tangent.y);
    }

}
