const express = require("express");
const router = express.Router();
const ObjectID = require("mongodb").ObjectId;

function returnSection(questions, section, result) {
  const arr = [];
  for (const q of questions) {
    for (const r of section) {
      if (parseInt(q.no.substring(2)) === r) {
        arr.push({ question: q.qn, result: result[`qn${r}`] });
      }
    }
  }
  return arr;
}

router.get("/:id", async function (req, res) {
  let result = await req.mongoClient
    .collection("results")
    .findOne({ _id: new ObjectID(req.params.id) });

  let questions = await req.mongoClient
    .collection("questions")
    .find({})
    .toArray();

  //for (let i = 0; i <= questions.length - 1; i++) {
  //  questions[i]["result"] = result["qn" + (i + 1)];
  //}

  const poorHealth = [1, 4, 6, 7, 13, 14, 16, 18];
  const finances = [20, 21];
  const familySupport = [2, 8, 10, 12, 15];
  const esteem = [3, 5, 9, 11, 17, 19];

  const sectionObj = {
    poorHealthArr: returnSection(questions, poorHealth, result),
    financesArr: returnSection(questions, finances, result),
    familySupportArr: returnSection(questions, familySupport, result),
    esteemArr: returnSection(questions, esteem, result),
  };

  res.status(200);
  res.render("profile", {
    result,
    sectionObj,
  });
});

module.exports = router;
