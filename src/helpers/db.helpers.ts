import { Model } from 'mongoose'

export const getById = async (model: Model<any>, id: string, project: any = null) => {
    const data = await model.findById(id, project, {lean: { virtuals: true }});
    return data;
}

export const findOne = async (model: Model<any>, query: object, project: any = null) => {
    const data = await model.findOne(query, project, {lean: { virtuals: true }});
    return data;
}


export const getAll = async (model: Model<any>, query: any, pageNumber: number = 1, pageSize: number = 20, project: any = null, includeSkip: boolean = true) => {
    const items = await model.find(query, project, {lean: { virtuals: true }}).skip(includeSkip ? ((pageNumber - 1) * pageSize) : 0).limit(includeSkip ? pageSize : 0).sort({createdAt: -1})
    const totalItems = await model.find(query).count();
    return {items, pageNumber, pageSize, totalItems};
}

// insert or update
export const upsert = async(model: Model<any>, data: any, id?: string) => {
    let dataRes = null;
    if(id) {
        // update
        delete data.id;
        dataRes = await model.findByIdAndUpdate(id, {...data}, {new: true})
    } else {
        dataRes = await model.create(data);
    }
    return dataRes;
}
export const deleteById = async(model: Model<any>, id: string) => {
    const deleteResp = await model.deleteOne({_id: id})
    // @ts-ignore
    return deleteResp.deletedCount > 0
}
export const deleteMany = async (model: Model<any>, query: object) =>{
    const res = await model.deleteMany(query);
    return res.deletedCount;
}  