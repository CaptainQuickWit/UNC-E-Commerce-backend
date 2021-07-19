const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({

    include: {
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']

    }

  }).then(data => {

    if(!data) {
      res.status(400).json({message: 'The categories were not found please try again'});
      return;
    }

    res.status(200).json(data);

  }).catch(err => {

    console.log(err);
    res.status(400).json(err);

  });

});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products

  Category.findOne({

    where: {
      id: req.params.id
    },

    include: {
      model: Product,
      attributes: ['id', 'product_name']
    }


  }).then(data => {

    if(!data) {

      res.status(400).json({message: 'search results: none'})
      return;
    }
    res.status(200).json(data);

  }).catch(err => {

    console.log(err);
    res.status(400).json(err);

  });


});

router.post('/', (req, res) => {
  // create a new category
  Category.update({
  category_name: req.body.category_name
  }).then(data => res.status(200).json(data))

  .catch(err => {

    console.log(err);

    res.status(400).json(err);

  });

});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
