export function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error); // Passes to errorHandler which handles ZodError
    }
  };
}
