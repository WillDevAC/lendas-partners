import React, { useState } from "react";
import { Button, ButtonToolbar, Drawer, Form, IconButton } from "rsuite";
import { useMutation, useQueryClient } from "react-query";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

import PlusIcon from "@rsuite/icons/Plus";

import S from "./drawer_new_blacklist.module.scss";
import api from "../../services/api.service";
import { useAuthStore } from "../../store/auth.store";
import useLoadingStore from "../../store/loading.store";

type Affiliate = {
  code: string;
  name: string;
};

const DrawerNewBlacklist: React.FC = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const authStore = useAuthStore();
  const token = authStore.getToken();

  const loadingStore = useLoadingStore();

  const { control, handleSubmit, reset } = useForm<Affiliate>({
    defaultValues: {
      code: "",
      name: "",
    },
  });

  const addAffiliate = useMutation(
    (newAffiliate: Affiliate) => {
      return api.post("/blacklist", newAffiliate, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("getBlacklist");
        loadingStore.stopLoading();
        toast.success("Afiliado adicionado à blacklist.");
        reset();
      },
      onError: () => {
        loadingStore.stopLoading();
        toast.error("Falha em adicionar afiliado à blacklist.");
      },
    }
  );

  const onSubmit = handleSubmit(async (data: Affiliate) => {
    if (!data.code || !data.name) {
      toast.error("Os campos são obrigatórios.");
      return;
    }

    setOpen(false);
    loadingStore.startLoading();
    addAffiliate.mutate(data);
  });

  return (
    <>
      <ButtonToolbar>
        <IconButton
          icon={<PlusIcon />}
          onClick={() => setOpen(true)}
          appearance="primary"
          color="violet"
        >
          Novo afiliado
        </IconButton>
      </ButtonToolbar>

      <Drawer
        placement={"left"}
        open={open}
        onClose={() => setOpen(false)}
        size="xs"
      >
        <Drawer.Header>
          <Drawer.Title>ADICIONAR NOVO</Drawer.Title>
          <Drawer.Actions>
            <Button onClick={() => setOpen(false)}>Fechar</Button>
            <Button onClick={onSubmit} appearance="primary" color="green">
              Adicionar
            </Button>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
          <Form>
            <Form.Group controlId="code">
              <Form.ControlLabel>ID do afiliado: </Form.ControlLabel>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="number"
                    min="0"
                    name="code"
                    className={S.outline}
                  />
                )}
              />
              <Form.HelpText>ID é um campo obrigatório.</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="name" className={S.outline}>
              <Form.ControlLabel>Nome do afiliado: </Form.ControlLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Form.Control {...field} name="name" type="text" />
                )}
              />
              <Form.HelpText>Nome é um campo obrigatório.</Form.HelpText>
            </Form.Group>
          </Form>
        </Drawer.Body>
      </Drawer>
    </>
  );
};

export default DrawerNewBlacklist;
