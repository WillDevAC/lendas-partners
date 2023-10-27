import React from "react";

import S from "./card_affiliate_pending.module.scss";

import CheckIcon from "@rsuite/icons/Check";
import PinIcon from "@rsuite/icons/Pin";
import CloseIcon from "@rsuite/icons/Close";

import UserIcon from "@rsuite/icons/legacy/User";
import useModalStore from "../../store/modal.store";

import { Avatar, IconButton } from "rsuite";

interface ICardAffiliatePending {
  user: string;
  website: string;
  parentID: string;
  status: string;
  aff_id: string;
}

const CardAffiliatePending: React.FC<ICardAffiliatePending> = ({
  user,
  website,
  parentID,
  status,
  aff_id,
}) => {
  const navigateURL = (path: string) => {
    window.open(path, "_blank");
  };

  const modalStore = useModalStore();

  return (
    <>
      <div className={S.affiliates__pending__card}>
        <div className={S.affiliates__pending__profile}>
          <Avatar size="lg" style={{ width: "100px", height: "100px" }}>
            <UserIcon />
          </Avatar>
        </div>
        <div className={S.affiliates__pending__information}>
          <div className={S.wrapper__information}>
            <div className={S.info}>
              <p>Parent ID</p>
              <span>#{parentID || "Nenhum"} </span>
            </div>
            <div className={S.info}>
              <p>Usuário</p>
              <span>{user || "Nenhum"} </span>
            </div>
          </div>
        </div>
        <div className={S.affiliates__action}>
          <IconButton
            icon={<PinIcon />}
            onClick={() => navigateURL(website)}
            appearance="primary"
            color="violet"
          >
            Website
          </IconButton>
          <IconButton
            icon={<CheckIcon />}
            onClick={() => modalStore.openModal(aff_id, "accept")}
            appearance="primary"
            color="green"
          >
            Aceitar
          </IconButton>
          <IconButton
            icon={<CloseIcon />}
            onClick={() => modalStore.openModal(aff_id, "recuse")}
            appearance="primary"
            color="red"
          >
            Recusar
          </IconButton>
        </div>
        <div className={S.affiliates__status}>
          <span>{status}</span>
        </div>
      </div>
    </>
  );
};

export default CardAffiliatePending;
