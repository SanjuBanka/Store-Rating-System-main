const express = require("express");
const { Op } = require("sequelize");

const Store = require("../models/Store");
const Rating = require("../models/Rating");
const User = require("../models/User");
const sequelize = require("../config/db");

const router = express.Router();

router.post("/", async (req, res) => {

  try {

    const store =
      await Store.create(req.body);

    res.status(201).json(store);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

// ======================
// GET ALL STORES
// SEARCH BY NAME/ADDRESS
// ======================

router.get("/", async (req, res) => {

  try {

    const {
      name,
      address
    } = req.query;

    const where = {};

    if (name) {

      where.name = {
        [Op.like]: `%${name}%`
      };

    }

    if (address) {

      where.address = {
        [Op.like]: `%${address}%`
      };

    }

    const stores = await Store.findAll({

      where,

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

});

// ======================
// STORE OWNER DASHBOARD
// ======================

router.get("/dashboard/:storeId", async (req, res) => {

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

    const ratings =
      await Rating.findAll({

        where: {
          StoreId: req.params.storeId
        },

        include: [

          {
            model: User,
            attributes: [
              "name"
            ]
          }

        ]

      });

    const average =
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
          StoreId: req.params.storeId
        }

      });

    res.json({

      storeName:
      store.name,

      averageRating:
      average.dataValues.averageRating,

      totalRatings:
      ratings.length,

      ratings

    });

  } catch (error) {

    res.status(500).json({
      message:
      error.message
    });

  }

});


router.get("/user/:userId", async (req, res) => {

  try {

    const stores = await Store.findAll({

      include: [
        {
          model: Rating,
          attributes: []
        }
      ],

      attributes: [

        "id",
        "name",

        [
          sequelize.fn(
            "AVG",
            sequelize.col("Ratings.rating")
          ),
          "overallRating"
        ]

      ],

      group: ["Store.id"]

    });

    const result = [];

    for (const store of stores) {

      const myRating =
        await Rating.findOne({

          where: {

            UserId:
            req.params.userId,

            StoreId:
            store.id

          }

        });

      result.push({
  id: store.id,
  storeName: store.name,
  overallRating: store.dataValues.overallRating,
  myRating: myRating ? myRating.rating : null,
  ratingId: myRating ? myRating.id : null
});

    }

    res.json(result);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

// ======================
// GET STORE BY ID
// ======================

router.get("/:id", async (req, res) => {
  try {

    const store = await Store.findByPk(
      req.params.id,
      {
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
      }
    );

    if (!store) {
      return res.status(404).json({
        message: "Store Not Found"
      });
    }

    res.json(store);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

module.exports = router;