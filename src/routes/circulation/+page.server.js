import { transaction } from '$lib/db.js';
import { date } from '$lib/helpers.js';
import { pojoData } from '$lib/serverHelpers.js';
import { response, transColumns } from '../../lib/serverHelpers';

export async function load({ url }) {
  let params = {};
  for (let [key, val] of url.searchParams.entries()) {
    if (key === 'due') {
      if (val === 'today') {
        params.due_at = { lte: new Date() };
        params.returned_at = { equals: null };
      } else params['due_at'] = { lte: new Date(), gte: new Date(val) };
    } else if (val) {
      params[key] = val;
    }
  }
  let transactions = await transaction.findMany({
    select: {
      item: true,
      user: true,
      comments: true,
      due_at: true,
      issued_at: true,
      returned_at: true,
      id: true
    },
    where: params
  });
  return {
    columns: transColumns(),
    transactions: transactions.map(
      ({ id, item, user, comments, due_at, issued_at, returned_at }) => ({
        id,
        user: `${user.id} ${user.name}`,
        item: `${item.acc_no} ${item.title}`,
        issued_at: date(issued_at),
        due_at: date(due_at),
        returned_at: date(returned_at) || 'NA',
        comments
      })
    )
  };
}

export const actions = {
  delete: async function({ request }) {
    const { id } = await pojoData(request);
    await transaction.delete({ where: { id: +id } });
  },
  return: async function({ request }) {
    return await response(async () => {
      const { id, comments } = await pojoData(request);
      await transaction.update({ where: { id: +id }, data: { returned_at: new Date(), comments } });
    });
  }
};
