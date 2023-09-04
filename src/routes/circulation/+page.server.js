import { Transaction } from "$lib/db.js";
import { find, pojoData } from "$lib/helpers.js";

export async function load({ url }) {
  let params = {};
  for (let [key, val] of url.searchParams.entries()) {
    if (key === "due") {
      if (val === "today") {
        params.due_on = { $lte: new Date() };
      }
      // else params["due_on"] = {$lte: new Date() , $gte: new Date(val)}
    } else if (val) {
      params[key] = val;
    }
  }
  let transactions = await find(Transaction, params, {
    populate: ["book", "member"],
  });
  return {
    transactions: transactions.map((t) => ({ ...t, _id: t._id.toString() })),
  };
}

export const actions = {
  delete: async function ({ request }) {
    const { _id } = await request.json();
    await Transaction.findOneAndDelete({ _id });
  },
  return: async function ({ request }) {
    const { _id, comments } = await pojoData(request);
    await Transaction.findOneAndUpdate(
      { _id },
      { returned: new Date(), comments },
    );
  },
};
