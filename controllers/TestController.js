const test = (req, res) => {
    res.status(200).send({ msg: 'hello' });
}
module.exports = test