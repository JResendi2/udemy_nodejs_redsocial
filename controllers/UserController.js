const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");

const register = async (req, res) => {
    const body = req.body;

    if (!body.name || !body.nick || !body.email || !body.password) {
        return res.status(400).json({
            status: "error",
            message: "Faltan campos por llenar"
        })
    }

    // Control de usuarios duplicados
    try {
        const query = User.find();
        const result = await query.exec({
            $or: [
                { email: body.email.toLowerCase() },
                { nick: body.nick.toLowerCase() }
            ]
        });

        if (result && result.length > 0) {
            return res.status(400).json({
                status: "success",
                message: "El usuario ya existe"
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error: error,
            message: "Intenta más tarde"
        })
    }

    // Cifrar contraseña
    bcrypt.hash(body.password, 10, async (error, pwd) => {
        if (error) {
            return res.status(500).json({
                status: "error",
                error: error,
                message: "Intenta más tarde"
            })
        }
        body.password = pwd;

        // Guardar el usuario
        try {
            const user = User(body);
            const user_save = await user.save();
            return res.status(200).json({
                status: "success",
                user: {
                    name: user_save.name,
                    nick: user_save.nick,
                    email: user_save.email,
                },
                message: "Usuario guardado"
            })

        } catch (error) {
            return res.status(500).json({
                status: "error",
                error: error,
                message: "Usuario no guardado"
            })
        }
    })

}

const login = async (req, res) => {
    const body = req.body;

    if (!body.email || !body.password) {
        return res.status(400).json({
            status: "error",
            message: "Faltan campos por llenar"
        })
    }

    try {
        const query = User.findOne({ email: {$eq: body.email} });

        const result = await query.exec();

        if (!result) {
            return res.status(400).json({
                status: "error",
                message: "El usuario no existe"
            })
        }

        // Comprobar la contraseña
        const pwd = bcrypt.compareSync(body.password, result.password);
        if(!pwd){
            return res.status(400).json({
                status: "error",
                message: "Contraseña incorrecta"
            })
        }

        // Crear token
        const token = jwt.createToken(result);

        return res.status(200).json({
            status: "success",
            user: {
                id: result._id,
                name: result.name,
                nick: result.nick,
                email: result.email,
            },
            token: token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: "error",
            error: error,
        })
    }
}

module.exports = {
    register,
    login
}