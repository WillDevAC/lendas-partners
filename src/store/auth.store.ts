import create from "zustand";
import Cookies from "js-cookie";

interface AuthState {
  id: string | null;
  name: string | null;
  token: string | null;
  role: string | null;
  avatar: string | null;
  avatarID: string | null;
  
  setId: (id: string) => void;
  setName: (name: string) => void;
  setToken: (token: string) => void;
  setRole: (role: string) => void;
  setAvatar: (avatar: string) => void;
  setAvatarID: (avatarID: string) => void;

  getToken: () => string | null;
  getName: () => string | null;
  getRole: () => string | null;
  getId: () => string | null;
  getAvatar: () => string | null;
  getAvatarID: () => string | null;

  logout: () => void;
}

const setTokenInCookie = (token: string) => {
  Cookies.set("@TOKEN_AUTH", token, { expires: 1 });
};

const setNameInCookie = (name: string) => {
  Cookies.set("@NAME_AUTH", name, { expires: 1 });
};

const setRoleInCookie = (role: string) => {
  Cookies.set("@ROLE_AUTH", role, { expires: 1 });
};

const setIdInCookie = (id: string) => {
  Cookies.set("@ID_AUTH", id, { expires: 1 });
};

const setAvatarInCookie = (avatar: string) => {
  Cookies.set("@AVATAR_AUTH", avatar, { expires: 1 });
};

const setAvatarIDInCookie = (avatarID: string) => {
  Cookies.set("@AVATAR_AUTH_ID", avatarID, { expires: 1 });
};

const removeTokenFromCookie = () => {
  Cookies.remove("@TOKEN_AUTH");
};

const removeEmailFromCookie = () => {
  Cookies.remove("@NAME_AUTH");
};

const removeRoleFromCookie = () => {
  Cookies.remove("@ROLE_AUTH");
};

const removeIdFromCookie = () => {
  Cookies.remove("@ID_AUTH");
};

const RemoveAvatarInCookie = () => {
  Cookies.remove("@AVATAR_AUTH");
};

const RemoveAvatarIDInCookie = () => {
  Cookies.remove("@AVATAR_AUTH_ID");
};

export const useAuthStore = create<AuthState>((set) => ({
  id: Cookies.get("@ID_AUTH") || null,
  token: Cookies.get("@TOKEN_AUTH") || null,
  role: Cookies.get("@ROLE_AUTH") || null,
  avatar: Cookies.get("@AVATAR_AUTH") || null,
  avatarID: Cookies.get("@AVATAR_AUTH_ID") || null,
  name: Cookies.get("@NAME_AUTH") || null,

  setToken: (token) => {
    set({ token });
    setTokenInCookie(token);
  },

  setName: (name) => {
    set({ name });
    setNameInCookie(name);
  },

  setRole: (role) => {
    set({ role });
    setRoleInCookie(role);
  },

  setId: (id) => {
    set({ id });
    setIdInCookie(id);
  },

  setAvatar: (avatar) => {
    set({ avatar });
    setAvatarInCookie(avatar);
  },

  setAvatarID: (avatarID) => {
    set({ avatarID });
    setAvatarIDInCookie(avatarID);
  },

  logout: () => {
    removeTokenFromCookie();
    removeRoleFromCookie();
    removeIdFromCookie();
    RemoveAvatarInCookie();
    RemoveAvatarIDInCookie();
    removeEmailFromCookie();
    
    set({ token: null });
    set({ role: null });
    set({ id: null });
    set({ avatar: null });
    set({ avatarID: null });
    set({ name: null });
  },

  getToken: () => Cookies.get("@TOKEN_AUTH") || null,
  getId: () => Cookies.get("@ID_AUTH") || null,
  getRole: () => Cookies.get("@ROLE_AUTH") || null,
  getAvatar: () => Cookies.get("@AVATAR_AUTH") || null,
  getAvatarID: () => Cookies.get("@AVATAR_AUTH_ID") || null,
  getName: () => Cookies.get("@NAME_AUTH") || null,
}));