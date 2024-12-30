const jwt = require("jwt-simple");
const moment = require("moment");

const secret = "mi_clave_secreta_:)";

const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(1, "days").unix(),
    }

    return jwt.encode(payload, secret);
}

module.exports = {
    secret,
    createToken
}