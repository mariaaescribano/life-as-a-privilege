import type { PreguntaAyurveda } from "./PreguntasAyurveda";

/**
 * Las 27 preguntas del test de los Doṣhas, en INGLÉS.
 *
 * El español manda: el número de preguntas, su orden y qué opción puntúa a
 * cada doṣha salen únicamente de `PreguntasAyurveda.ts`. De aquí sale solo el
 * texto, así que el test da el mismo resultado en los dos idiomas.
 *
 * ⚠️ Van emparejadas POR POSICIÓN (no tienen clave propia). Si la lista inglesa
 * no tiene exactamente tantas preguntas como la española, se lee TODO en
 * español, para no cruzar una pregunta con las opciones de otra. Para dejar una
 * sin traducir se pone `null` en su sitio, no se borra.
 *
 * Los nombres de los doṣhas (Vata, Pitta, Kapha) no se traducen: son sánscrito.
 * Y lo que se guarda en la base de datos y sale en el PDF es la pregunta
 * ESPAÑOLA, aunque la pantalla esté en inglés (ver `usePreguntasAyurveda`).
 */
export const PREGUNTAS_AYURVEDA_EN: (PreguntaAyurveda | null)[] = [
  {
    pregunta: "How would you describe your build?",
    vata: "Slim, and I find it hard to put on weight",
    pitta: "Medium, muscular and well proportioned",
    kapha: "Broad or sturdy, and I tend to put on weight",
  },
  {
    pregunta: "What is your skin usually like?",
    vata: "Dry, thin, and it tends to flake",
    pitta: "Sensitive, and it tends to redden or get irritated",
    kapha: "Oily, smooth and moist",
  },
  {
    pregunta: "How do you sleep?",
    vata: "Lightly, and I wake up often",
    pitta: "Well, but with vivid dreams; I wake up quickly",
    kapha: "Deeply and for a long time; it's hard for me to get up",
  },
  {
    pregunta: "What is your digestion like?",
    vata: "Irregular, with gas or constipation",
    pitta: "Strong; I get very hungry and I tend toward acid reflux",
    kapha: "Slow and heavy; I feel full easily",
  },
  {
    pregunta: "How do you react to stress?",
    vata: "I get distressed, scattered and anxious",
    pitta: "I get irritated, demanding, or I look for control",
    kapha: "I freeze, withdraw, or run out of energy",
  },
  {
    pregunta: "What is your usual energy level?",
    vata: "In bursts: very active for a while, then worn out",
    pitta: "High and steady, though I ask too much of myself",
    kapha: "Steady but slow; getting started is the hard part",
  },
  {
    pregunta: "How does your mind work?",
    vata: "Creative and quick, full of ideas, but I find it hard to concentrate",
    pitta: "Clear, analytical and focused on the goal",
    kapha: "Unhurried and thoughtful, with a very good long-term memory",
  },
  {
    pregunta: "How does cold affect you?",
    vata: "I hate it; my hands and feet are always cold",
    pitta: "I like the cold; strong heat wears me out",
    kapha: "Damp and cold weigh me down; I prefer dry heat",
  },
  {
    pregunta: "What is your appetite like?",
    vata: "Irregular; sometimes I'm not hungry, and other times I eat little",
    pitta: "Strong and punctual; if I don't eat on time I get irritated",
    kapha: "Moderate; I can skip meals with no trouble",
  },
  {
    pregunta: "How do you learn?",
    vata: "Fast, but I forget easily",
    pitta: "Fast and precisely; I need to understand why",
    kapha: "Slowly at first, but I hold on to what I've learned",
  },
  {
    pregunta: "How would you describe the way you speak?",
    vata: "Fast, changeable, and sometimes all over the place",
    pitta: "Direct, precise, and sometimes cutting",
    kapha: "Calm, unhurried and thoughtful",
  },
  {
    pregunta: "When you rest, what appeals to you most?",
    vata: "Moving, changing surroundings, or exploring something new",
    pitta: "Solving something, organizing, or reading about something that interests you",
    kapha: "Staying home, eating well, and resting quietly",
  },
  {
    pregunta: "What are your drinking habits like?",
    vata: "I drink little and forget to hydrate",
    pitta: "I drink a lot, especially in warm weather",
    kapha: "I drink a moderate amount, sometimes out of habit more than thirst",
  },
  {
    pregunta: "What is your hair like?",
    vata: "Dry, fine and brittle",
    pitta: "Fine, and it tends to gray or fall out early",
    kapha: "Thick, strong and shiny",
  },
  {
    pregunta: "How do you react to strong heat?",
    vata: "I tire quickly and get dehydrated",
    pitta: "I get irritated and sweat a lot",
    kapha: "I feel heavy and slow",
  },
  {
    pregunta: "What is your immune system like?",
    vata: "Variable; I get sick easily but recover fast",
    pitta: "Strong, but prone to inflammation or irritation",
    kapha: "Strong but slow to react to an infection",
  },
  {
    pregunta: "How do you handle anxiety?",
    vata: "I worry and get worked up easily",
    pitta: "I get frustrated and impatient",
    kapha: "I freeze, or avoid facing it",
  },
  {
    pregunta: "What is your walking pace?",
    vata: "Fast and light",
    pitta: "Fast but firm",
    kapha: "Slow and heavy",
  },
  {
    pregunta: "What is your sexual appetite like?",
    vata: "Variable, intense at times and weak at others",
    pitta: "Intense and regular",
    kapha: "Moderate and steady",
  },
  {
    pregunta: "How well do you recover after exercise?",
    vata: "I need a long time to recover",
    pitta: "Quickly, but I ask too much of myself",
    kapha: "Slowly but steadily",
  },
  {
    pregunta: "How do the changing seasons affect you?",
    vata: "Fall and winter affect me most",
    pitta: "Summer and spring affect me most",
    kapha: "Winter and damp weather affect me most",
  },
  {
    pregunta: "How would you describe your voice?",
    vata: "High, changeable, and sometimes shaky",
    pitta: "Clear, strong and direct",
    kapha: "Deep, slow and even",
  },
  {
    pregunta: "How well do you tolerate hunger?",
    vata: "Poorly; I need to eat often",
    pitta: "Moderately; I can wait if I have to",
    kapha: "Well; I can fast or skip meals with no trouble",
  },
  {
    pregunta: "What is your breathing usually like?",
    vata: "Fast and irregular",
    pitta: "Firm and regular",
    kapha: "Slow and deep",
  },
  {
    pregunta: "How do you handle conflict?",
    vata: "I block, or avoid facing it",
    pitta: "I face it head-on, and I can be confrontational",
    kapha: "I look for common ground and calm",
  },
  {
    pregunta: "What is your memory like?",
    vata: "Quick but scattered; I forget the details",
    pitta: "Sharp and logical; I hold on to what's useful",
    kapha: "Slow to learn, excellent at remembering long term",
  },
  {
    pregunta: "How well do you adapt to a change of routine?",
    vata: "Very well, though too much change stresses me out",
    pitta: "Well, as long as I understand the situation and have some control",
    kapha: "I find it hard; I prefer my routine",
  },
];
