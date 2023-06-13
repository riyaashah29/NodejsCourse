const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.getAddProduct = (req, res, next) => {
  // if(!req.session.isLoggedIn){
  //   return res.redirect('/login')
  // }
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError : false,
    errorMessage : null,
    validationErrors : []
    // isAuthenticated: req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    return  res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError : true,
      product : {
        title : title,
        imageUrl : imageUrl,
        price : price,
        description : description
      },
      errorMessage : errors.array()[0].msg,
      validationErrors : errors.array()
      // isAuthenticated: req.session.isLoggedIn
    });
  }
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError : false,
        errorMessage : null,
        validationErrors : []
        // isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    return  res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError : true,
      product : {
        _id : prodId,
        title : updatedTitle,
        imageUrl : updatedImageUrl,
        price : updatedPrice,
        description : updatedDesc
      },
      errorMessage : errors.array()[0].msg,
      validationErrors : errors.array()
      // isAuthenticated: req.session.isLoggedIn
    });
  }
  Product.findById(prodId)
    .then(product => {
      // console.log(product);
      console.log(product.userId)
      console.log(req.user._id)
      if(product.userId.toString() !== req.user._id.toString()){
        return res.redirect('/')
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save()
      .then(result => {
          console.log('UPDATED PRODUCT!');
          res.redirect('/admin/products');
        })
    })
    // .then(result => {
    //   console.log('UPDATED PRODUCT!');
    //   res.redirect('/admin/products');
    // })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    Product.find({userId : req.user._id})
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        // isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({_id : prodId, userId : req.user._id})
  .then(() => {
    console.log('DESTROYED PRODUCT');
    res.redirect('/admin/products');
  })
  // Product.findByIdAndRemove(prodId)
  // .then(product => {
  //     console.log('DESTROYED PRODUCT');
  //     res.redirect('/admin/products');
  //   })
    .catch(err => console.log(err));
};
