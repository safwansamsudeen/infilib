import { Member } from "$lib/db.js";
import { find, pojoData } from "$lib/helpers.js";

export async function load() {
  return { members: await find(Member) };
}

export const actions = {
  create: async function ({ request }) {
    await Member.create(await pojoData(request));
  },
  update: async function ({ request }) {
    const { _id, ...updatedData } = await pojoData(request);
    console.log(updatedData);
    await Member.findOneAndUpdate({ _id }, updatedData);
  },
  delete: async function ({ request }) {
    const { _id } = await request.json();
    await Member.findOneAndDelete({ _id });
  },
};
