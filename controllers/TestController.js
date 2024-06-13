const User = require("../models/user")
const test = async (req, res) => {
    res.status(200).send({ msg: 'hello' });

}
module.exports = test