import React, { useState } from "react";
import PlusIcon from "@rsuite/icons/Plus";
import CloseIcon from "@rsuite/icons/Close";
import FileDownloadIcon from "@rsuite/icons/FileDownload";
import {
  IconButton,
  Drawer,
  Form,
  ButtonToolbar,
  Button,
  DatePicker,
  Divider,
} from "rsuite";
import S from "./card_bot.module.scss";
import axios from "axios";
import { toast } from "react-toastify";
import useLoadingStore from "../../store/loading.store";

import { jsPDF } from "jspdf";

interface ICardBotProps {
  image: string;
  name: string;
  status: string;
}

const CardBot: React.FC<ICardBotProps> = ({ image, name, status }) => {
  const [action, setAction] = useState<string | null>(null);

  const loadingStore = useLoadingStore();

  const [formData, setFormData] = useState({
    idgroup: "",
    name: "",
    affiliatelink: "",
    startTime: null,
    endTime: null,
  });

  const openDrawer = (action: string) => {
    setAction(action);
  };

  const closeDrawer = () => {
    setAction(null);
    setFormData({
      idgroup: "",
      name: "",
      affiliatelink: "",
      startTime: null,
      endTime: null,
    });
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRemove = () => {
    if (formData.idgroup === "") {
      toast.error("Preencha os dados.");
      return;
    }

    loadingStore.startLoading();

    try {
      axios
        .post("https://fraternidadesim.com/api/exclude_bot.php", {
          id_group: formData.idgroup,
        })
        .then((response) => {
          if (response.data.success === true) {
            closeDrawer();
            loadingStore.stopLoading();
            toast.success("Grupo removido com sucesso.");
          } else if (response.data.success == 500) {
            closeDrawer();
            loadingStore.stopLoading();
            toast.info("Não existe esse grupo.");
          } else {
            closeDrawer();
            loadingStore.stopLoading();
            toast.error("Falha em remover o grupo.");
          }
        });
    } catch (error) {
      closeDrawer();
      loadingStore.stopLoading();
      toast.error("Falha em adicionar novo grupo.");
    }
  };

  const handleSubmit = () => {
    if (
      formData.idgroup === "" ||
      formData.affiliatelink === "" ||
      formData.name === "" ||
      formData.startTime === null ||
      formData.endTime === null
    ) {
      toast.error("Preencha os dados.");
      return;
    }

    loadingStore.startLoading();

    try {
      axios
        .post("https://fraternidadesim.com/api/new_bot.php", {
          bot_name: name,
          id_group: formData.idgroup,
          name_affiliate: formData.name,
          link_affiliate: formData.affiliatelink,
          start: formData.startTime,
          finish: formData.endTime,
        })
        .then((response) => {
          if (response.data.success === true) {
            closeDrawer();
            loadingStore.stopLoading();
            toast.success("Grupo adicionado com sucesso.");
          } else {
            closeDrawer();
            loadingStore.stopLoading();
            toast.error("Falha em adicionar novo grupo.");
          }
        });
    } catch (error) {
      closeDrawer();
      loadingStore.stopLoading();
      toast.error("Falha em adicionar novo grupo.");
    }
  };

  const generateReport = (botName: string) => {
    axios
      .post("https://fraternidadesim.com/api/showIndividual.php", {
        name: botName,
      })
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const data = response.data;
  
          const doc = new jsPDF();
  
          const itemsPerPage = 5;
          let currentPage = 1;
          let yPosition = 20;
  
          const generateHeader = () => {
            doc.setFontSize(18);
            doc.text(`Relatório de grupos: LENDAS ${botName} - Página ${currentPage}`, 10, 10);
          };
  
          const addNewPage = () => {
            doc.addPage();
            currentPage++;
            yPosition = 20;
            generateHeader();
          };
  
          generateHeader();
  
          for (let i = 0; i < data.length; i++) {
            if (i % itemsPerPage === 0 && i !== 0) {
              addNewPage();
            }
  
            const item = data[i];
  
            doc.setFontSize(12);
            doc.text("ID: " + item.id, 10, yPosition);
            yPosition += 10;
            doc.text("ID do Grupo: " + item.id_group, 10, yPosition);
            yPosition += 10;
            doc.text("Nome do Afiliado: " + item.name_affiliate, 10, yPosition);
            yPosition += 10;
            doc.text("Link de Afiliado: " + item.link_affiliate, 10, yPosition);
            yPosition += 10;
            doc.text("Hora de Início de Envio: " + item.start_send, 10, yPosition);
            yPosition += 10;
            doc.text("Hora de Fim de Envio: " + item.finish_send, 10, yPosition);
            yPosition += 20;
  
            if (i < data.length - 1) {
              doc.line(10, yPosition, 200, yPosition);
              yPosition += 10;
            }
          }
  
          doc.save("relatorio.pdf");
        } else {
          toast.info("Não há grupos cadastrados.");
        }
      });
  };
  

  return (
    <div className={S.bot__card}>
      <div className={S.bot__profile}>
        <img src={image} alt="#" />
      </div>
      <div className={S.bot__informations}>
        <div className={S.bot__information__group}>
          <p>NOME DO BOT: </p>
          <span>{name}</span>
        </div>
        <div className={S.bot__information__group}>
          <p>STATUS</p>
          {status === "ONLINE" && <span>{status}</span>}
          {status === "OFFLINE" && <span className={S.offline}>{status}</span>}
        </div>
        <div className={S.bot__actions__group}>
          <IconButton
            icon={<PlusIcon />}
            onClick={() => {
              if (status === "OFFLINE") {
                toast.warn("Grupo em manuntenção.");
                return;
              }

              openDrawer("Adicionar");
            }}
            appearance="primary"
            color="green"
          >
            Novo grupo
          </IconButton>
          <IconButton
            icon={<CloseIcon />}
            onClick={() => {
              if (status === "OFFLINE") {
                toast.warn("Grupo em manuntenção.");
                return;
              }

              openDrawer("Remover");
            }}
            appearance="primary"
            color="red"
          >
            Remover grupo
          </IconButton>
          <IconButton
            icon={<FileDownloadIcon />}
            appearance="primary"
            color="violet"
            onClick={() => {
              if (status === "OFFLINE") {
                toast.warn("grupo em manuntenção.");
                return;
              }

              generateReport(name);
            }}
          >
            Gerar relatório
          </IconButton>
        </div>
      </div>
      <Drawer
        open={action !== null}
        onClose={closeDrawer}
        placement="right"
        size="xs"
      >
        <Drawer.Header>
          <Drawer.Title>
            {action === "Adicionar" ? "Novo Grupo" : "Remover Grupo"}
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          {action === "Adicionar" && (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="idgroup">
                <Form.ControlLabel>ID do grupo:</Form.ControlLabel>
                <Form.Control
                  name="idgroup"
                  type="number"
                  min="0"
                  value={formData.idgroup}
                  onChange={(value) => handleInputChange("idgroup", value)}
                />
                <Form.HelpText>Parâmetro obrigatório.</Form.HelpText>
              </Form.Group>
              <Form.Group controlId="name">
                <Form.ControlLabel>Nome do afiliado: </Form.ControlLabel>
                <Form.Control
                  name="name"
                  value={formData.name}
                  onChange={(value) => handleInputChange("name", value)}
                />
                <Form.HelpText>Parâmetro obrigatório.</Form.HelpText>
              </Form.Group>
              <Form.Group controlId="affiliatelink">
                <Form.ControlLabel>Link de afiliado: </Form.ControlLabel>
                <Form.Control
                  name="affiliatelink"
                  type="text"
                  value={formData.affiliatelink}
                  onChange={(value) =>
                    handleInputChange("affiliatelink", value)
                  }
                />
                <Form.HelpText>Parâmetro obrigatório.</Form.HelpText>
              </Form.Group>
              <Divider />
              <div style={{ marginBottom: "10px" }}>
                Hora de envio dos sinais:
              </div>
              <DatePicker
                format="HH:mm"
                placeholder="Inicio"
                value={formData.startTime}
                onChange={(value) => handleInputChange("startTime", value)}
              />
              <DatePicker
                format="HH:mm"
                placeholder="Fim"
                value={formData.endTime}
                onChange={(value) => handleInputChange("endTime", value)}
              />
              <Divider />
              <Form.Group>
                <ButtonToolbar>
                  <Button appearance="primary" color="green" type="submit">
                    Cadastrar
                  </Button>
                  <Button
                    appearance="primary"
                    color="red"
                    onClick={closeDrawer}
                  >
                    Fechar
                  </Button>
                </ButtonToolbar>
              </Form.Group>
            </Form>
          )}

          {action === "Remover" && (
            <Form onSubmit={handleRemove}>
              <Form.Group controlId="idgroup">
                <Form.ControlLabel>ID do grupo:</Form.ControlLabel>
                <Form.Control
                  name="idgroup"
                  type="number"
                  min="0"
                  value={formData.idgroup}
                  onChange={(value) => handleInputChange("idgroup", value)}
                />
                <Form.HelpText>Parâmetro obrigatório.</Form.HelpText>
              </Form.Group>
              <Form.Group>
                <ButtonToolbar>
                  <Button appearance="primary" color="red" type="submit">
                    Remover
                  </Button>
                  <Button
                    appearance="primary"
                    color="orange"
                    onClick={closeDrawer}
                  >
                    Fechar
                  </Button>
                </ButtonToolbar>
              </Form.Group>
            </Form>
          )}
        </Drawer.Body>
      </Drawer>
    </div>
  );
};

export default CardBot;
