/**
 * Loader Styles : creates a style for the loading page
 *
 * @author: Ga Jun Young
 */

import {makeStyles} from "@material-ui/core/styles";
import {createStyles, Theme} from "@material-ui/core";

const LoaderStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            width: '100%',
        },
        navBar: {
            height: '10vh',
            width: '100%',
        },
        animationController: {
            width: '100%',
            top:'100vh',
            transform:'translateY(-100%)',
            position: 'absolute',
            height: "15vh",
        }
    })
);

export default LoaderStyles;
