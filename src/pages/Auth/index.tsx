import React from "react";

import S from "./auth.module.scss";

import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";

type FormData = {
  email: string;
  password: string;
};

import useLoadingStore from "../../store/loading.store";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Input, InputGroup } from "rsuite";

import api from "../../services/api.service";

import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const AuthPage: React.FC = () => {
  const [visible, setVisible] = React.useState(false);

  const { startLoading, stopLoading } = useLoadingStore();

  const authStore = useAuthStore();
  const navigate = useNavigate();

  const handleChange = () => {
    setVisible(!visible);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (FormData) => {
    startLoading();
    try {
      const response = await api.post("/auth/login", FormData);

      stopLoading();

      if (response.status === 201) {
        navigate("/dashboard", { replace: true });
        authStore.setToken(response.data.token);
        authStore.setRole(response.data.user.role);
        authStore.setId(response.data.user.id);
        authStore.setName(response.data.user.name);
        authStore.setAvatar(response.data.user.avatar.url);
        authStore.setAvatarID(response.data.user.avatar.id);
      } else {
        toast.error("Senha ou usuário incorreto.");
      }
    } catch (error) {
      toast.error("Senha ou usuário incorreto.");
      stopLoading();
    }
  };

  return (
    <div className={S.auth__container}>
      <div className={S.auth__branding}>
        <div className={S.auth__branding__wrapper}>
          <h1>LENDAS PARTNERS</h1>
          <span>Your interactive business management tool.</span>
        </div>
      </div>
      <div className={S.auth__form}>
        <div className={S.auth__form__wrapper}>
          <div className={S.form__wrapper__title}>
            <h1>Entrar</h1>
          </div>
          <form className={S.form} onSubmit={handleSubmit(onSubmit)}>
            <label>Email: </label>
            <InputGroup>
              <Controller
                name="email"
                control={control}
                render={({ field }) => <Input {...field} />}
                rules={{ required: "Email is required" }}
              />
            </InputGroup>
            <div className={S.form__warn}>
              {errors.email && <span>{errors.email.message}</span>}
            </div>
            <label>Senha: </label>
            <InputGroup inside>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input type={visible ? "text" : "password"} {...field} />
                )}
                rules={{ required: "Password is required" }}
              />
              <InputGroup.Button onClick={handleChange}>
                {visible ? <EyeIcon /> : <EyeSlashIcon />}
              </InputGroup.Button>
            </InputGroup>
            <div className={S.form__warn}>
              {errors.password && <span>{errors.password.message}</span>}
            </div>
            <div className={S.auth__form__action}>
              <button>Entrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
