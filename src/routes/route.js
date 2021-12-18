const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorControllers')
const blogController = require('../controllers/blogControllers') 
const appMiddleware = require('../middleWares/appMiddleware')

//Project 1 - Phase - 1
router.post('/authors',authorController.createAuthor)
router.post('/blogs',appMiddleware.authentication,blogController.createBlog)
router.get('/blogs',appMiddleware.authentication, blogController.returnBlogsFiltered) //
router.put('/blogs/:id',appMiddleware.authentication, blogController.updateData);
router.delete('/blogs/:id',appMiddleware.authentication, blogController.deleteBlog);
router.delete('/blogs',appMiddleware.authentication, blogController.deleteSpecific);

//Project 1 - Phase - 2
router.post('/login',authorController.doLogin)

module.exports = router;