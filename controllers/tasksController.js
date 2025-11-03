import {
  getAllTasks,
  getTaskByState,
  changeTasksState,
  createTask,
  updatedTask,
  deleteTask,
} from "../models/tasksModel.js";

// Create a new task
export const addTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Task title and description are required" });
    }

    const newTask = await createTask({ title, description });
    res.status(201).json(newTask);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating task", details: error.message });
  }
};

// Update an existing task
export const updateTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const taskId = parseInt(req.params.id);

    if (!taskId || !title || !description) {
      return res.status(400).json({
        error: "Task ID, title, and description are required for update",
      });
    }

    const updated = await updatedTask({ id: taskId, title, description });
    res
      .status(200)
      .json({ message: `Task ID ${taskId} updated successfully`, updated });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating task", details: error.message });
  }
};

// Delete a task
export const removeTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);

    if (!taskId) {
      return res
        .status(400)
        .json({ error: "Task ID is required for deletion" });
    }

    await deleteTask(taskId);
    res.status(200).json({ message: `Task ID ${taskId} deleted successfully` });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting task", details: error.message });
  }
};

// Get all tasks
export const listTasks = async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving tasks", details: error.message });
  }
};

// Get tasks by state
export const listTasksByState = async (req, res) => {
  try {
    const { state } = req.params;

    switch (state) {
      case "To Do":
        const tasks = await getTaskByState(state);
        res.status(200).json(tasks);
        break;
      case "In Progress":
        const tasksInProgress = await getTaskByState(state);
        res.status(200).json(tasksInProgress);
        break;
      case "Done":
        const tasksDone = await getTaskByState(state);
        res.status(200).json(tasksDone);
        break;
      default:
        return res.status(400).json({
          error: `Invalid state '${state}'. Valid states are: 'To Do', 'In Progress', 'Done'`,
        });
    }
  } catch (error) {
    res.status(500).json({
      error: `Error retrieving tasks with state '${state}'`,
      details: error.message,
    });
  }
};

export const changeStates = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Task ID is required to change state" });
    }
    const changedState = await changeTasksState(parseInt(id));
    if (changedState) {
      res.status(200).json({
        message: `Task ID ${id} state changed successfully`,
        changedState,
      });
    } else {
      res
        .status(404)
        .json({ error: `Task ID ${id} doesn't have the expected state` });
    }
  } catch (error) {
    res.status(500).json({
      error: `Error changing state for task ID ${id}`,
      details: error.message,
    });
  }
};