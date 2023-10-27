import React from "react";

import LayoutFragment from "../../layout/Layout";

import S from "./bot.module.scss";
import CardBot from "../../components/CardBot";

const BotsPage: React.FC = () => {
  return (
    <LayoutFragment panelActive="3-3" pageName="Grupo de sinais" openKey="3">
      <div className={S.bot__container}>
        <CardBot image="../../aviator.jpeg" name="AVIATOR" status="OFFLINE"/>
        <CardBot image="../../mines.jpeg" name="MINES" status="ONLINE"/>
        <CardBot image="../../spaceman.jpeg" name="SPACEMAN" status="ONLINE"/>
        <CardBot image="../../fortunetiger.jpeg" name="FORTUNE TIGER" status="ONLINE"/>
        <CardBot image="../../bacbo.jpeg" name="BAC BO" status="ONLINE"/>
        <CardBot image="../../penaltyshoot.jpeg" name="PENALTY SHOOT" status="ONLINE"/>
        <CardBot image="../../roleta.jpeg" name="ROLETA" status="ONLINE"/>
      </div>
    </LayoutFragment>
  );
};

export default BotsPage;
