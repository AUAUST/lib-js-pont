/**
 * Transforms the title of the page. Receives the title
 * received from the server and returns the title to be
 * displayed in the browser tab.
 */
export type TitleTransformerSignature = (title: string) => string;
