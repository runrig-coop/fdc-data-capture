/**
 * Ad hoc parsing for environment variables. This should probably be replaced
 * by something like dotenv from NPM once packaging decisions have been made.
 * They each take a key and the Node environment object (i.e., `process.env`).
 */

/// <reference path="../types/environment.d.ts"/>
type EnvVarKey = keyof NodeJS.ProcessEnv

// Retrieve env vars that are intended to represent a BOOLEAN values.
export function getEnvVarBool(key: EnvVarKey): boolean {
  // @ts-ignore
  const env = process?.env;

  // Default to false when there is no valid environment object.
  if (!env || typeof env !== 'object') return false;
  // Otherwise derive the value for the provided key.
  const val = env[key];

  // If the var is declared but w/o a value, intepret that as implicit `true`.
  if (key in env && val === undefined) return true;

  // Just in case some prior parsing has been performed to transform the
  // properties of `env` to a boolean or integer, try to coerce them.
  const truthyTypes = ['boolean', 'number'];
  if (truthyTypes.includes(typeof val)) return !!val;
  // But if it's any other type of non-string value, treat it as `false`.
  if (typeof val !== 'string') return false;

  // To simplify the set of truth values, transform to lowercase first.
  const str: string = val.toLowerCase();
  const truthValues = ['true', 't', '1', 'yes', 'y'];
  if (truthValues.includes(str)) return true;

  // Treat all other string values as `false`.
  return false;
}

// Retrieve env vars that are intended to represent a STRING values.
export function getEnvVarString(key: EnvVarKey): string {
  // @ts-ignore
  const env = process?.env;

  // Default to the empty string when there is no valid environment object.
  if (!env || typeof env !== 'object') return '';
  // Otherwise derive the value for the provided key.
  const val = env[key];

  // If the value is nullish or cannot be coerced to a string fallback on `''`.
  const isUnstringable = !val
    || Number.isNaN(val)
    || typeof val.toString !== 'function';
  if (isUnstringable) return '';

  // Otherwise perform the string coercion before returning.
  return val.toString();
}
