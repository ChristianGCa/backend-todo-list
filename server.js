import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();

const app = express(); // Iniciando o express

app.use(express.json()); // Dizendo que o express vai usar o json
app.use(cors());

// Rota de criação
app.post("/tarefas", async (req, res) => {
  console.log("Request received at /tarefas");
  console.log("Request body:", req.body);

  let { tarefa, prioridade } = req.body;

  if (!tarefa || !prioridade) {
    return res
      .status(400)
      .json({ error: "Missing tarefa or prioridade in request body" });
  }

  tarefa = String(tarefa);
  prioridade = String(prioridade);

  try {
    const newTarefa = await prisma.tarefas.create({
      data: {
        tarefa: tarefa,
        prioridade: prioridade,
      },
    });

    res.status(201).json(newTarefa);
  } catch (error) {
    console.error("Error creating tarefa:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the tarefa" });
  }
});

// Rota de listagem
app.get("/tarefas", async (req, res) => {
  let tarefas = [];

  if (req.query) {
    tarefas = await prisma.tarefas.findMany({
      where: {
        id: req.query.id,
      },
    });
  } else {
    tarefas = await prisma.tarefas.findMany();
  }
  res.status(200).json(tarefas);
});

// Rota de edição
app.put("/tarefas/:id", async (req, res) => {
  await prisma.tarefas.update({
    where: {
      id: req.params.id,
    },
    data: {
      tarefa: req.body.tarefa,
      prioridade: req.body.prioridade,
    },
  });
  res.status(200).json(req.body);
});

// Rota de delecão
app.delete("/tarefas/:id", async (req, res) => {
  await prisma.tarefas.delete({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({ message: "Tarefa deletada com sucesso!" });
});

app.listen(3000);