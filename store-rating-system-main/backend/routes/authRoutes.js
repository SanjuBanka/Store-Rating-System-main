const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");

const verifyToken =
require("../middleware/authMiddleware");

const User = require("../models/User");
const Store = require("../models/Store");

const router = express.Router();

// ===================
// SIGNUP API
// ===================
router.post("/signup", async (req, res) => {

  try {

    const {
  name,
  email,
  password,
  address
} = req.body;


// Required fields

if (
  !name ||
  !email ||
  !password ||
  !address
) {
  return res.status(400).json({
    message: "All fields are required"
  });
}


// Email validation

const emailRegex =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Invalid Email Format"
  });
}


// Name validation

if (
  name.length < 20 ||
  name.length > 60
) {
  return res.status(400).json({
    message:
    "Name must be between 20 and 60 characters"
  });
}

    if (address.length > 400) {
      return res.status(400).json({
        message:
        "Address max length is 400 characters"
      });
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
        "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
      });
    }

    const existingUser =
      await User.findOne({
        where: { email }
      });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await User.create({
        name,
        email,
        password: hashedPassword,
        address,
        role: "USER"
      });

    res.status(201).json({
      message: "User Registered Successfully",
      user
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

  const emailRegex =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Invalid Email Format"
  });
}

});


// ===================
// LOGIN API
// ===================
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(
  password,
  user.password
);



if (!isMatch) {
  return res.status(401).json({
    message: "Invalid Password"
  });
}

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    let storeId = null;

if (user.role === "STORE_OWNER") {

  const store = await Store.findOne({
    where: {
      email: user.email
    }
  });

  if (store) {
    storeId = store.id;
  }
}

  res.json({
  message: "Login Successful",
  token,
  role: user.role,

  user: {
    id: user.id,
    name: user.name,
    email: user.email
  },

  storeId
});

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ===================
// PROFILE API
// ===================
router.get(
  "/profile",
  verifyToken,
  (req, res) => {

    res.json({
      message: "Protected Route",
      user: req.user
    });

  }
);


// ===================
// CHANGE PASSWORD API
// ===================
router.put(
  "/change-password",
  verifyToken,
  async (req, res) => {

    try {

      const {
        oldPassword,
        newPassword
      } = req.body;

      const user =
        await User.findByPk(
          req.user.id
        );

      const match =
        await bcrypt.compare(
          oldPassword,
          user.password
        );

      if (!match) {
        return res.status(400).json({
          message:
          "Old Password Incorrect"
        });
      }

      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          message:
          "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      await user.update({
        password: hashedPassword
      });

      res.json({
        message:
        "Password Updated Successfully"
      });

    } catch (error) {

      res.status(500).json({
        message:
        error.message
      });

    }

  }
);

module.exports = router;