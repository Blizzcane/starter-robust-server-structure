const router = require("express").Router();

const controller = require("./counts.controller");

const methodNotAllowed = require("../errors/methodNotAllowed");

const flipsRouter = require("../flips/flips.router");

router.use("/:countsId/flips", flipsRouter);

router.route("/:countId").get(controller.read).all(methodNotAllowed);

router.route("/").get(controller.list).all(methodNotAllowed);

module.exports = router;
