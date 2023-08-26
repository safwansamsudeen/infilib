import {Book, Member, Transaction} from "$lib/db.js";
import {redirect} from "@sveltejs/kit";
import {find, pojoData} from "$lib/helpers.js"

export async function load({params}) {
    const members = await find(Member)
    const book = await find(Book, {_id: params.acc_no}, {populate: [], one:true});
    return {
        book,
        members,
    };
}

export const actions = {
    borrow: async function ({request, params}) {
        const data = await pojoData(request);
        await Transaction.create({
            ...data,
            book: params.acc_no,
        });
        throw redirect(303, '/circulation/');
    }
};
