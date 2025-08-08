const { body, param, query } = require("express-validator");

const validationRules = {
  login: [
    body("username")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Username é obrigatório"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Senha deve ter no mínimo 8 caracteres"),
  ],

  profile: [
    body("firstName").trim().escape().notEmpty(),
    body("lastName").trim().escape().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("phone").trim().escape(),
  ],

  contribution: [
    body("amount").isNumeric().withMessage("Valor deve ser numérico"),
    body("preTax").isBoolean(),
    param("userId").isMongoId().withMessage("ID de usuário inválido"),
  ],

  research: [query("symbol").trim().escape().notEmpty()],
};

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      errors: errors.array(),
    });
  };
};

module.exports = {
  validationRules,
  validate,
};
