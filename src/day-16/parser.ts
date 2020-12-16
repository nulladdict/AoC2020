export type Rule = (x: number) => boolean;

export type Rulebook = Record<string, Rule>;

export function parse(input: string) {
  const [rules, ticket, nearby] = input.split("\n\n");
  const rulebook = parseRules(rules);
  const my = parseTicket(ticket.split("\n")[1]);
  const other = nearby.split("\n").slice(1).map(parseTicket);
  return { rulebook, my, other };
}

export function parseRules(rules: string): Rulebook {
  return Object.fromEntries(
    rules.split("\n").map((rule) => {
      const [name, bounds] = rule.split(": ");
      const expression = `return ${bounds
        .replace(/or/g, "||")
        .replace(/-/g, " <= x && x <= ")}`;
      const f = new Function("x", expression) as Rule;
      return [name, f];
    })
  );
}

export function parseTicket(ticket: string) {
  return ticket.split(",").map((x) => parseInt(x, 10));
}
