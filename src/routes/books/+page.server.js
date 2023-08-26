import { Book } from "$lib/db.js";
import { pojoData, find, listifyData } from "$lib/helpers.js";

export async function load() {
  const books = await find(Book);
  return { books };
}

export const actions = {
  create: async function ({ request }) {
    const data = await pojoData(request);
    listifyData(data, ["authors", "subjects", "languages"]);
    await Book.create(data);
  },
  update: async function ({ request }) {
    let { _id, ...updatedData } = await pojoData(request);
    listifyData(updatedData, ["authors", "subjects", "languages"]);
    await Book.findOneAndUpdate({ _id }, updatedData);
  },
  delete: async function ({ request }) {
    const { _id } = await request.json();
    await Book.findOneAndDelete({ _id });
  },
};
