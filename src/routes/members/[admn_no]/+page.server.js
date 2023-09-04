import { Member, Transaction } from "$lib/db.js";
import { pojoData, find, listifyData } from "$lib/helpers.js";

export async function load({ params }) {
  // Get book based on acc_no (_id)
  const member = await find(Member, { _id: params.admn_no }, { one: true });
  const borrows = await find(
    Transaction,
    { member: params.admn_no },
    { populate: ["member", "book"] },
  );
  return {
    member,
    borrows: borrows.map((t) => ({ ...t, _id: t._id.toString() })),
  };
}

export const actions = {
  update: async function ({ request }) {
    let { _id, ...updatedData } = await pojoData(request);
    await Member.findOneAndUpdate({ _id }, updatedData);
  },
  delete: async function ({ request }) {
    const { _id } = await request.json();
    await Member.findOneAndDelete({ _id });
  },
};
