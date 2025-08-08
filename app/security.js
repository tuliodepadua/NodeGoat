const helmet = require("helmet");
const csrf = require("csurf");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("mongo-sanitize");
const { body, validationResult } = require("express-validator");

module.exports = function (app) {
  // Headers de segurança básicos
  app.use(helmet());

  // Configuração CSP
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    })
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite por IP
  });
  app.use("/api/", limiter);

  // Proteção CSRF
  app.use(csrf({ cookie: true }));
  app.use(function (req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
  });

  // Middleware para sanitização de entrada MongoDB
  app.use((req, res, next) => {
    if (req.body) {
      req.body = mongoSanitize(req.body);
    }
    if (req.params) {
      req.params = mongoSanitize(req.params);
    }
    if (req.query) {
      req.query = mongoSanitize(req.query);
    }
    next();
  });

  // Middleware de tratamento de erros
  app.use((err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
      res.status(403).json({
        error: "Falha na validação do token CSRF",
      });
    } else {
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  });
};
