// ─────────────────────────────────────────────────────────────────────────
// LAS DESCRIPCIONES DE LA CARTA GUARDADA (/espacio), EN INGLÉS.
//
// Mismo mapa que `SIGN_INFO` de AstrologiaEspacio.tsx: el español manda (de él
// salen los campos y el orden) y aquí va SOLO la prosa. Lo que falte se lee en
// español, casilla a casilla.
//
// Ojo con las claves: los signos se indexan por su nombre ESPAÑOL («Géminis»,
// «Cáncer»), porque es lo que guarda la carta del usuario en la base de datos.
// Es la misma regla que en `astrologiaResumenes.en.ts`.
// ─────────────────────────────────────────────────────────────────────────
import { getIdioma } from "../../../i18n";

type Campo = "sol" | "luna" | "ascendente";

const SIGN_INFO_EN: Record<Campo, Record<string, string>> = {
  sol: {
    Aries: "Your identity is impulsive, pioneering and direct. Your essence looks for action, beginnings and conquest. You learn by going first, throwing yourself in without fear.",
    Tauro: "Your identity is rooted, sensory and persistent. Your essence looks for safety, beauty and steadiness. You learn through matter and through the senses.",
    "Géminis": "Your identity is curious, versatile and communicative. Your essence looks for knowledge, connection and exchange. You learn in constant mental movement.",
    "Cáncer": "Your identity is protective, intuitive and emotional. Your essence looks for home, care and belonging. You learn through the emotional world.",
    Leo: "Your identity is creative, expressive and magnetic. Your essence looks for recognition, joy and a light of its own. You learn by giving from the heart.",
    Virgo: "Your identity is analytical, helpful and perfectionist. Your essence looks for order, usefulness and constant improvement. You learn through detail and through service.",
    Libra: "Your identity is harmonious, diplomatic and relational. Your essence looks for balance, fairness and shared beauty. You learn inside the bond.",
    Escorpio: "Your identity is intense, transformative and deep. Your essence looks for truth, power and regeneration. You learn through death and rebirth.",
    Sagitario: "Your identity is expansive, philosophical and free. Your essence looks for meaning, adventure and wisdom. You learn by exploring horizons and meanings.",
    Capricornio: "Your identity is disciplined, ambitious and responsible. Your essence looks for achievement, structure and legacy. You learn through sustained effort.",
    Acuario: "Your identity is original, humanitarian and independent. Your essence looks for freedom, innovation and the collective. You learn by breaking established molds.",
    Piscis: "Your identity is sensitive, compassionate and spiritual. Your essence looks for dissolution, merging and transcendence. You learn through surrender and faith.",
  },
  luna: {
    Aries: "Your emotions are fast, burning and immediate. You need action to process what you feel. Anger is your most honest emotional alarm.",
    Tauro: "Your emotions are steady, sensual and slow. You need material and physical safety to feel well. Resisting change is how you protect yourself.",
    "Géminis": "Your emotions get processed through the mind and through words. You need to talk, understand and connect to feel emotionally balanced.",
    "Cáncer": "Your emotions are deep, nourishing and changing. You need to feel at home to open up. Caring for your home and family is what anchors you emotionally.",
    Leo: "Your emotions need to be expressed and recognized. Warmth, play and genuine appreciation are your main emotional food.",
    Virgo: "Your emotions show up as worry and analysis. You need to feel useful, and your surroundings in order, to be at peace inside.",
    Libra: "Your emotions look for harmony and balance. Conflict destabilizes you deeply. Peaceful relationships are your emotional ground.",
    Escorpio: "Your emotions are intense, hidden and transformative. You need depth and total honesty before you can trust and open up emotionally.",
    Sagitario: "Your emotions look for expansion and freedom. You need space, adventure and meaning so you don't feel trapped or emotionally empty.",
    Capricornio: "Your emotions are held in and come out with difficulty. You need structure and visible achievements to feel emotionally safe.",
    Acuario: "Your emotions are mental, distant and collective. You need to understand what you feel before you can live it. Independence is your emotional ground.",
    Piscis: "Your emotions are diffuse, compassionate and absorbent. You need solitude, creativity and spirituality so you don't get lost in other people's emotional world.",
  },
  ascendente: {
    Aries: "You show up in the world as someone direct, energetic and decisive. Your first impression is one of strength and drive. You tend to leap before you think.",
    Tauro: "You show up in the world as someone calm, reliable and sensual. Your presence gives off steadiness and solidity. You change slowly, but with unshakable firmness.",
    "Géminis": "You show up in the world as someone curious, quick and communicative. Your presence is light and versatile. You connect easily with anyone.",
    "Cáncer": "You show up in the world as someone warm, protective and intuitive. Your presence nourishes. You take a while to open up, but when you do, you care deeply.",
    Leo: "You show up in the world as someone charismatic, generous and confident. Your presence lights things up. You want to leave a mark and be recognized for what makes you singular.",
    Virgo: "You show up in the world as someone careful, helpful and analytical. Your presence is discreet and efficient. You observe everything before you act.",
    Libra: "You show up in the world as someone charming, diplomatic and aesthetic. Your presence is kind and balanced. You look for harmony in every interaction.",
    Escorpio: "You show up in the world as someone magnetic, reserved and intense. Your presence is piercing. People feel there's much more behind your eyes.",
    Sagitario: "You show up in the world as someone optimistic, expansive and honest. Your presence is cheerful and free. You spark genuine enthusiasm wherever you turn up.",
    Capricornio: "You show up in the world as someone serious, responsible and ambitious. Your presence gives off maturity. You earn respect and authority as time goes by.",
    Acuario: "You show up in the world as someone original, independent and visionary. Your presence is unusual. You break the mold almost without noticing.",
    Piscis: "You show up in the world as someone sensitive, empathetic and ethereal. Your presence is soft and enveloping. You absorb the mood of every place you live in.",
  },
};

/** La descripción de un campo y un signo, en el idioma activo. `undefined` si
 *  no hay inglés para esa casilla: quien la pinte cae al español. */
export const signInfoEn = (campo: Campo, signo: string): string | undefined =>
  getIdioma() === "es" ? undefined : SIGN_INFO_EN[campo]?.[signo];
