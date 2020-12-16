import { readToString } from "../stdin";
import { parse, Rule, Rulebook } from "./parser";

async function main() {
  const input = await readToString();
  const { rulebook, my, other } = parse(input);
  const validTickets = [my].concat(getValid(other, rulebook));
  const positions = solve(validTickets, rulebook);
  const result = Object.entries(positions)
    .filter(([name]) => name.startsWith("departure"))
    .map(([, index]) => my[index])
    .reduce((x, y) => x * y);
  console.log(result);
}

type Tickets = number[][];
type Positions = Record<string, number>;

function solve(tickets: Tickets, rulebook: Rulebook) {
  const possiblePostions = getPossiblePositions(tickets, rulebook);
  const finalPositions: Positions = {};
  while (true) {
    const next = Object.entries(possiblePostions).find(
      ([name, possible]) => possible.size === 1 && !(name in finalPositions)
    );
    if (!next) {
      return finalPositions;
    }
    const [name, position] = next;
    const index: number = position.values().next().value;
    finalPositions[name] = index;
    removeFromOthers(possiblePostions, name, index);
  }
}

function removeFromOthers(
  possiblePostions: PossiblePositions,
  name: string,
  index: number
) {
  for (const [otherName, otherPositions] of Object.entries(possiblePostions)) {
    if (name !== otherName) {
      otherPositions.delete(index);
    }
  }
}

type PossiblePositions = Record<string, Set<number>>;

function getPossiblePositions(
  tickets: Tickets,
  rulebook: Rulebook
): PossiblePositions {
  return Object.fromEntries(
    Object.entries(rulebook).map(([name, rule]) => [
      name,
      getPositions(tickets, rule),
    ])
  );
}

function getPositions(tickets: Tickets, rule: Rule) {
  return tickets
    .map(
      (ticket) =>
        new Set(
          Array.from(ticket.entries())
            .filter(([, value]) => rule(value))
            .map(([i]) => i)
        )
    )
    .reduce(intersection);
}

function intersection<T>(smallest: Set<T>, largest: Set<T>): Set<T> {
  if (smallest.size > largest.size) return intersection(largest, smallest);
  const result = new Set<T>();
  for (const item of smallest) {
    if (largest.has(item)) {
      result.add(item);
    }
  }
  return result;
}

function getValid(tickets: Tickets, rulebook: Rulebook) {
  return tickets.filter((ticket) =>
    ticket.every((value) => checkRules(value, rulebook))
  );
}

function checkRules(value: number, rulebook: Rulebook) {
  const rules = Object.values(rulebook);
  return rules.some((rule) => rule(value));
}

main();
