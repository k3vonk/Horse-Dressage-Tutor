/**
 * Storage for all the state interfaces
 *
 * @author: Ga Jun Young, 16440714
 */
import {Mark, WithStyles} from "@material-ui/core";
import NavBarStyles from "../../css/StylesWithJS/NavBarStyles";
import HorseManager from "../../components/HorseManager";
import DressageTimeline from "../DressageTimeline";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {Font} from "three";
import {DressageTest} from "./types";

export interface FileState {
    dressageJsonSheets: DressageTest[],
    horseFile: GLTF,
    fontFile: Font,
}

export interface AppState extends FileState {
    isPageLoading: boolean,
}

export interface ContainerState {
    dressageTimeline: DressageTimeline,
    horseManager: HorseManager,
    currentSheet: DressageTest,
    time: number
}

export interface AnimationState {
    isDraggablePaused: boolean,
    isReplayDisplayed: boolean,
    isToggled: boolean,
    totalTimestamp: string,
    currTimestamp: string,
    sliderValue: number,
    marks: Mark[],
}

export interface DrawerStates {
    lastTimeScrolled: number,
    waitPeriod: number,
}

export interface NavBarProps extends WithStyles<typeof NavBarStyles> {
    time: number,
    currentSheetName: string,
    dressageJsonSheets: DressageTest[],
    horseManager: HorseManager,
    timeline: GSAPTimeline,
    onChangeDressageSheet: (index: number) => void,
    onResetView: () => void,
}

export interface NavBarStates {
    isRightOpen: boolean,
    isLeftOpen: boolean,
    currTimestamp: number,
    title: string
}
