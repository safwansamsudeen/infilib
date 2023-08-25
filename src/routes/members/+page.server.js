import {Member} from "$lib/db.js";
import {find} from "$lib/helpers.js";

export async function load() {
    return {members: await find(Member, {})};
}

export const actions = {
    create: async function ({request}) {
        const data = await request.formData();
        await Member.create({
            name: data.get("name"), grade: data.get("grade"), section: data.get("section"), admn_no: data.get("admn_no"),
        });
    }, update: async function ({request}) {
        const data = await request.formData();
        await Member.findOneAndUpdate({admn_no: data.get("admn_no")}, {name: data.get("name"), grade: data.get("grade"), section: data.get("section")})
        return {
            name: data.get("name"), grade: data.get("grade"), section: data.get("section"), admn_no: data.get("admn_no"),
        };
    }, delete: async function ({request}) {
        const {admn_no} = await request.json();
        await Member.findOneAndDelete({admn_no})
    }
};
