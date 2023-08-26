// Have a function that takes in all the parameters and returns a POJO version of querying that DB model
export async function find(model, params) {
    let res = await model.find(params).lean().exec();
    // Convert _id to string
    return res.map(({_id, ...r}) => ({...r, _id:  _id.toString()}));
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