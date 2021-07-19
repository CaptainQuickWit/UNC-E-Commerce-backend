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

  }).catch(error => {

    console.log(error);
    res.status(400).json(error);

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
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
    }

  }).then(data => {

    if(!data) {

      res.status(400).json({message: 'search results: none'})
      return;
    }
    res.status(200).json(data);

  }).catch(error => {

    console.log(error);
    res.status(400).json(error);

  });



});

router.post('/', (req, res) => {
  // create a new category
  Category.update({
  category_name: req.body.category_name
  }).then(data => {
    
    if (data) {
      res.status(200).json(data);
    } else {
      console.log(error);
    }
  })
  .catch(error => {

    console.log(error);

    res.status(404).json(error);

  });

});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id
    }
  }).then(data =>{






    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({message: 'Search results: N/A'});
      return;
    }





  }).catch(error => {
    console.log(error);
    res.status(400).json(error);
  });
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: {
      id: req.params.id
    }
  }).then(data => {

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({message: 'Search: category with the ID. results: none'});
    }
    
  }).catch(error => {
    console.log(error);
    res.status(400).json(error);
  });
});

module.exports = router;
