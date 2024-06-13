const Auth = {
    signin: async (req, res) => {
        res.status(200).json({ msg: 'login here' })
    },
    signup: async (req, res) => {
        res.status(200).json({ msg: 'signup  here' })
    }
}

module.exports = Auth