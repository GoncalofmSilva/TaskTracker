import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'tasks.json');

async function readTasks() {
  const data = await fs.promises.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function writeTasks(tasks) {
  await fs.promises.writeFile(filePath, JSON.stringify(tasks, null, 2));
}

let tasks = await readTasks();
let currentId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
let state = 'To Do';

export async function getAllTasks() {
  return await readTasks();
}

export async function getTaskByState(state) {
  const tasks = await readTasks();
  return tasks.filter(task => task.state === state);
}

export async function createTask({ title, description }) {
  const tasks = await readTasks();
  const newTask = { id: currentId++, title, description, state };
  tasks.push(newTask);
  await writeTasks(tasks);
  return newTask;
}

export async function updatedTask({ id, title, description }) {
  const tasks = await readTasks();
  const index = tasks.findIndex(task => task.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], title, description };
    await writeTasks(tasks);
    return tasks[index];
  }
  return null;
}

export async function deleteTask(id) {
  const tasks = await readTasks();
  const index = tasks.findIndex(task => task.id === id);
  if (index !== -1) {
    const deleted = tasks.splice(index, 1)[0];
    await writeTasks(tasks);
    return deleted;
  }
  return null;
}

export async function changeTasksState(id) {
  const tasks = await readTasks();
  const index = tasks.findIndex(task => task.id === id);
  if (index !== -1) {
    switch (tasks[index].state) {
      case 'To Do':
        tasks[index].state = 'In Progress';
        await writeTasks(tasks);
        return tasks[index];
      case 'In Progress':
        tasks[index].state = 'Done';
        await writeTasks(tasks);
        return tasks[index];
    }
  }
}