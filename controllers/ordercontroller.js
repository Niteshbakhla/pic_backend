const Order = require("../model/order")

const getOrder = async (req, res) => {

            const authorId = req.id
            const authorAccountType = req.accountType;
            const author = req.author;
            try {
                        let orders;

                        if (authorAccountType === "Seller") {
                                    orders = await Order.find({ author });
                                    console.log("seller")

                        } else {
                                    orders = await Order.find({ userId: authorId });
                                    console.log("buyer");
                        }

                        if (!orders) {
                                    return res.status(404).json({ success: false, message: "No Orders found" })
                        }

                        return res.status(200).json({ success: true, data: orders })


            } catch (error) {
                        return res.status(500).json({ success: false, message: error.message })
            }
}

module.exports = { getOrder }           