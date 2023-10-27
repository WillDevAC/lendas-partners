import React, { useEffect } from "react";
import Rodal from "rodal";
import S from "./confirm_modal.module.scss";
import useModalStore from "../../store/modal.store";
import { useAuthStore } from "../../store/auth.store";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";

import api from "../../services/api.service";
import useLoadingStore from "../../store/loading.store";

const ConfirmModal: React.FC = () => {
  const authStore = useAuthStore();
  const token = authStore.getToken();
  const queryClient = useQueryClient();
  const loadingStore = useLoadingStore();

  const { isModalOpen, closeModal, userIdAcceptOrDeny, type } = useModalStore();

  const mutationAccept = useMutation(
    () => {
      closeModal();
      toast.info('Aceitando...', {
        autoClose: false, 
        closeOnClick: false,
        closeButton: false
      });
      return api.post(
        `/approve-affiliate/${userIdAcceptOrDeny}`,
        {code: userIdAcceptOrDeny},
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    {
      onSuccess: () => {
        toast.dismiss();
        queryClient.invalidateQueries("affiliatesPending");
        toast.success("Afiliado aprovado com sucesso!");
      },
      onError: () => {
        toast.dismiss();
        toast.error("Falha em aprovar o afiliado");
      },
    }
  );

  const mutationRecuse = useMutation(
    () => {
      closeModal();
      toast.info('Aceitando...', {
        autoClose: false, 
        closeOnClick: false,
        closeButton: false
      });
      return api.post(
        `/reject-affiliate/${userIdAcceptOrDeny}`,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    {
      onSuccess: () => {
        toast.dismiss();
        queryClient.invalidateQueries("affiliatesPending");
        toast.success("Afiliado recusado com sucesso!");
      },
      onError: () => {
        toast.dismiss();
        toast.error("Falha em recusar o afiliado");
      },
    }
  );

  const mutationExcludeBlacklist = useMutation(
    () => {
      closeModal();
      loadingStore.startLoading();
      return api.delete(`/blacklist/${userIdAcceptOrDeny}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    {
      onSuccess: () => {
        loadingStore.stopLoading();
        queryClient.invalidateQueries("getBlacklist");
        toast.success("Afiliado excluido da blacklist!");
      },
      onError: () => {
        loadingStore.stopLoading();
        toast.error("Falha em excluir afiliado da blacklist.");
      },
    }
  );

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isModalOpen]);

  const handleAccept = () => {
    if (userIdAcceptOrDeny && type === "accept") {
      mutationAccept.mutate();
      return;
    }

    if (userIdAcceptOrDeny && type === "recuse") {
      mutationRecuse.mutate();
    }

    if (userIdAcceptOrDeny && type === "exclude_blacklist") {
      mutationExcludeBlacklist.mutate();
    }
  };

  return (
    <div>
      <Rodal
        visible={isModalOpen}
        onClose={closeModal}
        className={S.custom_modal}
      >
        <div className={S.modal_content}>
          <h3>Deseja realmente fazer isso? </h3>
          <div className={S.modal__actions}>
            <button onClick={handleAccept}>Sim, confirmo</button>
            <button onClick={closeModal}>Não, voltar atrás</button>
          </div>
        </div>
      </Rodal>
    </div>
  );
};

export default ConfirmModal;
