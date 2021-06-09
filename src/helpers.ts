/**
 * Try safely to parse input to object. Return string if not possible.
 */
export function parseInput(input: string) {
  try {
    let result = JSON.parse(input);
    return result;
  } catch (error) {
    return input;
  }
}
