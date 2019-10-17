const express = require("express");

const server = express();

server.use(express.json());

const projects = [{ id: "1", title: "Novo Projeto", tasks: [] }];
let numberOfRequests = 0;

function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
}

server.use(logRequests);

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);
  if (!project) {
    return res.status(400).json({ error: "Project Not exists" });
  }
  return next();
}
server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const project = req.body;

  projects.push(project);

  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const project = projects.findIndex(p => p.id == id);

  projects.splice(project, 1);

  return res.json("deletado");
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3333);
