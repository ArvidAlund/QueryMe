import express from 'express';
const indexRouter = express.Router();

import question from '../functions/question/question.js';

/* GET home page. */
indexRouter.get('/question', async (req, res) => {
  await question(req, res);
});

export default indexRouter;
