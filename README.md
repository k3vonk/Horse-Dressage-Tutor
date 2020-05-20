# :horse: Horse Dressage Tutor

A web application built in React with Typescript. Available at: https://novice-horse-dressage-app.ew.r.appspot.com/

![Horse Dressage Tutor Demo](https://github.com/k3vonk/Horse-Dressage-Tutor/blob/master/Images/app_gif.gif)

# Features
* Animation Player to control the timeline animation of the horse.
* Interactive scene with the ability to zoom, rotate, and pan.
* A list of sub-tests related to a specific novice dressage test sheet.
* 3 novice dressage test sheet to animate from.

# JSON dressage test sheets
Available Gait:
* ```Walk```
* ```Trot```
* ```Canter-Left-Lead```
* ```Canter-Right-Lead```


Available Gait Types:
| Type           | Walk  | Trot | Canter Left Lead | Canter Right Lead |
|----------------|-------|------|------------------|-------------------|
| ```Free ```          | X     |      |                  |                   |
| ```Working  ```      |       | X    | X                | X                 |
| ```Medium   ```      | X     |      |                  |                   |
| ```Medium Strides``` |       | X    | X                | X                 |
| ```Extended   ```    | X     |      |                  |                   |

Available Actions:
* ```Straight / Straight-End```: Travel in a straight line / straight line with an early stop. **(Req. 2-3 positions)**
* ```Left / Left-Midpoint```: Turn left / Turn left and generate a midpoint to anchor the turning effect.**(Req. 2 positions)**
* ```Right / Right-Midpoint```: Similar to left, but in a right movement.
* ```Curvy-Straight```: A diagonal movement where the start and ends are curved. **(Req. 3 positions)**
* ```Half-Circle-[Left/Right]-[10/15/20]```: Carry out a half circle action in the corresponding direction with a diameter N. **(Req. 2 positions)**
* ```Exit```: Leave the arena exiting at A. **(Req. Position K/F, A, and Start)**

# Local Install

```
git clone https://github.com/k3vonk/Horse-Dressage-Tutor.git

cd horse-dressage-tutor-ts
yarn start
```

# Main Dependencies

* ```React```
* ```ThreeJS```
* ```GSAP```
* ```MaterialUI```

# Main Codebase
* ```Container.tsx```: Core React component - an entry point for ThreeJS.
* ```SceneManager.ts```: ThreeJS rendering configuration.
* ```AnimationPlayer.tsx```: UI component for the animation player.
* ```NavBar.tsx```: UI component for the navigation bar.
* ```LoadingPage.tsx```: Skeleton UI for component placeholder.
* ```DressageTimeline.ts```: GSAP Timeline model for the animation player controller.
* ```types.ts```: Typescript types.
* ```PropInterfaces.ts```: React Prop interfaces.
* ```StateInterfaces.ts```: React State interfaces.
