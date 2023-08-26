import {Member} from "$lib/db.js";
import {find, pojoData} from "$lib/helpers.js";

export async function load() {
    return {members: await find(Member, {})};
}

export const actions = {
    create: async function ({request}) {
        await Member.create(await pojoData(request));
    }, update: async function ({request}) {
        const {admn_no, ...updatedData} = await pojoData(request);
        await Member.findOneAndUpdate({admn_no: +admn_no}, updatedData)
    }, delete: async function ({request}) {
        const {admn_no} = await request.json();
        await Member.findOneAndDelete({admn_no: +admn_no})
    }
};
