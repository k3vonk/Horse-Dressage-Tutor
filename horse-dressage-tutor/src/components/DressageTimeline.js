import { gsap } from "gsap";
import {centerlineLetters, edgeLetters, startPosition} from "../Constants";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(MotionPathPlugin);

// TODO: walk, trot, and canter
// TODO: initial horse position is at A
// TODO: Put steps somewhere
export default class DressageTimeline{
    constructor(mesh) {
        this.mesh = mesh;
        this.timeline = gsap.timeline({repeat: -1});
        this.entrance();
    }

    // Entrance is based on a linear movement along the center-line
    entrance(steps = [{A: "Trot", X: "End"}, {X: "Halt"}, {X: "Immobility"}, {X: "Salute"}, {X: "Trot", C: "End"}, {C: "Left"}, {C: "Left", H: "End"}]) {

        // TODO: timing total time 10 (Depends on trot etc...), Have a constant where different actions have different times?

        // Loop through steps
        for (let i = 0; i < steps.length; i++) {
            let stepLength = Object.keys(steps[i]).length;

            if (stepLength === 1)
            {
                let firstKey = Object.keys(steps[i])[0];
                let value= Object.values(steps[i]);

                if (value.length === 1) {
                    if (value[0] === "Halt")
                    {
                        this.timeline.to(this.mesh.current.position, {duration: 2, x: centerlineLetters[firstKey][0]});
                    }
                    else if (value[0] === "Left")
                    {
                        let bezPoints = [{x: edgeLetters[firstKey][0] + 2, y: edgeLetters[firstKey][1]},
                            {x: edgeLetters[firstKey][0] +1 , y: edgeLetters[firstKey][1]- 1},
                            {x: edgeLetters[firstKey][0], y: edgeLetters[firstKey][1] - 2}];

                        this.timeline.to(this.mesh.current.position, {duration: 8, motionPath: {path: bezPoints}});
                    }
                }
            }
            else if (stepLength === 2)
            {
                let firstKey = Object.keys(steps[i])[0];
                let secondKey = Object.keys(steps[i])[1];

                if (i === 0) //unique case
                {
                    this.timeline.fromTo(this.mesh.current.position, {x: startPosition[0]}, {duration: 8, x: centerlineLetters[secondKey][0]});
                }
                else if (firstKey in centerlineLetters && secondKey in edgeLetters) // centerline to edgeline
                {
                    this.timeline.fromTo(this.mesh.current.position, {x: centerlineLetters[firstKey][0]}, {duration: 8, x: edgeLetters[secondKey][0] + 2});
                }
                else if (firstKey in edgeLetters && secondKey in edgeLetters) // edge to edge
                {
                    let direction = Object.values(steps[i]);
                    let bezPoints;

                    if(direction[0] === "Left")
                        bezPoints = [{x:edgeLetters[firstKey][0], y:edgeLetters[firstKey][1] - 5}, {x:-14, y:-6}, {x:-13, y:edgeLetters[secondKey][1]}];
                    if(direction[0] === "Right")
                        bezPoints = [{x:edgeLetters[firstKey][0], y:edgeLetters[firstKey][1]}, {x:-14, y:7}, {x:edgeLetters[secondKey][0], y:edgeLetters[secondKey][1]}];
                    this.timeline.to(this.mesh.current.position, {duration: 8, motionPath: { path: bezPoints }})
                }
            }
            else {
                // throw error - that length doesn't exist
            }
        }

    }

    startTest() {
        this.timeline.play();
    }

}
