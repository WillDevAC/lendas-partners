import React, { useState } from "react";

import { Table, Button, Loader, Pagination } from "rsuite";

import { useAuthStore } from "../../store/auth.store";
import { useQuery } from "react-query";

const { Column, HeaderCell, Cell } = Table;

import api from "../../services/api.service";

import S from "./table_blacklist.module.scss";
import useModalStore from "../../store/modal.store";

interface ITableBlacklist {
  id: string;
  code: string;
  name: string;
  reg_date: string;
  createdAt: string;
  updatedAt: string;
}

const TableBlacklist: React.FC = () => {
  const authStore = useAuthStore();
  const token = authStore.getToken();

  const modalStore = useModalStore();

  const [blacklist, setBlacklist] = useState<ITableBlacklist[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const totalItems = useQuery(
    "getBlacklistTotal",
    async () => {
      const response = await api.get(`/blacklist?skip=1&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.count;
    },
    {
      enabled: !!token,
    }
  );

  const { isLoading } = useQuery(
    ["getBlacklist", page, pageSize],
    async () => {
      const response = await api.get(
        `/blacklist?skip=${(page - 1) * pageSize}&limit=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBlacklist(response.data.blacklist);
    },
    {
      enabled: !!token,
    }
  );

  const handlePageChange = (eventKey: string | number) => {
    setPage(Number(eventKey));
  };

  return (
    <>
      {isLoading ? (
        <Loader speed="normal" content="Carregando blacklist..." />
      ) : (
        <>
          <Table height={500} data={blacklist}>
            <Column flexGrow={1}>
              <HeaderCell>UUID</HeaderCell>
              <Cell dataKey="id" />
            </Column>

            <Column flexGrow={1}>
              <HeaderCell>Nome do afiliado</HeaderCell>
              <Cell dataKey="name" />
            </Column>

            <Column flexGrow={1}>
              <HeaderCell>Code</HeaderCell>
              <Cell dataKey="code" />
            </Column>

            <Column width={120} fixed="right">
              <HeaderCell>Ações</HeaderCell>

              <Cell style={{ padding: "6px" }}>
                {(rowData) => (
                  <Button
                    appearance="link"
                    onClick={() =>
                      modalStore.openModal(rowData.id, "exclude_blacklist")
                    }
                  >
                    Excluir
                  </Button>
                )}
              </Cell>
            </Column>
          </Table>
        </>
      )}
      <div className={S.pagination__container}>
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          pages={Math.ceil(totalItems.data / pageSize)}
          activePage={page}
          onSelect={handlePageChange}
          size="md"
          maxButtons={5}
          onChangePage={handlePageChange}
          total={totalItems.data}
        />
      </div>
    </>
  );
};

export default TableBlacklist;
