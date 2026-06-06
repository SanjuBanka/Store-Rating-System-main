const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Store = require("../models/Store");
const Rating = require("../models/Rating");

const authenticateToken =
require("../middleware/authMiddleware");

const {
  isAdmin
} = require("../middleware/roleMiddleware");

const validateUser =
require("../middleware/validation");

const sequelize = require("../config/db");
const { Op } = require("sequelize");

const router = express.Router();


// ======================
// ADMIN DASHBOARD
// ======================

router.get(
  "/dashboard",
  authenticateToken,
  isAdmin,
  async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({
      totalUsers,
      totalStores,
      totalRatings
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// ======================
// ADMIN CREATE STORE
// ======================

router.post(
  "/stores",
  authenticateToken,
  isAdmin,
  async (req, res) => {

    try {

      const {
        name,
        email,
        address
      } = req.body;

      if (
        !name ||
        !email ||
        !address
      ) {
        return res.status(400).json({
          message:
          "All fields are required"
        });
      }

      const existingStore =
        await Store.findOne({
          where: { email }
        });

      if (existingStore) {

        return res.status(400).json({
          message:
          "Store already exists"
        });

      }

      const store =
        await Store.create({

          name,
          email,
          address

        });

      res.status(201).json({

        message:
        "Store Created Successfully",

        store

      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  }
);


// ======================
// ADMIN CREATE USER
// ======================

router.post(
  "/users",
  authenticateToken,
  isAdmin,
  validateUser,
  async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
      role
    } = req.body;

    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role
    });

    res.status(201).json({
      message: "User Created Successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// ======================
// ADMIN USERS LIST
// FILTER + SORT
// ======================

router.get(
  "/users",
  authenticateToken,
  isAdmin,
  async (req, res) => {
  try {

    const {
      name,
      email,
      address,
      role,
      sort,
      order
    } = req.query;

    const where = {};

    if (name) {
      where.name = {
        [Op.like]: `%${name}%`
      };
    }

    if (email) {
      where.email = {
        [Op.like]: `%${email}%`
      };
    }

    if (address) {
      where.address = {
        [Op.like]: `%${address}%`
      };
    }

    if (role) {
      where.role = role;
    }

    const orderBy = [];

    const allowedSortFields = [
  "name",
  "email",
  "address",
  "role"
];

    if (
      sort &&
      allowedSortFields.includes(sort)
    ) {
      orderBy.push([
        sort,
        order === "DESC"
          ? "DESC"
          : "ASC"
      ]);
    }

    const users = await User.findAll({
      where,
      order: orderBy,
      attributes: [
        "id",
        "name",
        "email",
        "address",
        "role"
      ]
    });

    res.json({
      totalUsers: users.length,
      users
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// ======================
// ADMIN STORE LIST
// FILTER + SORT
// ======================

router.get(
  "/stores",
  authenticateToken,
  isAdmin,
  async (req, res) => {

    try {

      const {
        name,
        email,
        address,
        sort,
        order
      } = req.query;

      const where = {};

      if (name) {
        where.name = {
          [Op.like]: `%${name}%`
        };
      }

      if (email) {
        where.email = {
          [Op.like]: `%${email}%`
        };
      }

      if (address) {
        where.address = {
          [Op.like]: `%${address}%`
        };
      }

      const orderBy = [];

      const allowedSortFields = [
  "name",
  "email",
  "address"
];

      if (
        sort &&
        allowedSortFields.includes(sort)
      ) {
        orderBy.push([
          sort,
          order === "DESC"
            ? "DESC"
            : "ASC"
        ]);
      }

      const stores = await Store.findAll({

        where,

        order: orderBy,

        include: [
          {
            model: Rating,
            attributes: []
          }
        ],

        attributes: [
          "id",
          "name",
          "email",
          "address",
          [
            sequelize.fn(
              "AVG",
              sequelize.col("Ratings.rating")
            ),
            "averageRating"
          ]
        ],

        group: ["Store.id"]

      });

      res.json({
        totalStores: stores.length,
        stores
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  }
);

// ======================
// USER DETAILS API
// ======================

router.get(
  "/users/:id",
  authenticateToken,
  isAdmin,
  async (req, res) => {
  try {

    const user = await User.findByPk(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User Not Found"
      });
    }

    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role
    };

    if (user.role === "STORE_OWNER") {

      const store = await Store.findOne({
        where: {
          email: user.email
        }
      });

      if (store) {

        const avgRating =
          await Rating.findOne({

            attributes: [
              [
                sequelize.fn(
                  "AVG",
                  sequelize.col("rating")
                ),
                "averageRating"
              ]
            ],

            where: {
              StoreId: store.id
            }

          });

        response.store = {
          id: store.id,
          name: store.name,
          averageRating:
            avgRating?.dataValues
              ?.averageRating || 0
        };
      }
    }

    res.json(response);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;