const validate = (schema) => (req, res, next) => {
  try {
    // Helper to convert empty strings to undefined so Zod treats them as 'missing/required'
    const cleanEmptyStrings = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;
      const cleaned = { ...obj };
      for (const key in cleaned) {
        if (cleaned[key] === '') cleaned[key] = undefined;
      }
      return cleaned;
    };

    schema.parse({
      body: cleanEmptyStrings(req.body) || {},
      query: cleanEmptyStrings(req.query) || {},
      params: cleanEmptyStrings(req.params) || {},
    });
    next();
  } catch (error) {
    if (error.name === 'ZodError') {
        const formattedErrors = {};
        
        error.issues.forEach(err => {
          let msg = err.message;
          if (err.code === 'invalid_type' && msg.includes('received undefined')) {
            const fieldName = err.path[err.path.length - 1];
            if (fieldName) {
              msg = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
            } else {
              msg = 'This field is required';
            }
          }

          // Get the actual field name (ignore 'body', 'query', etc.)
          const field = err.path[err.path.length - 1];
          if (!formattedErrors[field]) {
            formattedErrors[field] = [];
          }
          formattedErrors[field].push(msg);
        });

        return res.status(400).json({
          success: false,
          message: formattedErrors
        });
    }
    next(error);
  }
};

module.exports = validate;

