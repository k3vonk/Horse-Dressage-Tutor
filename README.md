# :horse: Horse Dressage Tutor

A web application built in React with Typescript. 


# Features
* Animation Player to control the timeline animation of the horse.
* Interactive scene with the ability to zoom, rotate, and pan.
* A list of sub-tests related to a specific novice dressage test sheet.
* 3 novice dressage test sheet to animate from.

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
