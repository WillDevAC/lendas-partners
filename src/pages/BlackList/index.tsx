import React from "react";

import LayoutFragment from "../../layout";
import TableBlacklist from "../../components/TableBlacklist";

import S from "./blacklist.module.scss";

import DrawerNewBlacklist from "../../components/DrawerNewBlacklist";
import ProtectedComponent from "../../utils/protected.routes";

const BlacklistPage: React.FC = () => {
  return (
    <LayoutFragment panelActive="3-2" pageName="Blacklist" openKey="3">
      <div className={S.container__action}>
        <DrawerNewBlacklist />
      </div>
      <TableBlacklist />
    </LayoutFragment>
  );
};

export default ProtectedComponent(BlacklistPage);
