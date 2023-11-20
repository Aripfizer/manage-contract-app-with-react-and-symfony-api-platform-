import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { fr } from "yup-locales";
import { setLocale } from "yup";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { accountService } from "../_services/acount.service";

setLocale(fr);
const RegisterSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email invalide")
    .required("L'adresse email est requise"),
  password: yup
    .string()
    .min(6, "Minimum 6 caractères")
    .matches(/[a-z]+/, "Un caractère minuscule requis")
    .matches(/[A-Z]+/, "Un caractère majuscule requis")
    .matches(/[0-9]+/, "Un chiffre requis")
    .matches(/[!@#$%^&*]+/, "Un caractère spécial requis")
    .required("Champ requis"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Les mots de passe doivent correspondre")
    .required("La confirmation est requise"),
});

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(RegisterSchema),
  });

  const handleFormSubmit = (user) => {
    accountService
      .register(user)
      .then((response) => {
        const user = response.data;
        console.log("User Data :", user);
        reset();
        notifySucess();
        navigate("/login");
      })
      .catch((error) => {
        notifyError(error.message);
      });
  };

  const notifySucess = () =>
    toast.success("Vous pouvez vous connecter ✅", {
      position: "top-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const notifyError = (message) =>
    toast.error("Error : " + message, {
      position: "top-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  return (
    <div className="w-full h-full bg-gray-50 pb-8 min-h-screen">
      <div className="max-w-7xl mx-auto ">
        <div className="pt-14 mb-6 text-center text-2xl font-bold text-blue-600">
          Page d'enregistrement
        </div>
      </div>

      <div className="w-full mt-20">
        <div className="mx-auto p-6 max-w-sm bg-white shadow-md">
          <div className="text-center text-xl font-bold text-blue-600 divider">
            Créer un compte
          </div>
          <div className="h-[1px] mt-4 mb-8 w-full bg-blue-600"></div>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex flex-col items-center justify-start"
          >
            <div>
              <input
                type="text"
                placeholder="Email"
                className={`"text-lg text-gray-800 w-72 transition border placeholder:text-gray-600 placeholder:text-md " + ${
                  errors.email
                    ? "border-red-600 focus:border-red-500 focus:ring-red-500"
                    : "border-blue-600 focus:border-blue-500 focus:ring-blue-500"
                }`}
                {...register("email")}
              />
              {errors.email && (
                <div className="text-red-400 text-sm mt-2 first-letter:capitalize">
                  {errors.email?.message}
                </div>
              )}
            </div>

            <div className="mt-8">
              <input
                type="password"
                placeholder="Password"
                className={`"text-lg text-gray-800 w-72 transition border placeholder:text-gray-600 placeholder:text-md " + ${
                  errors.password
                    ? "border-red-600 focus:border-red-500 focus:ring-red-500"
                    : "border-blue-600 focus:border-blue-500 focus:ring-blue-500"
                }`}
                {...register("password")}
              />
              {errors.password && (
                <div className="text-red-400 text-sm mt-2 first-letter:capitalize">
                  {errors.password?.message}
                </div>
              )}
            </div>
            <div className="mt-8">
              <input
                type="password"
                placeholder="Confirm Password"
                className={`"text-lg text-gray-800 w-72 transition border placeholder:text-gray-600 placeholder:text-md " + ${
                  errors.passwordConfirmation
                    ? "border-red-600 focus:border-red-500 focus:ring-red-500"
                    : "border-blue-600 focus:border-blue-500 focus:ring-blue-500"
                }`}
                {...register("passwordConfirmation")}
              />
              {errors.passwordConfirmation && (
                <div className="text-red-400 text-sm mt-2 first-letter:capitalize">
                  {errors.passwordConfirmation?.message}
                </div>
              )}
            </div>

            <div className="flex justify-center mt-8 mb-5">
              <button
                type="submit"
                className="py-2 px-4 w-72 bg-blue-600 text-white hover:transition-shadow hover:bg-blue-700 "
              >
                Créer
              </button>
            </div>
            <div className="text-sm text-gray-600 my-1">
              Vous avez déjà un compte ?{" "}
              <Link
                to="/login"
                className="text-green-600 hover:transition-shadow hover:text-green-700 "
              >
                Se connecter
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
