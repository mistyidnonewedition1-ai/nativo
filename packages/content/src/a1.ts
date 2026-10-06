import { fill, listen, mcq, vocab, type Lesson } from "./types.js";

export const A1_LESSONS: Lesson[] = [
  {
    id: "a1-01", title: "Saludar y presentarse", level: "A1",
    objectives: ["Te présenter", "Demander le prénom et l'origine", "Comprendre une première rencontre"],
    intro: "Deux personnes se rencontrent. Écoute d'abord le sens général, sans chercher à tout traduire.",
    dialogue: [
      { speaker: "Lucía", es: "¡Hola! Me llamo Lucía. ¿Cómo te llamas?", fr: "Salut ! Je m'appelle Lucía. Comment tu t'appelles ?" },
      { speaker: "Mateo", es: "Hola, Lucía. Me llamo Mateo. Mucho gusto.", fr: "Salut, Lucía. Je m'appelle Mateo. Enchanté." },
      { speaker: "Lucía", es: "Mucho gusto. ¿De dónde eres?", fr: "Enchantée. Tu viens d'où ?" },
      { speaker: "Mateo", es: "Soy de Colombia. ¿Y tú?", fr: "Je suis de Colombie. Et toi ?" },
      { speaker: "Lucía", es: "Yo soy de Argentina, pero vivo en Madrid.", fr: "Moi je suis d'Argentine, mais j'habite à Madrid." },
    ],
    vocab: [
      vocab("me-llamo", "me llamo", "je m'appelle", [["Me llamo Lucía.", "Je m'appelle Lucía."], ["¿Cómo te llamas? — Me llamo Pablo.", "Comment tu t'appelles ? — Je m'appelle Pablo."], ["Hola, me llamo Ana y vivo aquí.", "Salut, je m'appelle Ana et j'habite ici."]]),
      vocab("mucho-gusto", "mucho gusto", "enchanté(e)", [["Mucho gusto.", "Enchanté."], ["Hola, mucho gusto, soy Carlos.", "Bonjour, enchanté, je suis Carlos."], ["¡Mucho gusto en conocerte!", "Ravi de te rencontrer !"]]),
      vocab("de-donde", "¿de dónde eres?", "tu viens d'où ?", [["¿De dónde eres?", "Tu viens d'où ?"], ["Y tú, ¿de dónde eres?", "Et toi, tu viens d'où ?"], ["Hola, ¿de dónde eres? ¿De México?", "Salut, tu viens d'où ? Du Mexique ?"]]),
      vocab("soy-de", "soy de", "je suis de", [["Soy de Colombia.", "Je suis de Colombie."], ["Soy de Lyon, pero vivo en Madrid.", "Je suis de Lyon, mais j'habite à Madrid."], ["No soy de aquí.", "Je ne suis pas d'ici."]]),
    ],
    explain: {
      title: "Dire qui on est et d'où on vient : ser",
      example: { es: "Soy de Colombia.", fr: "Je suis de Colombie." },
      observation: "Dans le dialogue : « soy » (Mateo, Lucía), « eres » (¿De dónde eres?). Le verbe change selon la personne.",
      rule: "Pour l'identité et l'origine, on utilise ser : yo soy, tú eres, él/ella es. On peut omettre « yo » : « Soy de Colombia » suffit.",
    },
    exercises: [
      listen("Me llamo Mateo y soy de Colombia.", "D'où vient Mateo ?", ["De Colombie", "D'Argentine", "D'Espagne", "Du Mexique"]),
      listen("Mucho gusto. ¿De dónde eres?", "Que demande la personne ?", ["D'où tu viens", "Comment tu t'appelles", "Où tu habites", "Quel âge tu as"]),
      mcq("Comment dit-on « Je m'appelle Ana » ?", ["Me llamo Ana", "Soy llamo Ana", "Llamo me Ana", "Me llama Ana"]),
      fill("___ de Argentina, pero vivo en Madrid.", ["Soy", "Estoy", "Tengo", "Hay"], "ser_estar", "Pour l'origine, on utilise ser : « soy de… »."),
      fill("¿___ te llamas?", ["Cómo", "Qué", "Dónde", "Cuál"], "interrogativos", "« ¿Cómo te llamas? » : littéralement « comment t'appelles-tu ? »."),
    ],
    quiz: [
      fill("Tú ___ de España, ¿verdad?", ["eres", "soy", "es", "somos"], "ser_conjugacion", "Avec « tú », on dit « eres »."),
      mcq("Que signifie « mucho gusto » ?", ["Enchanté", "Merci beaucoup", "À bientôt", "Pardon"]),
      listen("Vivo en Madrid pero soy de Argentina.", "Où habite la personne ?", ["À Madrid", "En Argentine", "En Colombie", "À Barcelone"]),
    ],
  },
  {
    id: "a1-02", title: "En casa y en el trabajo", level: "A1",
    objectives: ["Dire où tu es", "Demander où est quelqu'un", "Utiliser « casa » dans trois contextes"],
    intro: "Un appel entre deux amis. Repère où chacun se trouve.",
    dialogue: [
      { speaker: "Sofía", es: "¿Dónde estás?", fr: "Où es-tu ?" },
      { speaker: "Carlos", es: "Estoy en casa. ¿Y tú?", fr: "Je suis à la maison. Et toi ?" },
      { speaker: "Sofía", es: "Yo estoy en el trabajo. Me voy a casa a las seis.", fr: "Moi je suis au travail. Je rentre à la maison à six heures." },
      { speaker: "Carlos", es: "Perfecto. Hasta luego.", fr: "Parfait. À tout à l'heure." },
    ],
    vocab: [
      vocab("casa", "casa", "maison, chez soi", [["Estoy en casa.", "Je suis à la maison."], ["Me voy a casa.", "Je rentre chez moi."], ["Quédate en casa.", "Reste à la maison."]]),
      vocab("trabajo", "el trabajo", "le travail", [["Estoy en el trabajo.", "Je suis au travail."], ["Voy al trabajo en metro.", "Je vais au travail en métro."], ["Mi trabajo es interesante.", "Mon travail est intéressant."]]),
      vocab("estoy", "estoy / estás", "je suis / tu es (lieu)", [["Estoy aquí.", "Je suis ici."], ["¿Dónde estás?", "Où es-tu ?"], ["Estoy cansado, pero estoy bien.", "Je suis fatigué, mais je vais bien."]]),
      vocab("luego", "luego / hasta luego", "plus tard / à tout à l'heure", [["Hasta luego.", "À tout à l'heure."], ["Te llamo luego.", "Je t'appelle plus tard."], ["Nos vemos luego, ¿vale?", "On se voit plus tard, d'accord ?"]]),
    ],
    explain: {
      title: "Dire où l'on est : estar",
      example: { es: "Estoy en casa.", fr: "Je suis à la maison." },
      observation: "Leçon 1 : « soy de Colombia » (origine). Ici : « estoy en casa » (lieu). Deux verbes « être », deux usages.",
      rule: "ser = identité, origine. estar = lieu et état du moment : yo estoy, tú estás, él/ella está. Pour demander où on se trouve : « ¿Dónde estás? ».",
    },
    exercises: [
      listen("Estoy en casa. ¿Y tú?", "Où est la personne ?", ["À la maison", "Au travail", "Au restaurant", "À l'école"]),
      listen("Me voy a casa a las seis.", "Que fait la personne ?", ["Elle rentre chez elle à 18 h", "Elle arrive au travail à 6 h", "Elle part en voyage", "Elle reste au travail"]),
      fill("¿Dónde ___ tú?", ["estás", "eres", "tienes", "hay"], "ser_estar", "Pour demander où l'on se trouve : estar."),
      fill("Yo ___ en el trabajo.", ["estoy", "soy", "hay", "voy"], "ser_estar", "Le lieu où l'on se trouve : estar."),
      mcq("Comment dit-on « Reste à la maison » ?", ["Quédate en casa", "Estás casa", "Me voy casa", "Soy en casa"]),
    ],
    quiz: [
      fill("Soy de Francia, pero ___ en Madrid.", ["estoy", "soy", "tengo", "voy"], "ser_estar", "Origine = ser ; lieu actuel = estar."),
      mcq("Que signifie « hasta luego » ?", ["À tout à l'heure", "Bonne nuit", "Merci", "Bienvenue"]),
      listen("Quédate en casa, por favor.", "Que demande la personne ?", ["De rester à la maison", "De venir au travail", "De partir", "De téléphoner"]),
    ],
  },
];
