import { Book, Transaction } from "$lib/db.js";
import { pojoData, find, listifyData } from "$lib/helpers.js";

export async function load({ params }) {
  // Get book based on acc_no (_id)
  const book = await find(Book, { _id: params.acc_no }, { one: true });
  console.log(book)
  const borrows = await find(
    Transaction,
    { book: params.acc_no },
    { populate: ["member", "book"] },
  );
  return {
    book,
    borrows: borrows.map((t) => ({ ...t, _id: t._id.toString() })),
  };
}

export const actions = {
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
