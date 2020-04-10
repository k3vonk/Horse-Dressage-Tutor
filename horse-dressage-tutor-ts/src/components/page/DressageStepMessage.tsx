import React from "react";
import Grid from "@material-ui/core/Grid";


export const DressageStepMessage: React.FC<{message: string}> = (props) => {

    return (
        <div className="top">
            <Grid container
                  justify="center"
                  alignItems="center"
            >
                <Grid item xs={12}>
                    <h3>{props.message}</h3>
                </Grid>
            </Grid>
        </div>
    );
};
