export function enumSelector(definition) {
  return Object.keys(definition)
    .filter(Number)
    .map(key => ({ value: parseInt(key), text: pascalCaseToTitleCase(definition[key]) }));
}

export function pascalCaseToTitleCase(text: string) {
  return text.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
}