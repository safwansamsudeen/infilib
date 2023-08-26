// Have a function that takes in all the parameters and returns a POJO version of querying that DB model
export function find(model, params = {}, {populate=[], one = false}={}) {
    let pms = one ? model.findOne(params) : model.find(params)
    return pms.populate(populate).lean().exec();
}

export async function pojoData(request){
    return Object.fromEntries(await request.formData())
}

export async function listifyData(data, keys){
    keys.forEach(key => {
        if (key in data) {
            data[key] = data[key].split(",").map(x => x.trim());
        }
    });
}