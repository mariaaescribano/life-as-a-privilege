export const espacio = {
  // ── Doṣha page: labels ─────────────────────────────────────────────────
  "espacio.dosha.titulo": "Your Dosha",
  "espacio.dosha.consejos": "Advice for your Prakriti ~ Constitution",
  "espacio.dosha.distribucion": "Distribution of your Prakriti ~ Constitution",
  "espacio.dosha.predominante": "Predominant",
  "espacio.dosha.descargarPdf": "Download PDF",
  "espacio.dosha.borrando": "Deleting…",
  "espacio.dosha.borrar": "Delete and retake the test",

  // ── Physiology · the eight organs and their test ───────────────────────
  // The name, description, questions and remedies of each organ are NOT
  // here: they're data, and live in `OrganosFisiologia.en.ts`.
  "espacio.fisio.celulas": "The cells of your body",
  "espacio.fisio.plantas": "Plants and natural remedies",
  "espacio.fisio.bien": "Your {organo} seems to be fine",
  "espacio.fisio.bienTexto":
    "You haven't checked any significant symptoms. Keep taking care of yourself with natural food and enough rest.",
  "espacio.fisio.repetir": "Retake the test",

  // ── Phytotherapy · favorite plants ─────────────────────────────────────
  "espacio.fito.inicia": "Log in to see your favorite plants.",
  "espacio.fito.cargando": "Loading your favorites…",
  "espacio.fito.explorar": "Explore the herbarium",

  // ── Astrology · the saved chart ────────────────────────────────────────
  "espacio.astro.arquetipos": "Do you want to know which archetypes you're made of?",
  "espacio.astro.lectura": "Do you want a professional reading of your Birth Chart?",
  "espacio.astro.transcripcion": "Transcript",
  "espacio.astro.tuCartaNatal": "Your Birth Chart",
  "espacio.astro.perfil": "Profile",
  /** The three chart fields that get saved in My Space. */
  /** "Sol en" ~ "Luna en": the label of the chosen sign. Spanish glues the
   *  preposition to the end and English doesn't always, hence the gap. */
  "espacio.astro.campoEn": "{campo} in",
  "espacio.astro.tuCampo": "Your {campo}",
  "espacio.astro.sol": "Sun",
  "espacio.astro.luna": "Moon",
  "espacio.astro.ascendente": "Ascendant",

  // ── Kabbalah · the Tree test ───────────────────────────────────────────
  "espacio.cabala.autoconocimiento": "Self-knowledge · {n} questions",
  "espacio.cabala.comenzar": "Start the test →",
  "espacio.cabala.repetir": "Retake the test",

  // ── Button shared by the My Space pages ────────────────────────────────
  "espacio.descargarPdf": "Download PDF",

  // ── The categories of "Your personalized advice" ───────────────────────
  // Shared by the Doṣha test and the three Chinese Medicine tests.
  "espacio.cons.infusiones": "Teas",
  "espacio.cons.hierbas": "Herbs",
  "espacio.cons.nutricion": "Nutrition",
  "espacio.cons.alimentacion": "Food",
  "espacio.cons.estiloDeVida": "Lifestyle",
  "espacio.cons.evitar": "Avoid",

  // ── Chinese Medicine · My Space and the three tests ────────────────────
  // The NAMES of the results (Wood, Qi Deficiency…) are not here: they're
  // the key they're saved under in the database, and they're translated for
  // display in `data/tcmEspacio.en.ts`.
  "espacio.tcm.tests": "Tests for Self-Knowledge",
  "espacio.tcm.bloqueado": "Complete the test to unlock your personalized result",
  /** Button for a test not taken yet. {test} = the test's name. */
  "espacio.tcm.hacerTest": "Take the test: {test}",
  "espacio.tcm.recomendaciones": "Recommendations",
  "espacio.tcm.rec.infusiones": "Teas and Infusions",
  "espacio.tcm.rec.hierbas": "Medicinal Herbs",
  "espacio.tcm.rec.estiloDeVida": "Lifestyle",
  "espacio.tcm.rec.nutricion": "Nutrition",
  "espacio.tcm.saberMas": "I want to know more",
  "espacio.tcm.rehacer": "Retake the test",
  "espacio.tcm.evaluacion": "Personalized assessment",
  "espacio.tcm.evaluacion.placeholder": "Would you like to tell me anything in advance?",
  "espacio.tcm.diagnostico": "Full diagnosis",
  "espacio.tcm.diagnostico.sub":
    "Leave me your details and I'll get in touch with you to offer you a personalized Chinese Medicine diagnosis.",

  // The three tests: the card label and the title of its section.
  "espacio.tcm.t1.tarjeta": "Get to know your constitution",
  "espacio.tcm.t1.seccion": "Your Constitution",
  "espacio.tcm.t2.tarjeta": "Your predominant element",
  "espacio.tcm.t2.seccion": "Your Predominant Element",
  "espacio.tcm.t3.tarjeta": "Your current imbalance",
  "espacio.tcm.t3.seccion": "Your Current Imbalance",

  // Test 1 · "Get to know your constitution"
  "espacio.tcm.t1.instruccionesTitulo": "Instructions",
  "espacio.tcm.t1.instrucciones":
    "Answer each statement by choosing the option that best describes you at this moment in your Life. Add up the points for each pattern: the one with the highest score indicates your predominant constitution.",
  "espacio.tcm.t1.nota":
    "The results are for guidance, not a diagnosis. If there are ties, it can point to mixed constitutions, which is very common.",
  "espacio.tcm.t1.escala1": "Rarely",
  "espacio.tcm.t1.escala2": "Sometimes",
  "espacio.tcm.t1.escala3": "Often",
  "espacio.tcm.t1.escalaMovil": "0 = Never · 2 = Always",
  "espacio.tcm.t1.interpretacion": "Interpretation, as a Guide",
  "espacio.tcm.t1.etiqueta": "Your Constitution",

  // Test 2 · "Your predominant element"
  "espacio.tcm.t2.instruccionesTitulo": "Constitutional Ground",
  "espacio.tcm.t2.instrucciones":
    "An assessment of your baseline energetic tendency according to the Five Elements. Answer for how most of your adult Life has been, not for your current state.",
  "espacio.tcm.t2.escala1": "Doesn't describe me",
  "espacio.tcm.t2.escala2": "A slight tendency",
  "espacio.tcm.t2.escala3": "Moderately characteristic",
  "espacio.tcm.t2.escala4": "Very characteristic",
  "espacio.tcm.t2.escalaMovil": "0 = Doesn't describe me · 3 = Very characteristic",
  "espacio.tcm.t2.nota1":
    "The highest score indicates your predominant constitutional ground. The second score corresponds to the supporting Element.",
  /** Only shows if the top two scores differ by less than 3. */
  "espacio.tcm.t2.notaMixta":
    " A difference of less than 3 points between the top two suggests a mixed constitution.",
  "espacio.tcm.t2.nota2":
    "This reading aligns with the principles of the Huangdi Neijing on the differentiation of the energetic ground.",
  "espacio.tcm.t2.interpretacion": "Constitutional Interpretation",
  "espacio.tcm.t2.etiqueta": "Your Ground",

  // Test 3 · "Your current imbalance"
  "espacio.tcm.t3.instruccionesTitulo": "Current Pattern of Imbalance",
  "espacio.tcm.t3.instrucciones":
    "A symptom assessment based on Five Element differentiation. Answer for the last 2–3 months.",
  "espacio.tcm.t3.escala1": "Absent",
  "espacio.tcm.t3.escala2": "Occasional",
  "espacio.tcm.t3.escala3": "Frequent",
  "espacio.tcm.t3.escala4": "Persistent / intense",
  "espacio.tcm.t3.escalaMovil": "0 = Absent · 3 = Persistent",
  "espacio.tcm.t3.nota":
    "The highest score indicates the predominant pattern of imbalance right now. Two high scores can suggest interaction between the generating or controlling cycles. A match between your constitutional ground (Test II) and your current pattern can indicate an overload of the base Element.",
  "espacio.tcm.t3.interpretacion": "Clinical Interpretation, as a Guide",
  "espacio.tcm.t3.etiqueta": "Current",

  // ── Nutrition · "Calculate your needs" ─────────────────────────────────
  /** Title when entering as a guest, without an account. */
  "espacio.nutri.invitada": "Calculate your needs",
  "espacio.nutri.misPlantas": "My plants",
  "espacio.nutri.misAlimentos": "My foods",
  "espacio.nutri.calc.titulo": "Calculate your needs",
  "espacio.nutri.calc.sub": "An estimate of daily calories and macronutrient distribution.",
  /** ⚠️ Kilograms and centimeters in BOTH languages: they're the numbers
   *  that feed the Mifflin-St Jeor formula and the ones saved in the
   *  database. Putting pounds and inches on the English label would give
   *  a false result. */
  "espacio.nutri.campo.peso": "Weight (kg)",
  "espacio.nutri.campo.altura": "Height (cm)",
  "espacio.nutri.campo.edad": "Age (years)",
  "espacio.nutri.genero": "Gender",
  "espacio.nutri.genero.mujer": "Woman",
  "espacio.nutri.genero.hombre": "Man",
  "espacio.nutri.actividad": "Activity level",
  "espacio.nutri.act1.label": "Sedentary",
  "espacio.nutri.act1.desc": "Little or no exercise",
  "espacio.nutri.act2.label": "Lightly active",
  "espacio.nutri.act2.desc": "1–3 days a week",
  "espacio.nutri.act3.label": "Moderately active",
  "espacio.nutri.act3.desc": "3–5 days a week",
  "espacio.nutri.act4.label": "Very active",
  "espacio.nutri.act4.desc": "6–7 days a week",
  "espacio.nutri.act5.label": "Extremely active",
  "espacio.nutri.act5.desc": "Hard physical work",
  "espacio.nutri.calcular": "Calculate",
  "espacio.nutri.err.campos": "Please fill in all the fields.",
  "espacio.nutri.err.peso": "Enter a valid weight (20–300 kg).",
  "espacio.nutri.err.altura": "Enter a valid height (100–250 cm).",
  "espacio.nutri.err.edad": "Enter a valid age (10–120 years).",
  "espacio.nutri.tdee": "Estimated daily calories",
  "espacio.nutri.tdee.unidad": "kcal / day",
  "espacio.nutri.macro.proteinas": "Protein",
  "espacio.nutri.macro.carbos": "Carbohydrates",
  "espacio.nutri.macro.grasas": "Fat",
  "espacio.nutri.fuentes": "Recommended sources",
  "espacio.nutri.valores": "Nutrition facts (per 100 g)",
  "espacio.nutri.recalcular": "Recalculate",
  "espacio.nutri.disclaimer":
    "This estimate is for guidance. Actual needs vary with body composition and individual metabolism.",
  "espacio.nutri.info.titulo": "Important information",
  "espacio.nutri.info.texto":
    "This is only a guide to get to know yourself better; if you want a personalized diet, contact a nutritionist. If you want to understand your body better and go deeper into the effect food has on the human body, contact me.",
  "espacio.nutri.info.gracias": "Thank you for wanting to take care of yourself with coherence.",

  // ── Nutrition · the labels of each food's table ─────────────────────────
  // They repeat across the twelve foods, so they go in only once.
  "espacio.nutri.v.calorias": "Calories",
  "espacio.nutri.v.proteinas": "Protein",
  "espacio.nutri.v.insaturadas": "Unsat. fat",
  "espacio.nutri.v.saturadas": "Sat. fat",
  "espacio.nutri.v.carbohidratos": "Carbs",
  "espacio.nutri.v.grasas": "Fat",
  "espacio.nutri.v.fibra": "Fiber",
  "espacio.nutri.v.fibraSoluble": "Soluble fiber",
  "espacio.nutri.v.fibraInsoluble": "Insoluble fiber",

  // ── Nutrition · the twelve foods under "Recommended sources" ───────────
  // Legumes show up twice (protein and carbohydrates) and each place tells
  // them differently: that's why they have two entries.
  "espacio.nutri.al.huevo.nom": "Egg",
  "espacio.nutri.al.huevo.desc":
    "One of the most complete and bioavailable proteins there is. It contains all the essential amino acids in almost perfect proportions.",
  "espacio.nutri.al.legumbres.nom": "Legumes",
  "espacio.nutri.al.legumbres.desc":
    "An excellent source of plant protein combined with fiber and complex carbohydrates. Lentils, chickpeas and beans are staples of a balanced diet.",
  "espacio.nutri.al.pescado.nom": "Fish",
  "espacio.nutri.al.pescado.desc":
    "High-quality protein combined with omega-3, which reduces inflammation and protects the cardiovascular system.",
  "espacio.nutri.al.tofu.nom": "Tofu",
  "espacio.nutri.al.tofu.desc":
    "A complete plant protein derived from soybeans. Versatile and mild, it's an excellent alternative to animal protein.",
  "espacio.nutri.al.soja.nom": "Soybeans",
  "espacio.nutri.al.soja.desc":
    "One of the few complete plant proteins. Rich in all the essential amino acids, plus fiber and healthy fats.",
  "espacio.nutri.al.guisantes.nom": "Peas",
  "espacio.nutri.al.guisantes.desc":
    "Plant protein that comes with fiber, which slows its absorption and helps keep you full longer.",
  "espacio.nutri.al.verduras.nom": "Vegetables",
  "espacio.nutri.al.verduras.desc": "A source of fiber, vitamins and quality energy.",
  "espacio.nutri.al.frutas.nom": "Fruit",
  "espacio.nutri.al.frutas.desc":
    "Its fiber is perfect for letting its fructose be absorbed into us little by little.",
  "espacio.nutri.al.legumbresCarb.nom": "Legumes",
  "espacio.nutri.al.legumbresCarb.desc":
    "Despite their bad reputation, they're among the best sources of carbohydrates, and they come with fiber and protein too.",
  "espacio.nutri.al.aguacate.nom": "Avocado",
  "espacio.nutri.al.aguacate.desc":
    "Rich in oleic acid, the same one found in olive oil. It nourishes the cell membrane and has a natural anti-inflammatory effect.",
  "espacio.nutri.al.aceite.nom": "Olive oil",
  "espacio.nutri.al.aceite.desc":
    "Its high oleic acid content protects the cells and reduces chronic inflammation. One of the pillars of healthy eating.",
  "espacio.nutri.al.frutosSecos.nom": "Nuts",
  "espacio.nutri.al.frutosSecos.desc":
    "They concentrate unsaturated fats, protein and fiber into small doses. A snack that truly nourishes.",

  // ── The two saved tests (Doṣhas and Chinese Medicine) ──────────────────
  "espacio.test.doshas": "The Doṣha Test",
  "espacio.test.descubreDosha": "Discover your Doṣha",
  "espacio.test.doshaPrincipal": "Your main Doṣha is",
  "espacio.test.eligeOpcion":
    "For each question, choose the option that best describes you. There are no right or wrong answers: trust your first intuition.",
  "espacio.test.recalcular": "Recalculate",
  "espacio.test.consejos": "Your personalized advice",
  "espacio.test.descargarConsejos": "Download the advice",
  "espacio.test.descargarRespuestas": "Download my answers",
  "espacio.test.verResultados": "See my results",
  "espacio.test.tusResultados": "Your Results",
  "espacio.test.predominante": "PREDOMINANT",
  "espacio.test.volver": "Back to My Space",
  /** Notice while questions of the Doṣha test are still unanswered. */
  "espacio.ayur.responde": "Answer all the questions to see your Doṣha ({hechas} / {total})",

  // ── Vata ───────────────────────────────────────────────────────────────
  "espacio.dosha.vata.subtitulo": "Air and Ether · Movement and Creativity",
  "espacio.dosha.vata.descripcion":
    "Vata is the energy of movement: light, quick, creative and intuitive. People with a Vata predominance are enthusiastic, imaginative and quick to learn, though they also tend toward scattered attention, anxiety and irregular habits. Their mind travels constantly. To come into balance, Vata needs routine, warmth, rest and nourishing foods that anchor its energy.",
  "espacio.dosha.vata.consejo1.titulo": "Food",
  "espacio.dosha.vata.consejo1.texto":
    "Prioritize warm, oily, nourishing foods. Soups, stews, ghee and warm spices like ginger or cinnamon are your allies. Avoid cold, raw or very light foods.",
  "espacio.dosha.vata.consejo2.titulo": "Routine and rest",
  "espacio.dosha.vata.consejo2.texto":
    "Set fixed times for eating, sleeping and waking. Regularity calms your scattered nature. Sleep at least 7 hours and avoid too much stimulation at night.",
  "espacio.dosha.vata.consejo3.titulo": "Movement",
  "espacio.dosha.vata.consejo3.texto":
    "Choose exercise that grounds you: yoga, strength training, martial arts. Avoid strenuous or irregular exercise, which drains your energy.",
  "espacio.dosha.vata.consejo4.titulo": "Mind and emotions",
  "espacio.dosha.vata.consejo4.texto":
    "Practice meditation and deep breathing to calm the excess in your mind.",

  // ── Pitta ──────────────────────────────────────────────────────────────
  "espacio.dosha.pitta.subtitulo": "Fire and Water · Transformation and Determination",
  "espacio.dosha.pitta.descripcion":
    "Pitta is the energy of transformation: intense, determined, passionate and precise. Pitta people are natural leaders with a great capacity to get things done, but they can fall into irritability, perfectionism and excess inner heat. Their greatest strength is also their greatest challenge: intensity. To come into balance, Pitta needs coolness, moderation, activities that relax the mind and an environment without too much competition.",
  "espacio.dosha.pitta.consejo1.titulo": "Food",
  "espacio.dosha.pitta.consejo1.texto":
    "Choose fresh, mild-flavored foods. Sweet fruit, leafy greens and refreshing vegetables. Cut back on pungent foods, alcohol, and anything very salty or sour.",
  "espacio.dosha.pitta.consejo2.titulo": "Temperature and surroundings",
  "espacio.dosha.pitta.consejo2.texto":
    "Avoid excess heat: direct sun, saunas or intense exercise at midday. Seek out cool, natural, calm surroundings to recover your balance.",
  "espacio.dosha.pitta.consejo3.titulo": "Movement",
  "espacio.dosha.pitta.consejo3.texto":
    "Moderate, non-competitive sports are ideal: swimming, gentle cycling, hiking. Avoid overtraining or turning exercise into a battle with yourself.",
  "espacio.dosha.pitta.consejo4.titulo": "Mind and emotions",
  "espacio.dosha.pitta.consejo4.texto":
    "Learn to let go of control and perfection. Compassionate meditation, contact with nature and playful activities with no goal help you cool the fire inside.",

  // ── Kapha ──────────────────────────────────────────────────────────────
  "espacio.dosha.kapha.subtitulo": "Earth and Water · Stability and Love",
  "espacio.dosha.kapha.descripcion":
    "Kapha is the energy of structure: stable, resilient, loyal and deeply affectionate. Kapha people are constant, patient and have an excellent memory. Their shadow is a tendency toward attachment, slowness and resistance to change. To come into balance, Kapha needs movement, stimulation, new challenges and a light diet that stokes its inner fire.",
  "espacio.dosha.kapha.consejo1.titulo": "Food",
  "espacio.dosha.kapha.consejo1.texto":
    "Prioritize light, low-calorie foods with stimulating spices: ginger, black pepper, turmeric, mustard. Cut back on dairy, sweets, fried foods and anything heavy or very oily.",
  "espacio.dosha.kapha.consejo2.titulo": "Movement",
  "espacio.dosha.kapha.consejo2.texto":
    "Vigorous, constant movement is essential for you: running, dancing, team sports. Move every day even when you don't feel like it — your body needs it more than any other Doṣha does.",
  "espacio.dosha.kapha.consejo3.titulo": "Mental stimulation",
  "espacio.dosha.kapha.consejo3.texto":
    "Seek out new experiences, trips, courses or projects that pull Kapha out of its comfort zone. Boredom and monotony are your biggest enemies.",
  "espacio.dosha.kapha.consejo4.titulo": "Mind and emotions",
  "espacio.dosha.kapha.consejo4.texto":
    "Work on gradually letting go of objects, habits and relationships that no longer nourish you. Active generosity and volunteering channel your loving, transforming energy very well, but don't forget to sustain yourself first.",
};
