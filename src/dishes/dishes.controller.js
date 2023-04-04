const { type } = require("os");
const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

//Functional Middleware functions
  const dishExists = (req, res, next) => {
    const dishId = req.params.dishId;
    res.locals.dishId = dishId;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (!foundDish) {
      return next({
        status: 404,
        message: `Dish not found: ${dishId}`
      });
    }
    res.locals.dish = foundDish;
  };

  const validateDishName = (req, res, next) => {
    const { data } = req.body;
    res.locals.newDD = data;
    const dishName = data.name;
    if (!dishName || dishName.length === 0){
      return next ({
        status: 400,
        message: "Dish must include a name",
      });
    }
  };

  const validateDescription = (req, res, next) => {
    const dishDescription = res.locals.newDD.description;
    if (!dishDescription || dishDescription.length === 0) {
      return next({
        status: 400,
        message: "Dish must include a description",
      });
    }
  };

  const validateDishPrice = (req, res, next) => {
    const dishPrice = res.locals.newDD.price;
    if (!dishPrice || typeof dishPrice != "number" || dishPrice <= 0) {
      return next({
        status: 400,
        message: "Dish must have a price that is an integer greater than 0",
      });
    }
  };

  const validateDishImage = (req, res, next) => {
    const dishImage = res.locals.newDD.image_url;
    if (!dishImage || dishImage.length === 0) {
      return next({
        status: 400,
        message: "Dish must include an image_url",
      });
    }
  };

  const dishIdMatches = (req, res, next) => {
    const paramId = res.locals.dishId;
    const { id } = res.locals.newDD;
    if (paramId != id && id) {
      return next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${id}, Route: ${paramId}`,
      });
    }
  };

  const createValidation = (req, res, next) => {
    validateDishName(req, res, next);
    validateDescription(req, res, next);
    validateDishPrice(req, res, next);
    validateDishImage(req, res, next);
    next();
  };

  const readValidation = (req, res, next) => {
    dishExists(req, res, next);
    next();
  };

  const updateValidation = (req, res, next) => {
    dishExists(req, res, next);
    validateDishName(req, res, next);
    validateDescription(req, res, next);
    validateDishPrice(req, res, next);
    validateDishImage(req, res, next);
    dishIdMatches(req, res, next);
    next();
  };

  // Handler to create a new dish
  const createDish = (req, res) => {
    const newDishData = res.locals.newDD;
    newDishData.id = nextId();
    dishes.push(newDishData);
    res.status(201).json({ data: newDishData });
  };
  
  // Handler to read a dish
  const readDish = (req, res) => {
    res.status(200).json({ data: res.locals.dish });
  };
  
  // Handler to update a dish
  const updateDish = (req, res) => {
    const newData = res.locals.newDD;
    const oldData = res.locals.dish;
    const index = dishes.indexOf(oldData);
    for (const key in newData) {
      dishes[index][key] = newData[key];
    }
    res.status(200).json({ data: dishes[index] });
  };
  
  // Handler to list all dishes
  const listDishes = (req, res) => {
    res.status(200).json({ data: dishes })
  };
  
  
  module.exports = {
    create: [createValidation, createDish],
    read: [readValidation, readDish],
    update: [updateValidation, updateDish],
    list: [listDishes],
  };