import React from "react";

import S from "./SideNavbar.module.scss";

import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import SentToUserIcon from "@rsuite/icons/SentToUser";
import WavePointIcon from "@rsuite/icons/WavePoint";
import BlockIcon from "@rsuite/icons/Block";

import { Sidenav, Nav } from "rsuite";
import { IPageActiveProps } from "../../@types/router.types";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { toast } from "react-toastify";

const SideNavbar: React.FC<IPageActiveProps> = ({
  panelActive,
  defaultOpenKey,
}) => {

  const navigate = useNavigate();
  const authStore = useAuthStore();

  return (
    <Sidenav defaultOpenKeys={[defaultOpenKey]}>
      <Sidenav.Body>
        <Nav activeKey={panelActive}>
          <Nav.Item panel className={S.nav__info}>
            RELATÓRIOS
          </Nav.Item>
          <Nav.Item
            eventKey="1"
            icon={<DashboardIcon />}
            onClick={() => navigate("/dashboard", { replace: true })}
          >
            Dashboard
          </Nav.Item>
          <Nav.Item
            eventKey="2"
            icon={<WavePointIcon />}
            onClick={() =>
              navigate("/affiliates/indicators", { replace: true })
            }
          >
            Indicadores
          </Nav.Item>
          <Nav.Item panel className={S.nav__info}>
            GESTÃO INTERATIVA
          </Nav.Item>
          <Nav.Menu eventKey="3" title="Afiliados" icon={<SentToUserIcon />}>
            <Nav.Item
              eventKey="3-1"
              onClick={() => navigate("/affiliates/pending", { replace: true })}
            >
              Aprovação
            </Nav.Item>
            <Nav.Item
              eventKey="3-2"
              onClick={() => navigate("/affiliates/blacklist", { replace: true })}
            >
              Blacklist
            </Nav.Item>
            <Nav.Item
              eventKey="3-3"
              onClick={() => navigate("/affiliates/bots/", { replace: true })}
            >
              Grupo de sinais
            </Nav.Item>
            <Nav.Item
              eventKey="3-4"
              onClick={() => toast.warn('Funcionalidade em manuntenção.')}
            >
              Ranking
            </Nav.Item>
          </Nav.Menu>
          <Nav.Item panel className={S.nav__info}>
            OUTROS
          </Nav.Item>
          <Nav.Item
            eventKey="5"
            icon={<BlockIcon />}
            onClick={ async () => {
              await authStore.logout();
              navigate("/", { replace: true })
            }}
          >
            Desconectar
          </Nav.Item>
        </Nav>
      </Sidenav.Body>
    </Sidenav>
  );
};

export default SideNavbar;
