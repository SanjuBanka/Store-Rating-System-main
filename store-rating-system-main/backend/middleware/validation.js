const validateUser = (req, res, next) => {

  const {
    name,
    email,
    password,
    address
  } = req.body;

  if (
    !name ||
    name.length < 10 ||
    name.length > 50
  ) {
    return res.status(400).json({
      message:
        "Name must be between 10 and 50 characters"
    });
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid Email"
    });
  }

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must contain uppercase, special character and be 8-16 characters"
    });
  }

  if (
    !address ||
    address.length > 400
  ) {
    return res.status(400).json({
      message:
        "Address maximum 400 characters"
    });
  }

  next();
};

module.exports = validateUser;