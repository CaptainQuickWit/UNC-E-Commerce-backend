const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
/**
 * this route searches databse for everything being stored and with it includes all attributes for all objects
 */
router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({

    include: {
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']

    }

  }).then(data => {
    /**
     * if the data has not been found then return 404 error
     */
    if(!data) {
      res.status(404).json({message: 'The categories were not found please try again'});
      return;
    }

    res.status(200).json(data);

  }).catch(error => {

    console.log(error);
    res.status(404).json(error);

  });

});

/**
 * finds categories by ID. Quereis the SQL database with the id and returns all its attributes
 */
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

      res.status(404).json({message: 'search results: none'})
      return;
    }
    res.status(200).json(data);

  }).catch(error => {

    console.log(error);
    res.status(404).json(error);

  });



});

/**
 * updates by category name
 */
router.post('/', (req, res) => {
  // create a new category
  Category.create({
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

/**
 * updates by ID
 */
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


    res.status(404).json(error);
  });
});
/**
 * deletes the by Id in the url of the route
 */
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
    res.status(404).json(error);
  });
});
//export code
module.exports = router;
