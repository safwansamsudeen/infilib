import { item, transaction, user } from "$lib/db.js";

export async function load({ params }) {
  const _users = await user.findMany({
    where: {
      subscriptions: { some: { type: { library_slug: params.library } } },
    },
    include: { subscriptions: { include: { type: true } } },
  });
  const nmale = _users.reduce((c, user) => c + (user.gender === "M"), 0);
  const nactive = _users.reduce(
    (c, user) =>
      c +
      !!user.subscriptions.find(
        ({ type, active }) => active && type.library_slug === params.library,
      ),
    0,
  );
  const ageCategories = {
    twelveAndUnder: [-Infinity, 12],
    thirteenTo18: [13, 18],
    nineteenTo25: [19, 25],
    twentySixTo35: [26, 35],
    thirtySixTo50: [36, 50],
    fiftyOneTo60: [51, 60],
    sixtyOneTo70: [61, 70],
    seventyOneAndAbove: [71, Infinity],
  };
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const thisMonth = [new Date(year, month), new Date(year, month + 1)];
  const thisYear = [new Date(year, 0), new Date(year + 1, 0)];
  const users = {
    n: _users.length,
    categories: {
      gender: [nmale, _users.length - nmale],
      age: {},
      subscriptionActivity: [nactive, _users.length - nactive],
    },
    nsubscribed: {
      thisMonth: _users.reduce(
        (c, user) =>
          c +
          (!!user.subscriptions.find(
            ({ type, active }) =>
              active && type.library_slug === params.library,
          ) &&
            thisMonth[0] <= user.purchased_on &&
            user.purchased_on < thisMonth[1]),
        0,
      ),
      thisYear: _users.reduce(
        (c, user) =>
          c +
          (!!user.subscriptions.find(
            ({ type, active }) =>
              active && type.library_slug === params.library,
          ) &&
            thisYear[0] <= user.purchased_on &&
            user.purchased_on < thisYear[1]),
        0,
      ),
    },
  };
  for (const user of _users) {
    const age = new Date(new Date() - user.date_of_birth).getFullYear() - 1970;
    for (const category of Object.values(ageCategories)) {
      if (category[0] <= age && age <= category[1]) {
        if (!users.categories.age[category]) {
          users.categories.age[category] = 1;
        } else {
          users.categories.age[category]++;
        }
      }
    }
  }
  const _items = await item.findMany({
    where: { library_slug: params.library },
    include: { book: { include: { authors: true } }, magazine: true },
  });
  const nbooks = _items.reduce((c, item) => c + !!item.book, 0);
  const items = {
    n: _items.length,
    npages: _items.reduce((c, item) => c + item.no_of_pages, 0),
    worth: _items.reduce((c, item) => c + item.purchase_price, 0),
    categories: {
      type: [nbooks, _items.length - nbooks],
      status: {
        reference: _items.reduce((c, item) => c + item.reference, 0),
        borrowed: _items.reduce((c, item) => c + (item.status === "OUT"), 0),
        available: _items.reduce(
          (c, item) => c + (!item.reference && item.status === "IN"),
          0,
        ),
        damagedLost: _items.reduce(
          (c, item) => c + (item.status === "UNAVAILABLE"),
          0,
        ),
      },
    },
    nValidMagazines: _items.reduce(
      (c, item) => c + (item.magazine?.to > new Date()),
      0,
    ),
    nBookLevels: new Set(_items.map(({ level }) => level)).size,
    nCallNums: new Set(_items.map(({ call_no }) => call_no)).size,
    nPublishers: new Set(_items.map(({ publisher_id }) => publisher_id)).size,
    nAuthors: new Set(
      _items.reduce(
        (
          all_authors,
          { book },
        ) => [...all_authors, ...(book?.authors.map(({ id }) => id) || [])],
        [],
      ),
    ).size,
  };
  return {
    items,
    transactions: {
      nborrows: (await transaction.findMany({
        where: { item: { library_slug: params.library } },
      }))
        .length,
    },
    users,
  };
}
