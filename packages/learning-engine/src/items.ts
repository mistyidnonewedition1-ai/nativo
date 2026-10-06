import type { CefrLevel, Skill } from "@nativo/shared";

/** options[0] = bonne réponse. Elle est mélangée à l'envoi et ne quitte jamais le serveur. */
export interface BankItem {
  id: string; skill: Skill; level: CefrLevel; prompt: string; audioText?: string;
  options: [string, string, string, string];
}
export const DIFFICULTY: Record<CefrLevel, number> = { A1: 0.1, A2: 0.28, B1: 0.45, B2: 0.62, C1: 0.8, C2: 0.95 };

const R = (n: number, level: CefrLevel, text: string, q: string, o: BankItem["options"]): BankItem =>
  ({ id: `r${n}`, skill: "READING", level, prompt: `« ${text} »\n${q}`, options: o });
const V = (n: number, level: CefrLevel, q: string, o: BankItem["options"]): BankItem =>
  ({ id: `v${n}`, skill: "VOCABULARY", level, prompt: q, options: o });
const G = (n: number, level: CefrLevel, sentence: string, o: BankItem["options"]): BankItem =>
  ({ id: `g${n}`, skill: "GRAMMAR", level, prompt: `Complète : ${sentence}`, options: o });
const L = (n: number, level: CefrLevel, audio: string, q: string, o: BankItem["options"]): BankItem =>
  ({ id: `l${n}`, skill: "LISTENING", level, prompt: q, audioText: audio, options: o });

export const BANK: BankItem[] = [
  R(1, "A1", "Me llamo Ana y vivo en Madrid. Tengo dos hermanos.", "Où vit Ana ?", ["À Madrid", "À Barcelone", "À Séville", "Au Mexique"]),
  R(2, "A2", "El sábado fui al mercado con mi madre y compré fruta y pan.", "Qu'a-t-elle acheté ?", ["Des fruits et du pain", "De la viande et du lait", "Des vêtements", "Des livres"]),
  R(3, "B1", "Si no llueve mañana, iremos a la playa; si llueve, nos quedaremos en casa viendo películas.", "Que feront-ils s'il pleut ?", ["Regarder des films à la maison", "Aller à la plage", "Sortir dîner", "Partir en voyage"]),
  R(4, "B1", "Aunque llegué tarde a la reunión, mi jefe no dijo nada, cosa que me sorprendió bastante.", "Pourquoi est-il surpris ?", ["Son chef n'a pas réagi", "Il est arrivé en avance", "La réunion était annulée", "Son chef s'est fâché"]),
  R(5, "B2", "No es que no me guste el trabajo, sino que llevo meses sin vacaciones y ya no puedo más.", "Quel est le problème ?", ["Il est épuisé par le manque de repos", "Il déteste son travail", "Il veut changer d'entreprise", "Il est mal payé"]),
  R(6, "B2", "Habría aceptado la oferta de no ser porque exigían mudarse de ciudad.", "Pourquoi n'a-t-il pas accepté ?", ["Il fallait déménager", "Le salaire était trop bas", "Il est arrivé trop tard", "Le poste ne l'intéressait pas"]),
  R(7, "C1", "Lejos de resolver el conflicto, las medidas no hicieron sino agravarlo.", "Que firent les mesures ?", ["Elles aggravèrent le conflit", "Elles le résolurent", "Elles l'ignorèrent", "Elles le retardèrent"]),
  R(8, "C1", "Por más que le insistieron, Marta no dio su brazo a torcer.", "Qu'a fait Marta ?", ["Elle a maintenu sa position", "Elle a fini par céder", "Elle s'est blessé le bras", "Elle a demandé de l'aide"]),

  V(1, "A1", "Que signifie « la manzana » ?", ["La pomme", "Le pain", "L'eau", "La maison"]),
  V(2, "A1", "Que signifie « cansado » ?", ["Fatigué", "Content", "Chaud", "Perdu"]),
  V(3, "A2", "Que signifie « la nevera » ?", ["Le réfrigérateur", "La neige", "Le four", "La fenêtre"]),
  V(4, "B1", "Que signifie « echar de menos » ?", ["Regretter l'absence de quelqu'un", "Jeter quelque chose", "S'ennuyer", "Mettre de côté"]),
  V(5, "B1", "« Quedamos a las ocho » signifie :", ["On se retrouve à huit heures", "On reste jusqu'à huit heures", "Nous sommes restés huit heures", "On part à huit heures"]),
  V(6, "B1", "« Me da igual » signifie :", ["Ça m'est égal", "Ça me fait peur", "Ça me plaît", "Ça m'énerve"]),
  V(7, "B2", "« Estoy hecho polvo » signifie :", ["Je suis épuisé", "Je suis couvert de poussière", "Je suis en colère", "Je suis très content"]),
  V(8, "C1", "« Irse por las ramas » signifie :", ["S'égarer du sujet", "Partir en forêt", "S'enfuir", "Se fâcher"]),

  G(1, "A1", "Yo ___ estudiante.", ["soy", "estoy", "tengo", "hay"]),
  G(2, "A1", "Ella ___ en Madrid.", ["vive", "vivo", "vives", "viven"]),
  G(3, "A2", "Ayer ___ al cine con mis amigos.", ["fui", "voy", "iré", "ir"]),
  G(4, "A2", "¿Dónde ___ tus llaves?", ["están", "son", "hay", "tienen"]),
  G(5, "B1", "Cuando era niño, ___ en el campo.", ["vivía", "viví", "viviré", "vivo"]),
  G(6, "B1", "Quiero que tú ___ conmigo.", ["vengas", "vienes", "venir", "vendrás"]),
  G(7, "B2", "Si tuviera dinero, ___ por el mundo.", ["viajaría", "viajé", "viajaré", "viajo"]),
  G(8, "C1", "Ojalá me ___ avisado antes.", ["hubieras", "hayas", "habías", "habrías"]),

  L(1, "A1", "Buenos días, me llamo Pablo.", "Comment s'appelle la personne ?", ["Pablo", "Pedro", "Pascual", "Paco"]),
  L(2, "A1", "Tengo veinte años y vivo en Sevilla.", "Quel âge a la personne ?", ["20 ans", "12 ans", "22 ans", "30 ans"]),
  L(3, "A2", "¿Qué tal? ¿Te apetece venir luego a tomar algo?", "Que propose-t-on ?", ["Prendre un verre plus tard", "Dîner demain", "Aller au cinéma ce soir", "Faire du sport"]),
  L(4, "A2", "El tren sale a las cinco y media del andén tres.", "À quelle heure part le train ?", ["17 h 30", "17 h 15", "16 h 30", "15 h 30"]),
  L(5, "B1", "No pasa nada, de verdad, ya veremos qué hacemos mañana.", "Que veut dire la personne ?", ["Ce n'est pas grave, on verra demain", "Il ne se passe rien demain", "Elle refuse catégoriquement", "Elle est très fâchée"]),
  L(6, "B1", "Me da igual lo que digan, yo voy a hacerlo a mi manera.", "Que veut dire la personne ?", ["Elle fera à sa façon, quoi qu'on dise", "Elle demande conseil", "Elle abandonne", "Elle est vexée"]),
  L(7, "B2", "¿Qué haces este finde? Es que han abierto un sitio nuevo y estoy flipando con la carta.", "Quelle est la réaction de la personne ?", ["Enthousiaste devant le menu d'un nouvel endroit", "Furieuse", "Effrayée", "Elle travaille ce week-end"]),
  L(8, "C1", "Hombre, no es que me parezca mal, pero tampoco me entusiasma que vayamos otra vez a casa de tus padres.", "Quelle est la position de la personne ?", ["Pas ravie, mais sans s'y opposer", "Elle adore l'idée", "Elle refuse", "Elle est furieuse"]),
];
