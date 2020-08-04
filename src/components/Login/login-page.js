import React from 'react'
import { useHistory } from "react-router"
import {Container} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

export const LoginPage = () => {
    return (
        <Container>
                <form noValidate autoComplete="false">
                    <TextField id="login" name="login" label="Логин" variant="outlined"/>
                    <TextField id="pass" name="password" type="password" label="Пароль" variant="outlined"/>
                </form>
        </Container>
    )
}