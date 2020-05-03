/**
 * Memoized list of items rendered to boost performance. A normal list of items would require heavy amounts of performance
 *
 * @author: Ga Jun Young, 16440714
 */

import React from "react";
import {Grid} from "@material-ui/core";
import clsx from "clsx";
import {ListItemProps} from "../utils/defined/PropInterfaces";

const ListItem = React.memo<ListItemProps>((props) => {

    return <button className={props.classes.itemButton} onClick={props.onButtonClick}>
        <Grid container
              justify="center"
              alignItems="center"
              className={clsx(props.classes.item, {
                  [props.classes.currItem]: (props.title === props.label[0]),
                  [props.classes.activeItem]: (props.currTimestamp > props.label[1] &&
                      props.title !== props.label[0]),
              })}>
            <Grid item xs={3}>{props.drawLabelIcon}</Grid>
            <Grid item xs={9}><h5>{props.label[0]}</h5></Grid>
        </Grid>
    </button>;
});

export default ListItem;
