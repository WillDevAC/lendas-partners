import React from "react";
import api from "../../services/api.service";

import LayoutFragment from "../../layout/Layout";
import CardInformation from "../../components/CardInformation";
import IndicatorsCharts from "../../components/IndicatorsCharts";

import S from "./indicators.module.scss";

import { useQuery } from "react-query";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";

import { startOfMonth, addDays, format, endOfMonth } from "date-fns";

import ProtectedComponent from "../../utils/protected.routes";

// Função para buscar dados da API
const fetchData = async (token: any) => {
  try {
    const today = new Date();
    const currentMonthStart = startOfMonth(today);
    const currentMonthEnd = endOfMonth(today);
    const dates = [];

    // Primeira faixa (01 a 09)
    dates.push({
      from: format(currentMonthStart, "dd.MM.yyyy"),
      to: format(addDays(currentMonthStart, 8), "dd.MM.yyyy"),
    });

    // Segunda faixa (10 a 16)
    dates.push({
      from: format(addDays(currentMonthStart, 9), "dd.MM.yyyy"),
      to: format(addDays(currentMonthStart, 15), "dd.MM.yyyy"),
    });

    // Terceira faixa (17 a 23)
    dates.push({
      from: format(addDays(currentMonthStart, 16), "dd.MM.yyyy"),
      to: format(addDays(currentMonthStart, 22), "dd.MM.yyyy"),
    });

    // Quarta faixa (24 a 31)
    dates.push({
      from: format(addDays(currentMonthStart, 23), "dd.MM.yyyy"),
      to: format(currentMonthEnd, "dd.MM.yyyy"),
    });

    const response = await api.post(
      "dashboard",
      {
        dates,
        isActive: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Falha ao obter dados do mês.");
  }
};

// Função para somar depósitos
const sumDeposits = (data: WeekData[]) => {
  return data.reduce(
    (totals, weekData) => {
      totals.totalDepositsWithBlacklist +=
        weekData.withBlackList.deposit_amount;
      totals.totalDepositsWithoutBlacklist +=
        weekData.withoutBlackList.deposit_amount;
      totals.totalSignupsWithBlacklist += weekData.withBlackList.signups;
      totals.totalSignupsWithoutBlacklist += weekData.withoutBlackList.signups;
      return totals;
    },
    {
      totalDepositsWithBlacklist: 0,
      totalDepositsWithoutBlacklist: 0,
      totalSignupsWithBlacklist: 0,
      totalSignupsWithoutBlacklist: 0,
    }
  );
};

interface WeekData {
  withBlackList: {
    deposit_amount: number;
    signups: number;
  };
  withoutBlackList: {
    deposit_amount: number;
    signups: number;
  };
}

const IndicatorsPage: React.FC = () => {
  const role = useAuthStore().getRole();
  const token = useAuthStore().getToken();
  const navigate = useNavigate();

  if (role === "admin") {
    const { data, isError, isLoading } = useQuery(
      "getMonthsStatistics",
      () => fetchData(token),
      {
        enabled: !!token,
      }
    );

    if (isError) {
      navigate("/", { replace: true });
    }

    const {
      totalDepositsWithBlacklist,
      totalDepositsWithoutBlacklist,
      totalSignupsWithBlacklist,
      totalSignupsWithoutBlacklist,
    } = sumDeposits(data || []);

    return (
      <LayoutFragment pageName="Indicadores" panelActive="2" openKey="2">
        <div className={S.indicators}>
          <CardInformation
            color="blue"
            title="Dépositos"
            description={totalDepositsWithoutBlacklist}
            icon="deposits"
            isLoading={isLoading}
            type="currency"
          />
          <CardInformation
            color="blue"
            title="Dépositos (Blacklist)"
            description={totalDepositsWithBlacklist}
            icon="deposits"
            isLoading={isLoading}
            type="currency"
          />
          <CardInformation
            color="orange"
            title="Cadastros"
            description={totalSignupsWithoutBlacklist}
            icon="affiliates"
            isLoading={isLoading}
            type="normal"
          />
          <CardInformation
            color="orange"
            title="Cadastros (Blacklist)"
            description={totalSignupsWithBlacklist}
            icon="affiliates"
            isLoading={isLoading}
            type="normal"
          />
        </div>
        {role === "admin" && (
          <>
            <IndicatorsCharts data={data} type="deposits" />
            <IndicatorsCharts data={data} type="registers" />
          </>
        )}
      </LayoutFragment>
    );
  } else {
    return (
      <LayoutFragment pageName="Indicadores" panelActive="2" openKey="2">
        <div className={S.indicators}>
          <CardInformation
            color="blue"
            title="Dépositos"
            description={0}
            icon="deposits"
            isLoading={false}
            type="currency"
          />
          <CardInformation
            color="blue"
            title="Dépositos (Blacklist)"
            description={0}
            icon="deposits"
            isLoading={false}
            type="currency"
          />
          <CardInformation
            color="orange"
            title="Cadastros"
            description={0}
            icon="affiliates"
            isLoading={false}
            type="normal"
          />
          <CardInformation
            color="orange"
            title="Cadastros (Blacklist)"
            description={0}
            icon="affiliates"
            isLoading={false}
            type="normal"
          />
        </div>
      </LayoutFragment>
    );
  }
};

export default ProtectedComponent(IndicatorsPage);
