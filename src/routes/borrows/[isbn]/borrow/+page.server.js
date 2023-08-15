import {Book, Member, Transaction} from "$lib/db.js";
import {redirect} from "@sveltejs/kit";

export async function load({params}) {
    const book = await Book.findOne({isbn: params.isbn}).lean().exec();
    const members = await Member.find({}).lean().exec();
    book._id = book._id.toString();
    return {
        book: book,
        members: members.map(({roll_no, name}) => ({roll_no, name}))
    };
}

export const actions = {
    borrow: async function ({request, params}) {
        const data = await request.formData();
        const book = await Book.findOne({isbn: params.isbn}).exec();
        // Get member from form and create borrow transaction with the request data, member, and book
        const member = await Member.findOne({roll_no: data.get("member")}).exec();
        console.log(data.get("borrowed"), data.get("comments"))
        await Transaction.create({
            book: book._id,
            member: member._id,
            borrowed: data.get("borrowed"),
            due_on: data.get("due_on"),
            comments: data.get("comments")
        });
        throw redirect(303, '/borrows/');
    }
};
