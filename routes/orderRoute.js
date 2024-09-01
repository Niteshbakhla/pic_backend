const { getOrder } = require("../controllers/ordercontroller");
const { verifyToken } = require("../middlewares/verifyToken");

const router = require("express").Router();

router.get("/order/get", verifyToken, getOrder)

module.exports = router