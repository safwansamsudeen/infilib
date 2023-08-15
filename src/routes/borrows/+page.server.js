import {Transaction, Book, Member} from "$lib/db.js";

export async function load() {
    // Obtain all the models,
    const transactions = await Transaction.find({}).lean().exec();
    const books = await Book.find({}).lean().exec();
    const members = await Member.find({}).lean().exec();

    // Extract ID from book and member in transactions and replace them with the actual book and member details
    transactions.forEach(transaction => {
        transaction.book = books.find(book => book._id.equals(transaction.book));
        transaction.member = members.find(member => member._id.equals(transaction.member));
        transaction.book = {title: transaction.book.title, isbn: transaction.book.isbn}
        transaction.member = {name: transaction.member.name, roll_no: transaction.member.roll_no}
    })

    return {
        books: books.map(({title, isbn}) => ({title, isbn})),
        transactions: transactions.map(({_id, book, member, borrowed, due_on, returned, comments}) => ({_id: _id.toString(), book, member, borrowed, due_on, returned, comments})),
        members: members.map(({name, roll_no}) => ({name, roll_no}))
    };
}

export const actions = {
    delete: async function({request}) {
        const {_id} = await request.json();
        await Transaction.findOneAndDelete({_id});
    },
    return: async function({request}) {
        const {_id} = await request.json();
        console.log(_id)
        await Transaction.findOneAndUpdate({_id}, {returned: new Date()});
    }
};
