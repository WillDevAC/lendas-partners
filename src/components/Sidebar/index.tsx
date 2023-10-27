import React, { useRef } from "react";

import S from "./Sidebar.module.scss";

import { Avatar, Progress, Tag, TagGroup } from "rsuite";
import { useAuthStore } from "../../store/auth.store";

import SideNavbar from "../SideNavbar";
import api from "../../services/api.service";
import { toast } from "react-toastify";
import useLoadingStore from "../../store/loading.store";

interface SidebarProps {
  panelActive: string;
  defaultOpenKey: string;
}

const Sidebar: React.FC<SidebarProps> = ({ panelActive, defaultOpenKey }) => {
  const authStore = useAuthStore();
  const loadingStore = useLoadingStore();

  const avatar: string = authStore.getAvatar() || "#";
  
  const token = authStore.getToken();
  const role = authStore.getRole();
  const name = authStore.getName();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = async (data: any) => {
    loadingStore.startLoading();
    try {
      const formData = new FormData();
      formData.append("file", data.image);

      await api
        .post("/image/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async (response) => {
          await api
            .put(
              `/user/me`,
              {
                avatar: response.data.id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then(() => {
              toast.success("Avatar atualizado com sucesso!");
              loadingStore.stopLoading();
              authStore.setAvatar(response.data.url);
              authStore.setAvatarID(response.data.id);
            });
        });
    } catch (error) {
      loadingStore.stopLoading();
      toast.error("Falha em atualizar a imagem.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      onSubmit({ image: selectedFile });
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={S.sidebar__content}>
      <div className={S.sidebar__branding}>
        <img src="../../logo.svg" alt="Website Logo" className={S.logotipo} />
      </div>
      <div className={S.sidebar__profile}>
        <Avatar
          circle
          src={avatar}
          className={S.avatar__profile}
          onClick={handleAvatarClick}
        />
        <TagGroup className={S.sidebar__tags}>
          {role !== "admin" && <Tag color="orange">COLABORADOR</Tag>}

          {role === "admin" && <Tag color="orange">{role}</Tag>}

          <Tag color="violet">{name}</Tag>
        </TagGroup>
        <input
          ref={fileInputRef}
          type="file"
          id="imageUpload"
          style={{ display: "none" }}
          onChange={handleImageChange}
          accept=".jpg, .jpeg, .png"
        />
      </div>
      <div className={S.sidenav__content}>
        <SideNavbar panelActive={panelActive} defaultOpenKey={defaultOpenKey} />
      </div>
    </div>
  );
};

export default Sidebar;
