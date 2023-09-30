import { transaction, user } from '$lib/db.js';
import { date } from '$lib/helpers.js';
import { parseData, pojoData, response, transColumns, userColumns } from '$lib/serverHelpers.js';
import { validateUserProperty } from '$lib/validators.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
  let user_obj = await user.findUnique({
    where: { id: +params.id }
  });

  const transactions = await transaction.findMany({
    where: { user_id: +params.id },
    include: { item: true }
  });

  return {
    user: user_obj,
    transactions: transactions.map(({ id, item, issued_at, due_at, returned_at, comments }) => ({
      id,
      item: `${item.acc_no} ${item.title}`,
      issued_at: date(issued_at),
      due_at: date(due_at),
      returned_at: date(returned_at) || 'NA',
      comments
    })),
    columns: userColumns(),
    transColumns: transColumns(false)
  };
}

export const actions = {
  update: async ({ request }) => {
    return await response(async () => {
      const data = await pojoData(request);
      parseData(data, ['id', 'gender']);
      data.gender = data.gender.value;
      validateUserProperty(data.gender, 'gender');
      validateUserProperty(data.email_address, 'email_address');
      await user.update({ where: { id: data.id }, data });
    });
  },
  delete: async ({ request, params }) => {
    return await response(
      async () => {
        const { confirmed } = await pojoData(request);
        if (confirmed === 'true') {
          await user.delete({ where: { id: +params.id } });
        }
      },
      redirect('/books', 200)
    );
  }
};
