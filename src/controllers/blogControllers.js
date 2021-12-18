const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const authorModel = require("../models/authorModel");
const blogModels = require("../models/blogsModel");

//--------------------------//---------------------------//
//-------------------------------------------------------------------------------------------//
// This is the second api for the creation of the blog.
//-------------------------//---------------------------//

const createBlog = async function (req, res) {
  try {
    let myBlog = req.body;
    let authorId = req.body.authorId;
    let checkOBJ = ObjectId.isValid(authorId);
    if (checkOBJ) {
      let authorFromRequest = await authorModel.findById(authorId);
      if (authorFromRequest) {
        let isPublished = req.body.isPublished;
        if (isPublished == true) {
          myBlog.publishedAt = Date();
          let savedBlog1 = await blogModels.create(myBlog);
          res.status(201).send({ status: true, data: savedBlog1 });
        } else {
          let savedBlog2 = await blogModels.create(myBlog);
          res.status(201).send({ status: true, data: savedBlog2 });
        }
      } else {
        res.status(400).send({ status: false, message: "This author Id doesn't exist" });
      }
    } else {
      res.status(400).send({ status: false, message: "Please Provide a Valid Author Id" });
    }
  }
  catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//--------------------------------------------------------------------------------------------//
// This is the third api to get the filtered data.

const returnBlogsFiltered = async function (req, res) {
  try {
    let blogFound = await blogModels.find(req.query).populate("authorId", { title: 1, fname: 1, lname: 1 });
    let len = blogFound.length;
    let arr = [];
    for (let i = 0; i < len; i++) {
      if (blogFound[i].isDeleted == false && blogFound[i].isPublished == true) {
        arr.push(blogFound[i]);
      } else {
        continue;
      }
    }
    if (arr.length > 0) {
      res.status(200).send({ status: true, data: arr });
    } else {
      res.status(400).send({ status: false, message: "Sorry, there is no such blog is found" });
    }
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//--------------------------------------------------------------------------------------------//
// This is the fouth api to update the details of a blog in database by using blogId.

const updateData = async function (req, res) {
  try {
    let blogId = req.params.id;
    let data = await blogModels.findOne({ _id: blogId });
    let update = req.body;
    let id3 = data.authorId;
    if (req.userId == data.authorId) {     // we are authorising particular author
      if (!data) {
        return res.status(404).send({ status: false, message: "Provide valid BlogId" });
      }
      if (data.isDeleted == true) {
        return res.status(404).send({ status: false, message: "This blog is no longer exists" });
      }
      if (update) {
        if (update.title) {
          data.title = update.title;
        }
        if (update.subcategory) {
          data.subcategory = update.subcategory;
        }
        if (update.body) {
          data.body = update.body;
        }
        if (update.tags) {
          data.tags = update.tags;
        }
        if (update.isPublished == true) {           // checking error
          data.isPublished = update.isPublished;
          data.publishedAt = Date();
        }
        data.save();
      } else {
        res.status(400).send({ status: false, message: "Please provide data to update" });
      }
      res.status(200).send({ status: true, data: data });
    } else {
      res.status(400).send({ status: false, message: "You are not authorize to update this blog" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

//-------------------------------------------------------------------------------------------//
// This is the fifth api to delete a blog in database by using blogId.

const deleteBlog = async function (req, res) {
  try {
    let id1 = req.params.id;
    let data = await blogModels.findOne({ _id: id1 });
    let id2 = data.authorId;
    if (req.userId == id2) {  // we are authorising particular author
      if (data.isDeleted == false) {
        if (!data) {
          return res.status(404).send({ status: false, message: "This Blog id does not exits" });
        } else {
          data.isDeleted = true;
          data.deletedAt = Date();
          data.save();
          res.status(200).send({ status: true, data: data });
        }
      } else {
        res.status(400).send({ status: false, message: "this blog is already deleted" });
      }
    } else {
      res.status(400).send({ status: false, message: " You are not authorize to delete this blog" });
    }
  } catch (err) {
    res.status(500).send({message: err.message });
  }
};

//-------------------------------------------------------------------------------------------//
// This is the sixth api to delete a blog in database by using specific details of that blog.

const deleteSpecific = async function (req, res) {
  try {
    let obj = {};
    if (req.query.category) {
      obj.category = req.query.category;
    }
    if (req.query.authorId) {
      obj.authorId = req.query.authorId;
    }
    if (req.query.tag) {
      obj.tags = req.query.tags;
    }
    if (req.query.subcategory) {
      obj.subcategory = req.query.subcategory;
    }
    if (req.query.published) {
      obj.isPublished = req.query.isPublished;
    }
    let data = await blogModels.findOne(obj);
    let id4 = data.authorId;
    if (req.userId == id4) {
      if (data.isDeleted == false) {     // we are authorising particular author
        if (!data) {
          return res.status(404).send({ status: false, message: "The given data is Invalid" });
        }
        data.isDeleted = true;
        data.deletedAt = Date();
        data.save();
        res.status(200).send({ status: true, data: data });
      } else {
        res.status(400).send({ status: false, message: "This blog is already deleted" });
      }
    } else {
      res.status(400).send({ status: false, message: "You are not authorize to delete any detail of this blog" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

//-------------------------------------------------------------------------------------------//

module.exports.createBlog = createBlog;
module.exports.returnBlogsFiltered = returnBlogsFiltered;
module.exports.updateData = updateData;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteSpecific = deleteSpecific;