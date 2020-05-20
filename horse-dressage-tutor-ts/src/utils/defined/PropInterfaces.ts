/**
 * Stores all the relevant prop interfaces
 *
 * @author: Ga Jun Young, 16440714
 */
import {WithStyles} from "@material-ui/core";
import NavBarStyles from "../../css/StylesWithJS/NavBarStyles";
import HorseManager from "../../components/HorseManager";
import AnimationPlayerStyles from "../../css/StylesWithJS/AnimationPlayerStyles";
import {DressageTest} from "./types";
import {FileState} from "./StateInterfaces";

export interface ContainerProp extends FileState {
}

export interface AnimationProps extends WithStyles<typeof AnimationPlayerStyles> {
    timeline: GSAPTimeline,
    horseManager: HorseManager,
    dressageTitle: string,
    tick: number,
    onToggleView: () => void
}

export interface AnimationButtonsProps {
    classes: any,
    timeline: GSAPTimeline,
    horseManager: HorseManager,
    isDraggablePaused: boolean,
    isReplayDisplayed: boolean,
    isToggled: boolean,
    onMainButtonClick: () => void,
    onHorseButtonToggle: () => void
}

export interface CustomToolbarProps {
    classes: any,
    title: string,
    leftOpen: boolean,
    rightOpen: boolean,
    onDrawerLeftOpen: () => void,
    onDrawerRightOpen: () => void
}

export interface DrawerLeftProps extends WithStyles<typeof NavBarStyles> {
    timeline: GSAPTimeline,
    horseManager: HorseManager,
    currTimestamp: number,
    title: string,
    open: boolean,
    onDrawerClose: () => void,
}

export interface ListItemProps {
    classes: any,
    title: string,
    label: [string, number],
    currTimestamp: number,
    drawLabelIcon: any,
    onButtonClick: () => void,
}

export interface DrawerRightProps extends WithStyles<typeof NavBarStyles> {
    open: boolean,
    currentSheet: string,
    dressageSheets: DressageTest[],
    onChangeDressageSheet: (index: number) => void,
    onDrawerClose: () => void,
    onResetView: () => void,
}