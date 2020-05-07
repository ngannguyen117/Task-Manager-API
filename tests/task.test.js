/* eslint-disable */

const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');

const { userOne, taskThree, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'From my test',
    })
    .expect(201);
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test('Should not create task for unauthenticated user', async () => {
  await request(app)
    .post('/tasks')
    .send({ description: 'From my test' })
    .expect(401);
});

test('Should get all tasks for userOne', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toBe(2);
});

test("Should not delete other users' task", async () => {
  await request(app)
    .delete(`/tasks/${taskThree._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(404);
  const task = await Task.findById(taskThree._id);
  expect(task).not.toBeNull();
});
