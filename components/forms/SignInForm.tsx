"use client";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useFormik } from "formik";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as yup from "yup";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const SignInForm = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <Input
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        id="email"
        name="email"
        label="Email"
        variant={"flat"}
        validationState={formik.errors.email ? "invalid" : "valid"}
        errorMessage={formik.errors.email}
      />

      <Input
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        id="password"
        name="password"
        label="Password"
        type="password"
        variant={"flat"}
        validationState={formik.errors.password ? "invalid" : "valid"}
        errorMessage={formik.errors.password}
      />

      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
};

export default SignInForm;
