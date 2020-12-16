import { readToString } from "../stdin";
import { parse, Rulebook } from "./parser";

async function main() {
  const input = await readToString();
  const { rulebook, my, other } = parse(input);
  console.log(
    other
      .flat()
      .filter((x) => !checkRules(x, rulebook))
      .reduce((x, y) => x + y)
  );
}

function checkRules(value: number, rulebook: Rulebook) {
  const rules = Object.values(rulebook);
  return rules.some((rule) => rule(value));
}

main();
