const router = require("express").Router();
const controller = require("./counts.controller");

router.route("/:countId").get(controller.read);
router.route("/").get(controller.list);

module.exports = router;