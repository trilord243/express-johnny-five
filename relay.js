import five from "johnny-five";
import createBoard from "./create-board.js";
import { EventEmitter } from "events";

const board = await createBoard({ port: "COM4" });
const relay1 = new five.Relay(6);
const relay2 = new five.Relay(7);
const verde = new five.Led(8);
const rojo = new five.Led(9);
const water = new five.Sensor("A0");
export const motor = new five.Motor(10);
const waterEvents = new EventEmitter();
let level = 0;

water.on("change", () => {
  level = water.value;
  waterEvents.emit("levelChanged");
});

const open = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      relay1.open();
      relay2.close();
      console.log("open");
      resolve();
    }, 1000);
  });
};

const close = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      relay1.close();
      relay2.open();
      console.log("close");
      resolve();
    }, 1000);
  });
};

const finish = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      relay1.close();
      relay2.close();
      console.log("finish");
      resolve();
    }, 1000);
  });
};

// Aquí encadenamos las llamadas:
export const runSequence = async () => {
  await open();
  await close();
  await finish();
};

export const prenderVerde = async () => {
  verde.on();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      verde.off();
      console.log("verde");
      resolve();
    }, 2500);
  });
};

export const prenderRojo = async () => {
  rojo.on();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      rojo.off();
      console.log("rojo");
      resolve();
    }, 2500);
  });
};

export const getWater = () => {
  return new Promise((resolve) => {
    if (level !== 0) {
      // Si ya tenemos un valor registrado, lo devolvemos inmediatamente.
      resolve(level);
    } else {
      // Esperamos hasta que el sensor detecte un cambio.
      waterEvents.once("levelChanged", () => {
        resolve(level);
      });
    }
  });
};
