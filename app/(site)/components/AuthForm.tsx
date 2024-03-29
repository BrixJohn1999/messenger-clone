"use client";
import axios from "axios";

import Button from "@/app/components/Button";
import Input from "@/app/components/input/input";
import { useCallback, useEffect, useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { data } from "autoprefixer";
type variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<variant>("LOGIN");
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      //navigate to users page
      router.push("/users");
      console.log("Authenticated");
    }
  }, [session?.status]);

  const toogleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setisLoading(true);

    if (variant === "REGISTER") {
      //axios register
      axios
        .post("/api/register", data)

        //redirect to user page after registering
        .then(() => signIn("credentials", data))
        .catch(() => toast.error("Something went wrong!"))
        //to prevent disbale the button and input form
        .finally(() => setisLoading(false));
    }

    if (variant == "LOGIN") {
      //next auth signin
      signIn("credentials", {
        ...data,
        redirect: false,
      }).then((callback) => {
        if (callback?.error) {
          toast.error("Invalid Credentials");
          setisLoading(false);
        }
        if (callback?.ok && !callback?.error) {
          toast.success("Successfully Login");
          router.push("/users");
        }
      });
    }
  };

  const socialAction = (action: string) => {
    setisLoading(true);

    //nextauth social signin
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid Credentials");
        }
        if (callback?.ok && !callback?.error) {
          toast.success("Successfully Login");
        }
      })
      .finally(() => setisLoading(false));
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input id="name" label="Name" register={register} errors={errors} />
          )}
          <Input
            id="email"
            label="Email address"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === "LOGIN" ? "Sign in" : "Register"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div
              className="
              absolute 
              inset-0
              flex
              items-center
            "
            >
              <div
                className="
                 w-full 
                 border-t
                border-gray-300"
              />
            </div>
            <div
              className="
              relative
              flex 
              justify-center 
              text-sm"
            >
              <span
                className="
              bg-white 
              px-2 text-gray-500"
              >
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
        </div>

        <div
          className="
          flex
          gap-2
          justify-center
          text-sm
          mt-6
          px-2
          text-gray-500
        "
        >
          <div>
            {variant == "LOGIN"
              ? "New to Messenger"
              : "Already have an account?"}
          </div>
          <div onClick={toogleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "Create an account" : "Login"}
            <h1>{variant}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
