const Task = require('../models/Task');

exports.getTasks = async(req , res ) => {
    const tasks = await Task.find({ user : req.user.id });
    res.json(tasks);
};

exports.createTask = async (req , res ) => {
    const { title , description, status, priority, dueDate } = req.body;

    const task = new Task({
        user: req.user.id,
        title,
        description,
        status,
        priority,
        dueDate
    });

    const saved = await task.save();
    res.status(201).json(saved);
};

exports.updateTask = async( req , res ) => {
    const task = await Task.findById(req.params.id);

    if(!task) return res.status(404).json({ message: 'Task not found'});
    if(task.user.toString() !== req.user.id)
        return res.status(401).json({ message : 'Not authorized'});

    const updated = await Task.findByIdAndUpdate(req.params.id , req.body, {
        new: true
    });

    res.json(updated);
};

exports.deleteTask = async(req, res) => {
    const task = await Task.findById(req.params.id);

    if(!task) return res.status(404).json({ message: 'Task not found'});
    if(task.user.toString() !== req.user.id)
        return res.status(401).json({ message : 'Not authorized'});

    await task.deleteOne();
    res.json({ message : 'Task Removed'})

};