const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const foundUser = users.find(user => user.username === username);

  if (!foundUser) {
    return response.status(404).json({
      error: 'usuário não encontrado'
    });
  }

  request.user = foundUser;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const foundUser = users.find(user => user.username === username);

  if (foundUser) {
    return response.status(400).json({
      error: 'usuário já existe'
    })
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos:[]
  }

  users.push(newUser);

  return response.status(201).json(newUser);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;

  const task = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  user.todos.push(task);

  return response.status(201).json(task);

});


app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;

  const { id } = request.params;

  auxTodos = user.todos;
  
  const todo = auxTodos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({
      error: "task does not exist"
    })
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(todo);


});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  auxTodos = user.todos;

  const todo = auxTodos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({
      error: "Todo not found"
    })
  }

  todo.done = true;

  return response.json(todo);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  auxTodos = user.todos;

  const todoIndex = auxTodos.findIndex(todo => todo.id === id);

  if (todoIndex === -1) {
    return response.status(404).json({
      error: "task does not exist"
    })
  }

  auxTodos.splice(todoIndex, 1);

  return response.status(204).send();

});

module.exports = app;