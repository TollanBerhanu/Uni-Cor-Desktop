const getOne = model => async (req, res) => {
    // const doc = await model.findOne({_id: id, createdBy: req.user._id}).exec()
    var doc = await model.findOne({_id: req.params.id}).exec()
    // else doc = await model.findOne({_id: req.user._id}).exec()
    if(!doc) res.status(404).end()
    res.status(200).json({ data: doc })
}

const getMany = model => async (req, res) => {
    // const doc = await model.find({createdBy: req.user._id}).exec()
    const docs = await model.find().exec()
    if(!docs) res.status(404).end()
    res.status(200).json({ data: docs })
}

const createOne = model => async (req, res) => {
    console.log(req.body);
    // const doc = await model.create({ ...req.body, createdBy: req.user._id })
    const doc = await model.create(req.body)
    if(!doc) res.status(404).end()
    console.log('Successfully registered!')
    res.status(200).send({ data: doc })
}

const updateOne = model => async (req, res) => {
    // const doc = await model.findOneAndUpdate({_id: req.params.id, createdBy: req.user._id}, req.body, { new: true }).exec()
    const doc = await model.findOneAndUpdate({_id: req.params.id}, req.body, { new: true }).exec()
    if(!doc) res.status(400).end()
    console.log('Successfully updated!' + req.all + doc)
    res.status(200).json({ data: doc })
}

const deleteOne = model => async (req, res) => {
    const doc = await model.findOneAndRemove({_id: req.params.id, createdBy: req.user._id}).exec()
    if(!doc) res.status(400).end()
    console.log('Successfully deleted!')
    res.status(200).json({ data: doc })
}


module.exports = model => ({
    getOne: getOne(model),
    getMany: getMany(model),
    createOne: createOne(model),
    updateOne: updateOne(model),
    deleteOne: deleteOne(model)
})