export function metaphone(word: string): string {
  const input = word.toLowerCase().replace(/[^a-z]/g, "");
  if (input.length === 0) return "";

  let str = input;

  str = str.replace(/([^c])\1+/g, "$1");

  if (/^(kn|gn|pn|ae|wr)/.test(str)) {
    str = str.slice(1);
  }

  let code = "";
  let i = 0;

  while (i < str.length && code.length < 8) {
    const char = str[i]!;
    const next = str[i + 1] || "";
    const prev = i > 0 ? str[i - 1]! : "";

    if ("aeiou".includes(char)) {
      if (i === 0) code += char.toUpperCase();
      i++;
      continue;
    }

    let mapped = "";

    switch (char) {
      case "b":
        if (prev !== "m") mapped = "B";
        break;
      case "c":
        if ("eiy".includes(next)) mapped = "S";
        else mapped = "K";
        break;
      case "d":
        if (next === "g" && "eiy".includes(str[i + 2] || "")) mapped = "J";
        else mapped = "T";
        break;
      case "f":
        mapped = "F";
        break;
      case "g":
        if (next === "h" && !"aeiou".includes(str[i + 2] || "")) {
          i++;
          break;
        }
        if (i > 0 && "eiy".includes(next)) mapped = "J";
        else if (next !== "h") mapped = "K";
        break;
      case "h":
        if ("aeiou".includes(next) && !"aeiou".includes(prev)) mapped = "H";
        break;
      case "j":
        mapped = "J";
        break;
      case "k":
        if (prev !== "c") mapped = "K";
        break;
      case "l":
        mapped = "L";
        break;
      case "m":
        mapped = "M";
        break;
      case "n":
        mapped = "N";
        break;
      case "p":
        if (next === "h") {
          mapped = "F";
          i++;
        } else {
          mapped = "P";
        }
        break;
      case "q":
        mapped = "K";
        break;
      case "r":
        mapped = "R";
        break;
      case "s":
        if (next === "h" || (next === "i" && (str[i + 2] === "o" || str[i + 2] === "a"))) {
          mapped = "X";
          i++;
        } else if (next === "c" && str[i + 2] === "h") {
          mapped = "SK";
          i += 2;
        } else {
          mapped = "S";
        }
        break;
      case "t":
        if (next === "h") {
          mapped = "0";
          i++;
        } else if (next === "i" && (str[i + 2] === "o" || str[i + 2] === "a")) {
          mapped = "X";
          i++;
        } else {
          mapped = "T";
        }
        break;
      case "v":
        mapped = "F";
        break;
      case "w":
      case "y":
        if ("aeiou".includes(next)) mapped = char.toUpperCase();
        break;
      case "x":
        mapped = "KS";
        break;
      case "z":
        mapped = "S";
        break;
    }

    if (mapped && mapped !== code.slice(-mapped.length)) {
      code += mapped;
    }

    i++;
  }

  return code;
}
