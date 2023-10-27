import React from "react";

import ProtectedRoute from "../../utils/protected.routes";
import CardInformation from "../../components/CardInformation";
import LayoutFragment from "../../layout/Layout";

import api from "../../services/api.service";
import S from "./home.module.scss";

import { useAuthStore } from "../../store/auth.store";
import { useQuery } from "react-query";

const HomePage: React.FC = () => {
  const userAuthStore = useAuthStore();
  const token = userAuthStore.getToken();
  const role = userAuthStore.getRole();

  const today = new Date();
  const formattedDate = `${today.getDate()}.${
    today.getMonth() + 1
  }.${today.getFullYear()}`;

  let data, blacklist, deposits_day, affiliates;
  let isLoading = false;

  if (role === "admin") {
    const { data: responseData, isLoading: responseIsLoading } = useQuery(
      "getGlobalStatistic",
      () => {
        return api
          .post(
            "dashboard",
            {
              dates: [
                {
                  from: formattedDate,
                  to: formattedDate,
                },
              ],
              isActive: true,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => response.data);
      },
      {
        refetchOnWindowFocus: false,
      }
    );

    data = responseData;
    isLoading = responseIsLoading;

    blacklist = data ? data[0].blacklistCount : 0;
    deposits_day = data ? data[0].withBlackList.deposit_amount : 0;
    affiliates = data ? data[0].withBlackList.signups : 0;
  }

  return (
    <>
      <LayoutFragment panelActive="1" pageName="Dashboard" openKey="1">
        <div className={S.statistic__container}>
          {role === "admin" && (
            <>
              <CardInformation
                title="DÉPOSITOS (HOJE)"
                description={deposits_day}
                icon="deposits"
                color="blue"
                isLoading={isLoading}
                type="currency"
              />
              <CardInformation
                title="CADASTROS (HOJE)"
                description={affiliates}
                icon="affiliates"
                color="orange"
                isLoading={isLoading}
                type="normal"
              />
              <CardInformation
                title="Blacklist"
                description={blacklist}
                icon="blacklist"
                color="orange"
                isLoading={isLoading}
                type="normal"
              />
            </>
          )}

          {role !== "admin" && (
            <>
              <CardInformation
                title="DÉPOSITOS (HOJE)"
                description={100}
                icon="deposits"
                color="blue"
                isLoading={false}
                type="currency"
              />
              <CardInformation
                title="CADASTROS (HOJE)"
                description={100}
                icon="affiliates"
                color="orange"
                isLoading={false}
                type="normal"
              />
              <CardInformation
                title="Blacklist"
                description={100}
                icon="blacklist"
                color="orange"
                isLoading={false}
                type="normal"
              />
            </>
          )}
        </div>
      </LayoutFragment>
    </>
  );
};

export default ProtectedRoute(HomePage);
