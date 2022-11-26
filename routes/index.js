const express = require("express");
const router = express.Router();

router.get("/", async function (req, res) {
  const questions = await req.mongoClient
    .collection("questions")
    .find({})
    .toArray();
  res.render("index", {
    questions: questions,
  });
});

router.post("/", async function (req, res) {
  let numArr = ["null"];
  for (let i = 1; i <= 21; i++) {
    numArr.push(parseInt(req.body["qn" + i]));
  }

  let postObj = req.body;

  let scoreDescription = {};
  //Disturbed schedule and poor health: 	Items 1, 4, 6, 7, 13, 14, 16 and 18.
  //Lack of finances: 			Items 20 and 21.
  //Lack of family support: 		Items 2, 8, 10, 12 and 15. (Note that Item 2 has to be reverse scored, to align it with the rest of the items in this subscale/domain)
  //Caregiver esteem: 			Items 3, 5, 9, 11, 17 and 19.
  scoreDescription["poorHealth"] =
    numArr[1] +
    numArr[4] +
    numArr[6] +
    numArr[7] +
    numArr[13] +
    numArr[14] +
    numArr[16] +
    numArr[18];

  scoreDescription["finances"] = numArr[20] + numArr[21];

  scoreDescription["familySupport"] =
    Math.abs(numArr[2] - 6) + numArr[8] + numArr[10] + numArr[12] + numArr[15];

  scoreDescription["esteem"] =
    numArr[3] + numArr[5] + numArr[9] + numArr[11] + numArr[17] + numArr[19];

  postObj["scoreDescription"] = scoreDescription;

  const result = await req.mongoClient.collection("results").insertOne(postObj);
  const id = result.insertedId;

  res.status(200);
  res.redirect(`/results/${id}`);
});

module.exports = router;
