const Joi = require ('joi'); 

/// Register validation
const registerValidation = async (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    try {
        const val = await schema.validateAsync({ firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password});
        return [1, val];
    }
    catch(err) {
        return [0, err.details[0].message];
    }
}



const loginValidation = async (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    try {
        const val = await schema.validateAsync({email: data.email, password: data.password});
        return [1, val];
    }
    catch(err) {
        return [0, err.details[0].message];
    }
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
//module.exports.teacherRegisterValidation = teacherRegisterValidation;