const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const username = request.headers.username;

  if(!username) {
    return response.status(404).json({error: "Request username header not found"});
  }

  const user = users.find((_user) => _user.username == username);

  if(!user) {
    return response.status(404).json({error: "User not found"});
  }

  request.user = user;

  next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body

  const userAlreadyExists = users.some((_user) => _user.username == username);

  if(userAlreadyExists){
    return response.status(400).json({error: "User already exists"});
  }

  const user = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  }

  users.push(user);

  return response.status(201).json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const todos = request.user.todos;

  return response.status(200).json(todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title, deadline} = request.body;

  const user = request.user;

  const index = users.indexOf(user);

  const todoItem = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todoItem)

  users.splice(index, 1, user)

  return response.status(201).json(todoItem)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title, deadline} = request.body;

  const id = request.params.id;

  const user = request.user;

  const todoItem = user.todos.find((_todoItem) => _todoItem.id == id);

  if(!todoItem){
    return response.status(404).json({error: "Todo item not found"});
  }

  const userIndex = users.indexOf(user);

  const todoIndex = user.todos.indexOf(todoItem);

  todoItem.title = title;

  todoItem.deadline = deadline;

  user.todos.splice(todoIndex, 1, todoItem);

  users.splice(userIndex, 1, user);

  return response.status(200).json(todoItem);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const id = request.params.id;

  const user = request.user;

  const todoItem = user.todos.find((_todoItem) => _todoItem.id == id);

  if(!todoItem){
    return response.status(404).json({error: "Todo item not found"});
  }

  const userIndex = users.indexOf(user);

  const todoIndex = user.todos.indexOf(todoItem);

  todoItem.done = true;

  user.todos.splice(todoIndex, 1, todoItem);

  users.splice(userIndex, 1, user);

  return response.status(200).json(todoItem);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const id = request.params.id;

  const user = request.user;

  const todoItem = user.todos.find((_todoItem) => _todoItem.id == id);

  if(!todoItem){
    return response.status(404).json({error: "Todo item not found"});
  }

  const userIndex = users.indexOf(user);

  const todoIndex = user.todos.indexOf(todoItem);

  user.todos.splice(todoIndex, 1);

  users.splice(userIndex, 1, user);

  return response.status(204).send();
});

module.exports = app;