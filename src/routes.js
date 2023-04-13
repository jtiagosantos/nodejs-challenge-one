import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './helpers/build-route-path.js';

const tasks = [];

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.query;
      let filteredTasks = [];

      if (title && description) {
        tasks.forEach((task) => {
          const condition = 
            task.title.toLowerCase().includes(title.toLowerCase()) &&
            task.description.toLowerCase().includes(description.toLowerCase());
          
          if (condition) filteredTasks.push(task);
        });

        return res.end(JSON.stringify(filteredTasks));
      }

      if (title || description) {
        tasks.forEach((task) => {
          const condition = 
            task.title.toLowerCase().includes(title?.toLowerCase()) ||
            task.description.toLowerCase().includes(description?.toLowerCase());
          
          if (condition) filteredTasks.push(task);
        });

        return res.end(JSON.stringify(filteredTasks));
      }

      return res.end(JSON.stringify(tasks));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      if (!req.body) {
        return res.writeHead(404).end(JSON.stringify('Body is required'));
      }

      const { title, description } = req.body;

      if (!title) {
        return res.writeHead(400).end(JSON.stringify('title is a required field'));
      }

      if (!description) {
        return res.writeHead(400).end(JSON.stringify('description is a required field'));
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }
      tasks.push(task);

      res.writeHead(201).end();
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      const index = tasks.findIndex((task) => task.id === id);

      if (index === -1) {
        return res.writeHead(404).end(JSON.stringify('Task Not Found'));
      }

      if (!req.body) {
        return res.writeHead(404).end(JSON.stringify('Body is required'));
      }

      const { title, description } = req.body;
      let newData = {};

      if (title) newData = { ...newData, title };
      if (description) newData = { ...newData, description };

      tasks[index] = {
        ...tasks[index],
        ...newData,
        updated_at: new Date(),
      };

      res.writeHead(204).end();
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      const index = tasks.findIndex((task) => task.id === id);

      if (index === -1) {
        return res.writeHead(404).end(JSON.stringify('Task Not Found'));
      }

      tasks.splice(index, 1);

      res.writeHead(204).end();
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;

      const index = tasks.findIndex((task) => task.id === id);

      if (index === -1) {
        return res.writeHead(404).end(JSON.stringify('Task Not Found'));
      }

      const completedAtField = tasks[index].completed_at;

      tasks[index] = {
        ...tasks[index],
        completed_at: !completedAtField ? new Date() : null,
      };

      res.writeHead(204).end();
    }
  }
];