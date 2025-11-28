export const validateBody = (schema) => async (req, res, next) => {
  try {
    const value = await schema.validateAsync(req.body, { abortEarly: false, stripUnknown: true });
    req.body = value;
    next();
  } catch (validationError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: validationError.details?.map(d => d.message) || []
    });
  }
};
