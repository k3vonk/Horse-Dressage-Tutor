/**
 * LoadingPageStyle : creates a CSS-JS style for the loading page
 *
 * @author: Ga Jun Young
 */

import {makeStyles} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import {NAVBAR_HEIGHT} from "../../utils/defined/Constants";

const LoadingPageStyle = makeStyles(() =>
    createStyles({
        root: {
            flexGrow: 1,
            width: '100%',
        },
        navBar: {
            height: NAVBAR_HEIGHT,
            width: '100%',
        },
        animationPlayer: {
            width: '100%',
            bottom: '0%',
            position: 'absolute',
            height: "15vh",
        }
    })
);

export default LoadingPageStyle;
