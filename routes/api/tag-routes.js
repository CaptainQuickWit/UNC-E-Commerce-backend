const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');
// The `/api/tags` endpoint

/**
 * gets all products along with all its attributes
 */
router.get('/', (req, res) => {


  Category.findAll({
    include: {
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
    }
  }).then(data => {

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(400).json({message: 'Error: bad search request'});
      return;
    }

  }).catch(err => {

    console.log(err);
    res.status(400).json(err);

  });


});

/**
 * gets only 1 product by its id alone with all its attributes. Note: id is passed through the URL routes
 */

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Category.findOne({
    where: {
      id: req.params.id
    },
    include: {
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
    }
  }).then(data => {

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(400).json({message: 'Error: search result bad'})
      return;
    }
    
  }).catch(err => {
    console.log(err);
    res.status(400).json(err);
  });
});


/**
 * create a new tag
 */
router.post('/', (req, res) => {
  // create a new tag
  Category.create({
    category_name: req.body.category_name
  }).then(data => {
    if (data) {
      res.status(200).json(data);
    } else {
      console.log("You received an error line 66");
      throw err;

    }})
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

/**
 * updates category based on its id 
 * 
 * id is passed through the url routes
 */
router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id
    }
  }).then(data =>{
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(400).json({message: 'Error: search result bad'});
      return;
    }

  }).catch(err => {
    console.log(err);
    res.status(400).json(err);
  });
});

/**
 * deletes category based on its id 
 * 
 * id is passed through the url routes
 */
router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Category.destroy({
    where: {
      id: req.params.id
    }
  }).then(data => {
    if (data) {
      res.status(200).json(data);
    } else {
      console.log("error: nothing to be deleted");
      res.status(400).json({message: 'Error: nothing to delete'});
    }

  }).catch(err => {

    console.log("err===>"+err);
    console.log(err);
    res.status(400).json(err);
  });
});

//export
module.exports = router;
