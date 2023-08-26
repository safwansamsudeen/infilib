import {Book} from "$lib/db.js";
import {pojoData, find, listifyData} from "$lib/helpers.js";

export async function load() {
    const books = find(Book, {});
    return {books};
}

export const actions = {
    create: async function ({request}) {
        const data = await pojoData(request);
        listifyData(data, ["authors", "subjects", "languages"])
        await Book.create(data);
    }, update: async function ({request}) {
        let {acc_no, ...updatedData} = await pojoData(request);
        listifyData(updatedData, ["authors", "subjects", "languages"])
        await Book.findOneAndUpdate({acc_no: +acc_no}, updatedData)
    }, delete: async function({request}) {
        const {acc_no} = await request.json();
        await Book.findOneAndDelete({acc_no: +acc_no});
    }
};
