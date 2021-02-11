import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import {options} from "../../misc/handlers";
import {MenuItem} from "@material-ui/core";

const styles = {
    root: {
        background: "black"
    },
    input: {
        color: "white"
    }
}
function CustomizedInputs(props) {
    const { classes } = props;

    return (
        <TextField
            select
            onChange={props.handleChange}
            value={props.value}
            style={{width: 'auto'}}
            className={classes.root}
            InputProps={{
                className: classes.input
            }}
        >
            {options.map(option => (
                <MenuItem key={option.value} value={option.value} style={{backgroundColor: 'black', color: 'white'}}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    );
}

export default withStyles(styles)(CustomizedInputs);