import React from "react";
import S from "./card_information.module.scss";
import PeoplesIcon from "@rsuite/icons/Peoples";
import RemindOutlineIcon from "@rsuite/icons/RemindOutline";
import TrendIcon from "@rsuite/icons/Trend";
import { Loader } from "rsuite";
import { useAuthStore } from "../../store/auth.store";

interface ICardInformation {
  title: string;
  description: number;
  isLoading: boolean;
  icon: "affiliates" | "blacklist" | "deposits";
  color: "blue" | "orange" | "cyan";
  type: "normal" | "currency";
}

const CardInformation: React.FC<ICardInformation> = ({
  title,
  description,
  icon,
  color,
  isLoading,
  type,
}) => {
  const authStore = useAuthStore();
  const role = authStore.getRole();

  const isCensored = true;

  const formatDescription = (description: number, type: string) => {
    if (type === "currency") {
      let valueFormatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(description);

      return valueFormatted;
    }
    return description;
  };

  let formattedDescription = formatDescription(description, type);

  const sensoredStyle: React.CSSProperties = {
    filter: "blur(5px)",
    userSelect: "none",
  };

  return (
    <>
      <div className={S.statistic__card}>
        <div className={S.statistic__card__information}>
          <div className={S.statistic__card__icon} id={S[color]}>
            {icon === "affiliates" && <PeoplesIcon />}
            {icon === "blacklist" && <RemindOutlineIcon />}
            {icon === "deposits" && <TrendIcon />}
          </div>
          <div className={S.statistic__card__info}>
            <p>{title}</p>
            {isLoading ? (
              <Loader speed="normal" />
            ) : (
              <>
                {role === "admin" && <span>{formattedDescription}</span>}
                {role !== "admin" && (
                  <span style={sensoredStyle}>R$ 0.000.000</span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CardInformation;
