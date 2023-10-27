import React from "react";

import S from "./Header.module.scss";

import MenuIcon from "@rsuite/icons/Menu";

const Header: React.FC = () => {
  return (
    <header className={S.header}>
      <div className={S.header__logo}>
        <img src="../logo.svg" alt="Website Logo" />
      </div>
      <div className={S.header__profile}>
        <ul className={S.header__links}>
          <li className={S.header__link}>
            <a href="#">
              <MenuIcon color="#a4a9af" />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
