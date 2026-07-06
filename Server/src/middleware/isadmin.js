// middleware/isAdmin.js
// Runs AFTER your `protect` middleware, so req.user is already set from the JWT.

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: admin only" });
  }

  next();
};

export default isAdmin;