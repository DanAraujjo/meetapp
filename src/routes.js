const { Router } = require("express");

const routes = new Router();

routes.get("/", (req, res) => {
  return res.json({ status: "online" });
});

module.exports = routes;
