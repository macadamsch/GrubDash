const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));
const nextId = require("../utils/nextId");

  //Functional middleware:
  const orderExists = (req, res, next) => {
    const orderId = req.params.orderId;
    res.locals.orderId = orderId;
    const foundOrder = orders.find((order) => order.id === orderId);
    if (!foundOrder) {
      return next({
        status: 404,
        message: `Order not found: ${orderId}`
      });
    }
    res.locals.order = foundOrder;
  };

  const validateDelivery = (req, res, next) => {
    const { data } = req.body;
    res.locals.newDD = data;
    const orderDelivery = data.deliverTo;
    if (!orderDelivery || orderDelivery.length === 0){
      return next({
        status: 400,
        message: "Order must include a deliverTo",
      });
    }
  };

  const validateMobileNum = (req, res, next) => {
    const orderMobileNum = res.locals.newDD.mobileNumber;
    if (!orderMobileNum || orderMobileNum.length === 0) {
      return next({
        status: 400,
        message: "Order must include a mobileNumber",
      });
    }
  };

  const orderHasDishes = (req, res, next) => {
    const orderDishes = res.locals.newDD.dishes;
    if (!orderDishes || !Array.isArray(orderDishes) || orderDishes.length <= 0) {
      return next({
        status: 400,
        message: "Order must include at least one dish",
      });
    }
    res.locals.dishes = orderDishes;
  };

  const validateDishes = (req, res, next) => {
    const orderDishes = res.locals.dishes;
    orderDishes.forEach((dish) => {
      const dishQty = dish.quantity;
      if (!dishQty || typeof dishQty != "number" || dishQty <= 0) {
        return next({
          status: 400,
          message: `Dish ${orderDishes.indexOf(dish)} must have a quantity that is an integer greater than 0`,
        });
      }
    });
  };

  const validateOrderId = (req, res, next) => {
    const paramId = res.locals.orderId;
    const { id } = res.locals.newDD;
    if (!id || id === null) {
      res.locals.newDD.id = res.locals.orderId;
    } else if (paramId != id) {
      return next({
        status: 400,
        message: `Order id does not match route id. Order: ${id}, Route: ${paramId}`,
      });
    }
  };

  const validateStatus = (req, res, next) => {
    const { status } = res.locals.newDD;
    if (!status || status.length === 0 || status === "invalid") {
      return next({
        status: 400,
        message: "Order must have a status of pending, preparing, out-for-delivery, or delivered",
      });
    }
  };

  const validateNotDelivered = (req, res, next) => {
    const { status } = res.locals.order;
    if (status === "delivered") {
      return next({
        status: 400,
        message: "A delivered order cannot be changed",
      });
    }
  };

  const validatePending = (req, res, next) => {
    const { status } = res.locals.order;
    if (status !== "pending") {
      return next({
        status: 400,
        message: "An order cannot be deleted unless it is pending",
      });
    }
  };

  const createValidation = (req, res, next) => {
    validateDelivery(req, res, next);
    validateMobileNum(req, res, next);
    orderHasDishes(req, res, next);
    validateDishes(req, res, next);
    next();
  };

  const readValidation = (req, res, next) => {
    orderExists(req, res, next);
    next();
  };

  const updateValidation = (req, res, next) => {
    orderExists(req, res, next);
    validateDishes(req, res,next);
    validateDelivery(req, res, next);
    validateMobileNum(req, res, next);
    orderHasDishes(req, res, next);
    validateOrderId(req, res, next);
    validateStatus(req, res, next);
    validateNotDelivered(req, res, next);
    next();
  };

  const deleteValidation = (req, res, next) => {
    orderExists(req, res, next);
    validatePending(req, res, next);
    next();
  };
  
  const createOrder = (req, res) => {
    const newOrderData = res.locals.newDD;
    newOrderData.id = nextId();
    orders.push(newOrderData);
    res.status(201).json({ data: newOrderData });
  };
  
  const readOrder = (req, res) => {
    res.status(200).json({ data: res.locals.order });
  };
  
  const updateOrder = (req, res) => {
    const newData = res.locals.newDD;
    const oldData = res.locals.order;
    const index = orders.indexOf(oldData);
    for (const key in newData) {
      orders[index][key] = newData[key];
    }
    res.status(200).json({ data: orders[index] })
  };
  
  const listOrders = (req, res) => {
    res.status(200).json({ data: orders })
  };

  const destroy = (req, res) => {
    const index = orders.indexOf(res.locals.order);
    orders.splice(index, 1);
    res.sendStatus(204);
  }
  
  module.exports = {
    create: [createValidation, createOrder],
    read: [readValidation, readOrder],
    update: [updateValidation, updateOrder],
    list: [listOrders],
    delete: [deleteValidation, destroy]
  };
  