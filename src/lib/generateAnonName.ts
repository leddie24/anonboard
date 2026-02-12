const adjectives = [
  "Brave",
  "Sneaky",
  "Clever",
  "Grumpy",
  "Happy",
  "Sleepy",
  "Witty",
  "Bold",
  "Calm",
  "Dizzy",
  "Eager",
  "Fancy",
  "Gentle",
  "Hasty",
  "Jolly",
  "Kind",
  "Lazy",
  "Mighty",
  "Noble",
  "Proud",
  "Quick",
  "Rowdy",
  "Silent",
  "Tough",
  "Zany",
];

const animals = [
  "Penguin",
  "Mango",
  "Otter",
  "Fox",
  "Panda",
  "Koala",
  "Tiger",
  "Falcon",
  "Dolphin",
  "Gecko",
  "Badger",
  "Moose",
  "Parrot",
  "Sloth",
  "Turtle",
  "Raven",
  "Bison",
  "Coyote",
  "Ferret",
  "Lemur",
  "Newt",
  "Quail",
  "Shrimp",
  "Walrus",
  "Yak",
];

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export function generateAnonName(userId: string, boardId: string): string {
  const hash = simpleHash(userId + boardId);
  const adjective = adjectives[hash % adjectives.length];
  const animal = animals[Math.floor(hash / adjectives.length) % animals.length];

  return `${adjective} ${animal}`;
}
