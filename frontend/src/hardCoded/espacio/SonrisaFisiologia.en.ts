import { useMemo } from "react";
import { useIdioma } from "../../i18n";
import { ORGANOS_SONRISA, type OrganoSonrisa } from "./SonrisaFisiologia";

/**
 * Los doce órganos de «La sonrisa interior», en INGLÉS.
 *
 * Solo el TEXTO, emparejado por el `key` del órgano. El `hotspot` (dónde cae el
 * punto pulsable sobre la figura), la foto, el orden y los propios `key` viven
 * únicamente en el fichero español: si se duplicaran, bastaría mover un punto en
 * un idioma y no en el otro para que el mismo dibujo tuviera los puntos en
 * sitios distintos.
 *
 * Lo que falte aquí se muestra en español, órgano por órgano (ver `useOrganosSonrisa`).
 */
export type OrganoSonrisaTexto = Pick<OrganoSonrisa, "nombre" | "titulo" | "claves" | "texto" | "gracias">;

export const organosSonrisaEn: Record<string, OrganoSonrisaTexto> = {
  cerebro: {
    nombre: "Brain",
    titulo: "Your brain",
    claves: [
      "It weighs a little over two pounds and burns about a fifth of your energy",
      "Around 86 billion neurons",
      "It never switches off: it works while you sleep too",
    ],
    texto: "While you read this sentence, your brain is understanding it. At the same time it's holding your breathing, your heartbeat and your temperature without you having to remember any of it. Everything you've ever lived is kept in there.",
    gracias: "Thank you, brain, for thinking me, and for holding me up even when I don't notice.",
  },
  tiroides: {
    nombre: "Thyroid",
    titulo: "Your thyroid",
    claves: [
      "A butterfly of 20–25 grams in your throat",
      "It sets the rate at which every cell of yours burns energy",
      "Its hormones travel through all of your blood",
    ],
    texto: "It's small and it decides something enormous: how fast your body lives. Your temperature, the energy you get up with, even your mood, all pass through it. Right now it's tuning that rhythm for you.",
    gracias: "Thank you, thyroid, for giving me exactly the rhythm I need to live the day.",
  },
  pulmones: {
    nombre: "Lungs",
    titulo: "Your lungs",
    claves: [
      "About 20,000 breaths a day",
      "Close to 300 million alveoli",
      "Their exchange surface covers about as much as a tennis court",
    ],
    texto: "Breathe now, slowly. The air that just came in reaches the alveoli and passes into your blood in less than a second. Your lungs haven't stopped doing it since your first cry.",
    gracias: "Thank you, lungs, for bringing me the air over and over without asking anything of me.",
  },
  corazon: {
    nombre: "Heart",
    titulo: "Your heart",
    claves: [
      "About 100,000 beats a day",
      "It moves around 7,000 liters of blood every day",
      "It started beating before you were born",
    ],
    texto: "Put your hand on your chest and feel it. It has been beating since the third week inside your mother, and it hasn't stopped for a single day. Every beat carries oxygen to the very last corner of you.",
    gracias: "Thank you, heart, for beating for me since before I knew you existed.",
  },
  higado: {
    nombre: "Liver",
    titulo: "Your liver",
    claves: [
      "More than 500 different functions",
      "Over a liter of blood passes through it every minute",
      "It's the only organ that can regenerate itself",
    ],
    texto: "It's your great laboratory: it cleans, transforms, stores and distributes. Everything you eat and drink passes through it before reaching the rest of your body. And it does it in silence, without you ever noticing.",
    gracias: "Thank you, liver, for cleaning without rest what I can't even see.",
  },
  estomago: {
    nombre: "Stomach",
    titulo: "Your stomach",
    claves: [
      "It makes an acid strong enough to damage metal",
      "Its lining renews itself every few days",
      "It stretches to take in whatever you eat",
    ],
    texto: "It takes what you give it and breaks it down into pieces small enough for your blood to use. And it protects itself from the acid it makes, rebuilding its own wall over and over.",
    gracias: "Thank you, stomach, for receiving what I give you and turning it into life.",
  },
  pancreas: {
    nombre: "Pancreas",
    titulo: "Your pancreas",
    claves: [
      "It makes insulin and glucagon",
      "It releases the enzymes that digest fats, proteins and carbohydrates",
      "It regulates your blood sugar minute by minute",
    ],
    texto: "Every time you eat, it decides how much energy goes into your cells and how much is stored for later. You have never had to think about your blood sugar: it has done it for you.",
    gracias: "Thank you, pancreas, for measuring my energy with a precision I could never match.",
  },
  bazo: {
    nombre: "Spleen",
    titulo: "Your spleen",
    claves: [
      "It removes old red blood cells and recycles their iron",
      "It keeps and trains part of your defenses",
      "It's a filter for your own blood",
    ],
    texto: "It's the organ almost nobody talks about. It clears worn-out cells from your blood, makes use of whatever is still good, and keeps defenses ready for the day an infection shows up.",
    gracias: "Thank you, spleen, for taking care of me from the silence, without anyone naming you.",
  },
  rinones: {
    nombre: "Kidneys",
    titulo: "Your kidneys",
    claves: [
      "They filter around 180 liters of blood a day",
      "A million nephrons in each one",
      "They decide how much water and how much salt stay in you",
    ],
    texto: "They filter your entire blood supply many times a day and give almost all of it back, keeping only what's left over. They also look after your blood pressure and the balance of your minerals.",
    gracias: "Thank you, kidneys, for keeping clean what runs inside me.",
  },
  intestino: {
    nombre: "Intestines",
    titulo: "Your intestines",
    claves: [
      "Between seven and eight meters long",
      "More than a hundred million neurons of their own",
      "Trillions of bacteria live with you in here",
    ],
    texto: "This is where what you ate becomes you: your muscles, your hormones, your thoughts. They have a nervous system of their own, which is why you sometimes feel your emotions in your belly.",
    gracias: "Thank you, intestines, for turning food into me and for warning me when something's wrong.",
  },
  huesos: {
    nombre: "Bones",
    titulo: "Your bones",
    claves: [
      "206 bones holding you up right now",
      "Your blood is made inside them",
      "They rebuild themselves completely over about ten years",
    ],
    texto: "They aren't stones: they're living tissue that breaks down and builds itself back up every day, according to how you move. And inside them, the marrow makes the blood that keeps you alive.",
    gracias: "Thank you, bones, for holding me upright and for giving me blood from within.",
  },
  piel: {
    nombre: "Skin",
    titulo: "Your skin",
    claves: [
      "Your largest organ: about two square meters",
      "It renews itself completely every three or four weeks",
      "Millions of touch receptors",
    ],
    texto: "It's your border and your first contact with the world: it protects you, regulates your temperature and lets you feel a caress. Right now it's touching the air around you.",
    gracias: "Thank you, skin, for keeping me whole and for letting me feel.",
  },
};

/**
 * Los doce órganos de la práctica en el idioma activo. En español devuelve el
 * array tal cual; en inglés funde el texto sobre él, dejando intactos `key`,
 * `foto` y `hotspot`.
 */
export const useOrganosSonrisa = (): OrganoSonrisa[] => {
  const { idioma } = useIdioma();
  return useMemo(
    () =>
      idioma === "es"
        ? ORGANOS_SONRISA
        : ORGANOS_SONRISA.map((o) => ({ ...o, ...(organosSonrisaEn[o.key] ?? {}) })),
    [idioma],
  );
};
