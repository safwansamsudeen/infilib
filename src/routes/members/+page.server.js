import {Member} from "$lib/db.js";

export async function load() {
    const members = await Member.find({}).exec();
    return {
        members: members.map((m) => ({
            name: m.name, class_: m.class, roll_no: m.roll_no,
        })),
    };
}

export const actions = {
    create: async function ({request}) {
        const data = await request.formData();
        await Member.create({
            name: data.get("name"), class: data.get("class"), roll_no: data.get("roll_no"),
        });
    }, update: async function ({request}) {

        const {roll_no, name, class_} = await request.json();
        await Member.findOneAndUpdate({roll_no}, {name, class: class_})
    }, delete: async function ({request}) {
        const {roll_no } = await request.json();
        await Member.findOneAndDelete({roll_no})
    }
};
