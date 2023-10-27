import React from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import S from "../layout/styles.module.scss";

import BreadcrumbComponent from "../components/Breadcrumb";

interface ILayoutProps {
  children: React.ReactNode;
  pageName: string;
  panelActive: string;
  openKey: string;
}

const LayoutFragment: React.FC<ILayoutProps> = ({
  children,
  pageName,
  panelActive,
  openKey,
}) => {
  return (
    <>
      <div className={S.container}>
        <div className={S.wrapper}>
          <aside className={S.sidebar}>
            <Sidebar panelActive={panelActive} defaultOpenKey={openKey} />
          </aside>
          <main className={S.main}>
            <Header />
            <div className={S.content}>
              <h1>{pageName}</h1>
              <BreadcrumbComponent />
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default LayoutFragment;
