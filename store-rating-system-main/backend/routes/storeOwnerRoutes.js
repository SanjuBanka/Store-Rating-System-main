const express = require("express");

const Store = require("../models/Store");
const Rating = require("../models/Rating");
const User = require("../models/User");

const authenticateToken =
require("../middleware/authMiddleware");

const {
  isStoreOwner
} = require("../middleware/roleMiddleware");

const sequelize = require("../config/db");

const router = express.Router();


// ======================
// STORE OWNER DASHBOARD
// ======================

router.get(
  "/dashboard/:storeId",
  authenticateToken,
  isStoreOwner,
  async (req, res) => {

    try {

      const store =
        await Store.findByPk(
          req.params.storeId
        );

      if (!store) {

        return res.status(404).json({
          message: "Store Not Found"
        });

      }

      const averageRating =
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

      const ratings =
        await Rating.findAll({

          where: {
            StoreId: store.id
          },

          include: [
            {
              model: User,
              attributes: [
                "id",
                "name",
                "email"
              ]
            }
          ]

        });

      res.json({

        store: {
          id: store.id,
          name: store.name,
          email: store.email,
          address: store.address
        },

        averageRating:
          averageRating?.dataValues
            ?.averageRating || 0,

        totalRatings:
          ratings.length,

        ratings

      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  }
);

module.exports = router;