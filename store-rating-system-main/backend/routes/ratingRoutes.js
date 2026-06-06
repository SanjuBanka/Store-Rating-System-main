const express = require("express");

const Rating = require("../models/Rating");
const sequelize = require("../config/db");

const authenticateToken =
require("../middleware/authMiddleware");

const {
  isUser
} = require("../middleware/roleMiddleware");

const router = express.Router();


// =====================
// ADD RATING
// =====================

router.post(
  "/",
  authenticateToken,
  isUser,
  async (req, res) => {

    try {

      const {
        StoreId,
        rating
      } = req.body;

      // Rating Validation

      if (
        rating < 1 ||
        rating > 5
      ) {
        return res.status(400).json({
          message:
          "Rating must be between 1 and 5"
        });
      }

      // Duplicate Check

      const existingRating =
        await Rating.findOne({

          where: {
            UserId: req.user.id,
            StoreId
          }

        });

      if (existingRating) {

        return res.status(400).json({
          message:
          "Rating Already Submitted. Please Update Your Rating."
        });

      }

      const newRating =
        await Rating.create({

          UserId: req.user.id,
          StoreId,
          rating

        });

      res.status(201).json({

        message:
        "Rating Submitted Successfully",

        newRating

      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  }
);


// =====================
// GET ALL RATINGS
// =====================

router.get("/", async (req, res) => {

  try {

    const ratings =
      await Rating.findAll();

    res.json(ratings);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// =====================
// UPDATE RATING
// =====================

router.put(
  "/:id",
  authenticateToken,
  isUser,
  async (req, res) => {

    try {

      const ratingRecord =
        await Rating.findByPk(
          req.params.id
        );

      if (!ratingRecord) {

        return res.status(404).json({
          message:
          "Rating Not Found"
        });

      }

      // User can update only own rating

      if (
        ratingRecord.UserId !==
        req.user.id
      ) {

        return res.status(403).json({
          message:
          "You can update only your own rating"
        });

      }

      const {
        rating
      } = req.body;

      if (
        rating < 1 ||
        rating > 5
      ) {

        return res.status(400).json({
          message:
          "Rating must be between 1 and 5"
        });

      }

      await ratingRecord.update({
        rating
      });

      res.json({

        message:
        "Rating Updated Successfully",

        ratingRecord

      });

    } catch (error) {

      res.status(500).json({
        message:
        error.message
      });

    }

  }
);


// =====================
// GET AVERAGE RATING
// =====================

router.get(
  "/average/:storeId",
  async (req, res) => {

    try {

      const result =
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
            StoreId:
            req.params.storeId
          }

        });

      res.json(result);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  }
);

module.exports = router;