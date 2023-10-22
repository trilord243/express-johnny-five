import express from "express";
import {
  getWater,
  motor,
  prenderRojo,
  prenderVerde,
  runSequence,
} from "./relay.js";
import cors from "cors";
import { EventEmitter } from "events";

const app = express();
app.use(cors());
const port = 3000;

app.get("/relay", async (req, res) => {
  await runSequence();
  res.send("Hola!");
});

app.get("/correcto", async (req, res) => {
  await prenderVerde();
  res.send("Correcto!");
});

app.get("/incorrecto", async (req, res) => {
  await prenderRojo();
  res.send("Incorrecto!");
});

app.get("/motor-on", async (req, res) => {
  motor.start();
});
app.get("/motor-off", async (req, res) => {
  motor.stop();
});
app.get("/water", async (req, res) => {
  const level = await getWater();
  res.send({ level });
});

app.listen(port, () => {
  console.log(`app en:  http://localhost:${port}`);
});
