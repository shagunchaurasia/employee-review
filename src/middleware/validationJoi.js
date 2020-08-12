const Joi = require("joi");

const validationJoi = (schema, property) => {
  return (request, response, next) => {
    const { error } = Joi.validate(request[property], schema);

    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");

      response.status(422).json({
        error: message,
      });
    }
  };
};

module.exports = validationJoi;
