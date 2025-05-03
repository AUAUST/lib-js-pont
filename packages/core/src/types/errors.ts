/**
 * A record of form identifiers to their error bags.
 */
export type ErrorBags = {
  [formName: string]: ErrorBag;
};

/**
 * A record of field names to their errors.
 */
export type ErrorBag = {
  [fieldName: string]: Errors;
};

/**
 * A single error message or an array of error messages.
 */
export type Errors = string | string[];
