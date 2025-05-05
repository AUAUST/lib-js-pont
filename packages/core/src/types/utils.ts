export type Primitive = string | number | boolean;

export type Url = `https://${string}` | (string & {});

export type ComponentName = string;

export type { Method } from "../utils/methods.js";
