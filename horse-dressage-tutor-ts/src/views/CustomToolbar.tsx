/**
 * Renders to toolbar at the top of the page with two icon buttons and a title
 *
 * @author: Ga Jun Young, 16440714
 */

import {IconButton, Toolbar, Typography} from "@material-ui/core";
import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
import React from "react";
import {CustomToolbarProps} from "../utils/defined/PropInterfaces";

class CustomToolbar extends React.Component<CustomToolbarProps> {

    render() {
        return <Toolbar
            className={this.props.classes.toolbar}
        >
            <IconButton
                color={"inherit"}
                aria-label="open drawer right"
                edge={"start"}
                onClick={this.props.onDrawerLeftOpen}
                className={clsx(this.props.classes.menuButton, this.props.leftOpen && this.props.classes.hide, this.props.rightOpen && this.props.classes.hideTitle)}
            >
                <MenuIcon/>
            </IconButton>

            <Typography
                className={clsx(this.props.classes.title, (this.props.leftOpen || this.props.rightOpen) && this.props.classes.hideTitle)}
                variant={"subtitle1"}
                aria-label="current dressage step">
                {this.props.title}
            </Typography>

            <IconButton
                color={"inherit"}
                aria-label="open drawer right"
                edge={"end"}
                onClick={this.props.onDrawerRightOpen}
                className={clsx(this.props.classes.menuButton, this.props.rightOpen && this.props.classes.hide, this.props.leftOpen && this.props.classes.hideTitle)}
            >
                <SettingsIcon/>
            </IconButton>
        </Toolbar>;
    }
}

export default CustomToolbar;
