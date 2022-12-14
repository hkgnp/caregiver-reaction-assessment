const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const crypto = require("crypto");

const getHashedPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};

router.get("/", async (req, res) => {
  if (req.session && req.session.user) {
    const email = req.session.user.email;
    res.render("change-password", {
      user: email,
    });
  } else {
    req.flash(
      "error_messages",
      "The page you were trying to access is only for registered users."
    );
    res.redirect("/login");
  }
});

router.post("/", async (req, res) => {
  await req.mongoClient
    .collection("users")
    .updateOne(
      { _id: new ObjectId(req.session.user.id) },
      { $set: { password: getHashedPassword(req.body.password) } }
    );
  req.session.user = null;
  req.flash(
    "success_messages",
    "Password successfully changed. Please login again."
  );
  res.redirect("/dashboard");
});
module.exports = router;
