import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => (this.#database = JSON.parse(data)))
      .catch(() => this.#persist());
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) =>
        Object.entries(search).some(([key, value]) => row[key].includes(value))
      );
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const rawIndex = this.#database[table].findIndex((raw) => raw.id === id);

    if (rawIndex > -1) {
      this.#database[table][rawIndex] = { id, ...data };
      this.#persist();
    }
  }

  delete(table, id) {
    const rawIndex = this.#database[table].findIndex((raw) => raw.id === id);

    if (rawIndex > -1) {
      this.#database[table].splice(rawIndex, 1);
      this.#persist();
    }
  }
}
