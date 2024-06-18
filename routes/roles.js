"use strict";

const _ = require("lodash");
const db = require("../db.js");
const express = require("express");
const router = express.Router();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
const tableName = "auth.roles";
const idAttribute = "role_id";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.get("/", function (req, res, _next) {
  db(tableName)
    .select()
    .where(req.query || {})
    .then((out) => res.status(200).jsonp(out))
    .catch((err) => res.status(404).jsonp(err));
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.post("/", function (req, res, _next) {
  db(tableName)
    .insert(req.body)
    .returning("*")
    .then((out) => res.status(200).jsonp(out))
    .catch((err) => res.status(404).jsonp(err));
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.get(`/:${idAttribute}`, function (req, res, _next) {
  db(tableName)
    .first()
    .where(req.params)
    .then((out) => {
      out.scopes = out.scopes.join(" ");
      res.status(200).jsonp(out);
    })
    .catch((err) => res.status(404).jsonp(err));
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.delete(`/:${idAttribute}`, function (req, res, _next) {
  db(tableName)
    .del()
    .where(req.params)
    .returning("*")
    .then((out) => res.status(200).jsonp(out))
    .catch((err) => res.status(404).jsonp(err));
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.patch(`/:${idAttribute}`, function (req, res, _next) {
  req.body.scopes = req.body.scopes.split(" ");
  db(tableName)
    .update(req.body, { patch: true })
    .where(req.params)
    .returning("*")
    .then((out) => res.status(200).jsonp(out))
    .catch((err) => res.status(404).jsonp(err));
});
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.put("/:role/perms", (req, res, _next) => {
  const data = _.pick({ ...req.params, ...req.body }, ["role", "perm"]);
  db("auth.role_perms")
    .insert(data)
    .onConflict()
    .ignore()
    .then(() => res.sendStatus(204))
    .catch((err) => res.status(404).jsonp(err));
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.delete("/:role/perms", (req, res, _next) => {
  const data = _.pick({ ...req.params, ...req.body }, ["role", "perm"]);

  db("auth.role_perms")
    .where(data)
    .del()
    .then(() => res.status(200).send())
    .catch((err) => res.status(404).jsonp(err));
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
module.exports = router;
