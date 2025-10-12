import React from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import {
  Typography,
  FormControl,
  FormLabel,
  TextField,
  Button,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectAuthData } from "@/features/auth/authSlice";
//import { selectAllUsers } from '@/features/users/usersSlice'
//import { useGetUsersQuery } from '@/features/users/usersSlice'

import { login } from "./authSlice";
import UnauthorizedLayout from "@/theme/layouts/UnauthorizedLayout";

interface LoginPageFormFields extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}
interface LoginPageFormElements extends HTMLFormElement {
  readonly elements: LoginPageFormFields;
}

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status: authStatus, errors } = useAppSelector(selectAuthData);
  //const users = useAppSelector(selectAllUsers)
  // const {
  //   data: users = [],
  //   isLoading,
  //   isFetching,
  //   isSuccess,
  //   isError,
  //   error,
  // } = useGetUsersQuery()

  React.useEffect(() => {
    if (authStatus === "authorized") {
      navigate("/dash");
    }
  }, [authStatus, navigate /* , errors */]);

  const handleSubmit = async (e: React.FormEvent<LoginPageFormElements>) => {
    e.preventDefault();

    const email = e.currentTarget.elements.email.value;
    const password = e.currentTarget.elements.password.value;
    await dispatch(login({ email, password }));
    //navigate('/posts')
  };

  let errorsRender = null;

  if (authStatus === "rejected") {
    let errorsList = [];
    if (typeof errors === "string") {
      errorsList = [errors];
    } else if (errors instanceof Array) {
      errorsList = errors;
    } else if (errors instanceof Object) {
      errorsList = Object.values(errors as object).flat();
    }
    console.log(errorsList);
    errorsRender = errorsList.map((err) => (
      <li key={err as string}>{err as string}</li>
    ));
  }
  // const usersOptions = users.map((user) => (
  //   <option key={user.id} value={user.id}>
  //     {user.name}
  //   </option>
  // ))

  return (
    <UnauthorizedLayout>
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          {errorsRender && <ul>{errorsRender}</ul>}
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              //error={emailError}
              //helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              //color={emailError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              //error={passwordError}
              //helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              //color={passwordError ? 'error' : 'primary'}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            //onClick={validateInputs}
          >
            Sign in
          </Button>{" "}
        </Box>
      </Card>
    </UnauthorizedLayout>
  );
};
