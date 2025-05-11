// The Pont class is re-exported as a type to avoid instantiating it.
// It a Pont instance is needed, it should be created from the core package.
export { pont, type Pont } from "@auaust/pont";
export { createPontApp } from "./createPontApp.jsx";
