const isAdmin = (req, res, next) => {

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Admin Access Only"
    });
  }

  next();
};

const isUser = (req, res, next) => {

  if (req.user.role !== "USER") {
    return res.status(403).json({
      message: "User Access Only"
    });
  }

  next();
};

const isStoreOwner = (req, res, next) => {

  if (req.user.role !== "STORE_OWNER") {
    return res.status(403).json({
      message: "Store Owner Access Only"
    });
  }

  next();
};

module.exports = {
  isAdmin,
  isUser,
  isStoreOwner
};