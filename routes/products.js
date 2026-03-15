var express = require('express');
var router = express.Router();

let productModel = require('../schemas/products')
let { ConvertTitleToSlug } = require('../utils/titleHandler')

const { checkLogin } = require('../utils/auth');
const { checkAdmin, checkModOrAdmin } = require('../utils/permission');


/* GET ALL PRODUCTS (PUBLIC) */
router.get('/', async function (req, res) {

  let products = await productModel.find({ isDeleted: { $ne: true } });

  res.send(products)
});


/* GET PRODUCT BY ID (PUBLIC) */
router.get('/:id', async function (req, res) {

  try {

    let result = await productModel.find({
      _id: req.params.id,
      isDeleted: { $ne: true }
    });

    if (result.length > 0) {
      res.send(result)
    } else {
      res.status(404).send({
        message: "id not found"
      })
    }

  } catch (error) {

    res.status(404).send({
      message: "id not found"
    })

  }
});


/* CREATE PRODUCT (MOD + ADMIN) */
router.post('/', checkLogin, checkModOrAdmin, async function (req, res) {

  let newItem = new productModel({

    title: req.body.title,
    slug: ConvertTitleToSlug(req.body.title),
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    isDeleted: false

  })

  await newItem.save()

  res.send(newItem)

});


/* UPDATE PRODUCT (MOD + ADMIN) */
router.put('/:id', checkLogin, checkModOrAdmin, async function (req, res) {

  let id = req.params.id;

  if (req.body.title) {
    req.body.slug = ConvertTitleToSlug(req.body.title)
  }

  let updatedItem = await productModel.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  )

  res.send(updatedItem)

});


/* DELETE PRODUCT (ADMIN ONLY - SOFT DELETE) */
router.delete('/:id', checkLogin, checkAdmin, async function (req, res) {

  let id = req.params.id;

  let updatedItem = await productModel.findByIdAndUpdate(
    id,
    {
      isDeleted: true
    },
    { new: true }
  )

  res.send(updatedItem)

});

module.exports = router;