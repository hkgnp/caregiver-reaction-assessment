const express = require("express");
const router = express.Router();
const ObjectID = require("mongodb").ObjectId;

router.get("/:id", async function (req, res) {
  const result = await req.mongoClient
    .collection("results")
    .findOne({ _id: new ObjectID(req.params.id) });

  let questions = await req.mongoClient
    .collection("questions")
    .find({})
    .toArray();

  for (let i = 0; i <= questions.length - 1; i++) {
    questions[i]["result"] = result["qn" + (i + 1)];
  }

  res.status(200);
  res.render("profile", {
    questions: questions,
  });
});

module.exports = router;
