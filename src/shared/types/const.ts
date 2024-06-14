import { TNameOfJob, TTypeOfJob } from "./index.js";

export const TYPES = ['admin', 'regular'] as const;

export const NAMESOFJOB = [
  'b',
  'f',
  'kd',
  'kon',
  'ma',
  'md',
  'mk',
  'mn',
  'ms',
  'mz',
  'n',
  'nn',
  'rep',
  'sta',
  'ubo',
  'wtr',
  'doo',
  'u',
  'k',
  'kbd',
  'll',
  'ls',
  'ml',
  'ner',
  'vom',
  'adm',
  'baum',
  'fa',
  'pac',
  's',
  'sob',
];

export const TypeOfJob: { [key in TNameOfJob]: TTypeOfJob } = {
  b: {
    name: "b",
    longName: "brigadieren",
  },
  f: {
    name: "f",
    longName: "feiertag",
  },
  kd: {
    name: "kd",
    longName: "kranken Den",
  },
  kon: {
    name: "kon",
    longName: "kontrolle",
  },
  ma: {
    name: "ma",
    longName: "arbeit minuten",
  },
  md: {
    name: "md",
    longName: "dop minuti (ot klienta)",
  },
  mk: {
    name: "mk",
    longName: "kontroll minuten",
  },
  mn: {
    name: "mn",
    longName: "dop minuti (ot nas)",
  },
  ms: {
    name: "ms",
    longName: "strahl minuten",
  },
  mz: {
    name: "mz",
    longName: "big strahlen arbeit",
  },
  n: {
    name: "n",
    longName: "net raboti (oplachivajem rabotnjiku)",
  },
  nn: {
    name: "nn",
    longName: "ne rabotal (ne oplat, vihodnoi)",
  },
  rep: {
    name: "rep",
    longName: "remont el.oborudovania",
  },
  sta: {
    name: "sta",
    longName: "stapler",
  },
  ubo: {
    name: "ubo",
    longName: "uborka ceha",
  },
  wtr: {
    name: "wtr",
    longName: "wtralj",
  },
  doo: {
    name: "doo",
    longName: "dorabotka oshibok",
  },
  u: {
    name: "u",
    longName: "urlaub",
  },
  k: {
    name: "k",
    longName: "kranken",
  },
  kbd: {
    name: "kbd",
    longName: "kranken bezBolnicnogo den",
  },
  ll: {
    name: "ll",
    longName: "lernen (lehrer)",
  },
  ls: {
    name: "ls",
    longName: "lernen (skolnieks)",
  },
  ml: {
    name: "ml",
    longName: "lehrer skolnieks minut",
  },
  ner: {
    name: "ner",
    longName: "neizvestnaja rabota",
  },
  vom: {
    name: "vom",
    longName: "vodjitelj mashini",
  },
  adm: {
    name: "adm",
    longName: "administrieren",
  },
  baum: {
    name: "baum",
    longName: "stroika ceha",
  },
  fa: {
    name: "fa",
    longName: "fail",
  },
  pac: {
    name: "pac",
    longName: "packung",
  },
  s: {
    name: "s",
    longName: "storungen",
  },
  sob: {
    name: "sob",
    longName: "sobranie",
  },
};
