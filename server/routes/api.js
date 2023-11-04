var express = require("express");
const { Question, Comment } = require("../db");
var router = express.Router();

router.post("/comments/:id", async function (req, res, next) {
  const id = req.params.id;
  const question = await Question.findOne({ id: id });
  const { text } = req.body;
  await question.addComment(await Comment.create({ text }));
  res.sendStatus(200);
});

router.post("/like/:id", async function (req, res, next) {
  const id = req.params.id;
  const question = await Question.findOne({ id: id });
  question.set({
    likes: ++question.likes,
  });
  await question.save();
  res.sendStatus(200);
});

router.post("/dislike/:id", async function (req, res, next) {
  const id = req.params.id;
  const question = await Question.findOne({ id: id });
  question.set({
    dislikes: ++question.dislikes,
  });
  await question.save();
  res.sendStatus(200);
});

router.get("/questions", async function (req, res, next) {
  const questions = await Question.findAll();
  const questionsWIthComments = [];
  for (let index = 0; index < questions.length; index++) {
    const question = questions[index];
    const comments = await question.getComments();
    questionsWIthComments.push({
      ...question.get({ plain: true }),
      comments: comments.map((c) => c.text),
    });
  }
  res.json(questionsWIthComments);
});

module.exports = router;
