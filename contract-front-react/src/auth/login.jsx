import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { fr } from "yup-locales";
import { setLocale } from "yup";
import { useNavigate, Link } from "react-router-dom";
import { accountService } from "../_services/acount.service";

setLocale(fr);
const LoginSchema = yup.object().shape({
  email: yup.string().email("Email invalide").required("Champ requis"),

  password: yup
    .string()
    .min(6, "Minimum 6 caractères")
    .matches(/[a-z]+/, "Un caractère minuscule requis")
    .matches(/[A-Z]+/, "Un caractère majuscule requis")
    .matches(/[0-9]+/, "Un chiffre requis")
    .matches(/[!@#$%^&*]+/, "Un caractère spécial requis")
    .required("Champ requis"),
});

function Login() {
  const navigate = useNavigate();

  const [notFoundMessage, setNotFoundMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  // const handleFormSubmit = (data) => console.log(data);

  const handleFormSubmit = (credentials) => {
    console.log(credentials);
    accountService
      .login(credentials)
      .then((response) => {
        const token = response.data.token;
        accountService.saveToken(token);

        console.log("Data :", token);
        reset();
        notifySucess();
        navigate("/contracts");
      })
      .catch((error) => {
        if (error.response.status === 401)
          setNotFoundMessage("Email ou password incorrect");
        reset({ password: "" });
        notifyError("Email ou password incorrect");
      });
  };

  const notifySucess = () =>
    toast.success("Connexion réussie ✅", {
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
    toast.error(message, {
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
          Page de connexion
        </div>
      </div>

      <div className="w-full mt-20">
        <div className="mx-auto p-6 max-w-sm bg-white shadow-md">
          <div className="text-center text-xl font-bold text-blue-600 divider">
            Se connecter
          </div>
          <div className="h-[1px] mt-4 mb-6 w-full bg-blue-600"></div>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex flex-col items-center justify-start"
          >
            {notFoundMessage && (
              <div className="text-md text-red-400 mb-3">{notFoundMessage}</div>
            )}
            <div>
              <input
                type="text"
                placeholder="Email"
                className={`"text-lg text-gray-800 w-72 transition border placeholder:text-gray-600 placeholder:text-md " + ${
                  errors.email || notFoundMessage
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

            <div className="flex justify-center mt-8 mb-3">
              <button
                type="submit"
                className="py-2 px-4 w-72 bg-blue-600 text-white hover:transition-shadow hover:bg-blue-700 "
              >
                Connexion
              </button>
            </div>
            <div className="text-sm text-gray-600 my-1">
              Vous n'avez pas un compte ?{" "}
              <Link
                to="/register"
                className="text-green-600 hover:transition-shadow hover:text-green-700 "
              >
                S'incrire
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
