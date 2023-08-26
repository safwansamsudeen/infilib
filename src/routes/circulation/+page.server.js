import {Transaction, Book, Member} from "$lib/db.js";
import {find, pojoData} from "$lib/helpers.js";

export async function load() {
    const transactions = await find(Transaction, {}, {populate: ["book", "member"]});
    return {transactions: transactions.map(t => ({...t, _id: t._id.toString()}))};
}

export const actions = {
    delete: async function({request}) {
        const {_id} = await request.json();
        await Transaction.findOneAndDelete({_id});
    },
    return: async function({request}) {
        const {_id} = await request.json();
        await Transaction.findOneAndUpdate({_id}, {returned: new Date()});
    },
    update: async function({request}) {
        const {_id, comments} = await pojoData(request);
        console.log(_id, comments)
        await Transaction.findOneAndUpdate({_id}, {returned: new Date(), comments});
    }
};
