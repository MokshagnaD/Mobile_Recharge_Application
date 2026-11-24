// Role-based authorization middleware
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.headers['user-role'] || req.user?.role;

    if (userRole !== requiredRole) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin privileges required'
      });
    }
    next();
  };
};

module.exports = { checkRole };
