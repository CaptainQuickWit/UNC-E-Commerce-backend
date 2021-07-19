
const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');


// The `/api/products` endpoint
// Gets all products
/**
 * get route fetch's all products
 * 
 */
router.get('/', (req, res) => {

  Product.findAll({

    attributes: ['id', 'product_name', 'price', 'stock'
  ],
    include: [
      {
        model: Category,
        attributes: ['category_name']
      },

    ]
  }).then(data => 
    {
      if (data) {
        res.status(200).json(data);
      } else {
        console.log("erroror on line 26");
      }    
    })
    .catch(error => {
      console.log(error);
      res.status(400).json(error);
    });
});

/**
 * get route fetch's a product by its id
 * 
 * note: id is passed through the URL route
 */

// Gets one product
router.get('/:id', (req, res) => {

  Product.findOne({

    where: {
      id: req.params.id
    },

    attributes: ['id', 'product_name', 'price', 'stock'],

    include: [
      {
        model: Category,
        
      },
      {
        model: Tag,

      }
    ]
  }).then(data => {

    if (data) {

      res.status(200).json(data);
    }else {

      res.status(404).json({

        message: 'erroror: no results with the ID given'
      });
    }
  }).catch(error => {

    console.log(error);

    res.status(400).json(error);
  });
});

/**
 * post route creates a product by via post request
 * 
 */
// Creates new product
router.post('/', (req, res) => {
  Product.create({

    tagIds: req.body.tagIds,
    
    price: req.body.price,
    category_id: req.body.category_id,
    stock: req.body.stock,

    product_name: req.body.product_name,
    

  })
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productArray = req.body.tagIds.map((tag_id) => {
          return {
          product_id: product.id,
          tag_id,
          };
        });
        return ProductTag.bulkCreate(productArray);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((dataProductTagId) => {
      if (dataProductTagId) {
        res.status(200).json(dataProductTagId);
      } else {
        console.log("Error on line 122 / product-routes js file");
      }
    })
    .catch((error) => {

      console.log(error);

      res.status(400).json(error);
    });
});

/**
 * put route updates a product by its id
 * 
 * note: id is passed through the URL route
 */
router.put('/:id', (req, res) => {
  // Updates product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then((product) => {
    // find all associated tags from ProductTag
    return ProductTag.findAll({ where: { product_id: req.params.id } });
  })
  .then((productTags) => {
    // get list of current tag_ids
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    // create filtered list of new tag_ids
    console.log(req.body.tagIds);
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.status(200).json(updatedProductTags))
    .catch((error) => {
      console.log(error);
      res.status(400).json(error);
    });
});
/**
 * delete route deletes a product by its id
 * 
 * note: id is passed through the URL route
 */
// Deletes one product by its `id` value
router.delete('/:id', (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id
    }
  }).then(data => {

    if (data) {
      res.json(data);
    } else {
      res.status(404).json({message: 'No product found with the given id.'});
      return;
    }

  }).catch(error => {
    console.log(error);

    res.status(400).json(error);
  });
});
//export
module.exports = router;