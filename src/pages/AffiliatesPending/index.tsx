import React, { useState } from "react";

import { Loader } from "rsuite";
import { useQuery } from "react-query";
import { useAuthStore } from "../../store/auth.store";

import S from "./affiliates_pending.module.scss";

import ArrowLeftLineIcon from "@rsuite/icons/ArrowLeftLine";
import ArrowRightLineIcon from "@rsuite/icons/ArrowRightLine";
import CardAffiliatePending from "../../components/CardAffiliatePending";

import LayoutFragment from "../../layout";

import api from "../../services/api.service";
import ProtectedComponent from "../../utils/protected.routes";

interface AffiliateData {
  username: string;
  parent_id: string;
  status: { text: string };
  websites: string;
  aff_id: string;
}

const AffiliatesPendingPage: React.FC = () => {
  const authStore = useAuthStore();
  const token = authStore.getToken();

  const [skip, setSkip] = useState(1);

  const [totalRecords, setTotalRecords] = useState(0);
  const [pages, setPages] = useState(0);

  const limit = 8;

  const fetchData = async (skip: number, limit: number) => {
    try {
      const response = await api.post(
        `/dashboard-pending?page=${skip}&limit=${limit}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTotalRecords(response.data.count);
      setPages(Math.round(totalRecords / limit));
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  const { data, isLoading, isError } = useQuery<AffiliateData[], Error>(
    ["affiliatesPending", skip, limit],
    () => fetchData(skip, limit)
  );

  const handlePageChange = (newPage: number) => {
    setSkip(newPage);
  };


  return (
    <>
      <LayoutFragment
        panelActive="3-1"
        pageName="Afiliados Pendentes"
        openKey="3"
      >
        <div className={S.affiliates__pending__paginate}>
          <div className={S.affiliates__pending__arrows}>
            <button
              className={S.affiliates__pending__prev}
              title="Resultados anteriores"
              disabled={skip === 1}
              onClick={() => handlePageChange(skip - 1)}
            >
              <ArrowLeftLineIcon />
            </button>
            <button
              title="Próximos resultados"
              onClick={() => handlePageChange(skip + 1)}
              className={S.affiliates__pending__next}
              disabled={skip === pages}
            >
              <ArrowRightLineIcon />
            </button>
          </div>
        </div>
        <div className={S.affiliates__pending__container}>
          {isLoading ? (
            <Loader speed="normal" content="Listando afiliados..." />
          ) : isError ? (
            <p>Ocorreu um erro ao buscar os dados.</p>
          ) : data && data.length === 0 ? (
            <p>Sem resultados.</p>
          ) : (
            data?.map((item, index) => (
              <CardAffiliatePending
                key={index}
                user={item.username}
                parentID={item.parent_id}
                status={item.status.text}
                website={item.websites}
                aff_id={item.aff_id}
              />
            ))
          )}
        </div>
      </LayoutFragment>
    </>
  );
};

export default ProtectedComponent(AffiliatesPendingPage);
