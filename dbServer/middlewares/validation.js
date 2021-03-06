/* eslint-disable max-len */
import config from '../config/config';

export const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // this regex was obtained from: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
/**
 * @description contains methods that validates input
 */
class validation {
  /**
   * @description - method that validates user input during sign up
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {function} next - the callback function
   * @returns {object} - status code and error
   */
  signupMiddleware(req, res, next) {
    const {
      username,
      email,
      address,
      password,
      phone
    } = req.body;
    if (email === undefined) {
      return res.status(400).send({
        status: 'error',
        error: 'email field is required'
      });
    }
    if (!re.test(String(email).toLowerCase())) {
      return res.status(400).send({
        status: 'error',
        error: 'invalid email'
      });
    }
    if (password === undefined) {
      return res.status(400).send({
        status: 'error',
        error: 'password field is required'
      });
    }
    if (phone === undefined) {
      return res.status(400).send({
        status: 'error',
        error: 'phone field is required'
      });
    }
    if (!phone.trim() || phone.includes(' ') || phone.includes('\n') || phone.includes('\t')) {
      return res.status(400).send({
        status: 'error',
        error: 'space character is not allowed in phone field'
      });
    }
    if (isNaN(Number(phone))) {
      return res.status(400).send({
        status: 'error',
        error: 'Invalid phone number'
      });
    }
    if (String(phone).length !== 11) {
      return res.status(400).send({
        status: 'error',
        error: 'phone must be 11 digits'
      });
    }
    if (username === undefined) {
      return res.status(400).send({
        status: 'error',
        error: 'username field is required'
      });
    }
    if (typeof (username) !== 'string') {
      return res.status(400).send({
        status: 'error',
        error: 'only strings are allowed for the username field'
      });
    }
    if (!username.trim() || username.includes(' ') || username.includes('\n') || username.includes('\t')) {
      return res.status(400).send({
        status: 'error',
        error: 'space character is invalid for username field'
      });
    }
    if (address === undefined) {
      return res.status(400).send({
        status: 'error',
        error: 'address field is required'
      });
    }
    if (typeof (address) !== 'string') {
      return res.status(400).send({
        status: 'error',
        error: 'only strings are allowed for the address field'
      });
    }
    if (!address.trim()) {
      return res.status(400).send({
        status: 'error',
        error: 'address field cannot be blank'
      });
    }
    return next();
  }

  /**
   * @description - method that validates user input during log in
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {function} next - the callback function
   * @returns {object} - status code and error
   */
  loginMiddleware(req, res, next) {
    const {
      email,
      password
    } = req.body;
    if (email === undefined) {
      return res.status(400).send({
        status: 'error',
        error: 'email field is required'
      });
    }
    if (!re.test(String(email).toLowerCase())) {
      return res.status(400).send({
        status: 'error',
        error: 'invalid email'
      });
    }
    if (password === undefined) {
      return res.status(400).send({
        status: 'error',
        error: 'password field is required'
      });
    }
    return next();
  }

  /**
   * @description - method that validates input on create menu route
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {function} next - the callback function
   * @returns {object} - status code and error
   */
  createMenu(req, res, next) {
    const {
      foodName,
      category,
      price,
      description
    } = req.body;
    if (foodName === undefined) {
      return res.status(400).send({
        status: 'error',
        error: 'foodName field is required'
      });
    }
    if (category === 'Select Category') {
      return res.status(400).send({
        status: 'error',
        error: 'category field is required'
      });
    }
    if (description === undefined) {
      return res.status(400).send({
        status: 'error',
        error: 'description field is required'
      });
    }
    if (typeof (foodName) !== 'string') {
      return res.status(400).send({
        status: 'error',
        error: 'invalid type for foodName, must be a string'
      });
    }
    if (typeof (description) !== 'string') {
      return res.status(400).send({
        status: 'error',
        error: 'invalid type for description, must be a string'
      });
    }
    if (typeof (category) !== 'string') {
      return res.status(400).send({
        status: 'error',
        error: 'invalid type for category, must be a string'
      });
    }
    if (!(/^[a-zA-Z\s]*$/).test(foodName)) {
      return res.status(400).send({
        status: 'error',
        error: 'Numbers and special characters not allowed as part of food name, only letters and spaces are allowed'
      });
    }
    if (price === undefined) {
      return res.status(400).send({
        status: 'error',
        error: 'price field is required'
      });
    }
    if (category.length > 100) {
      return res.status(400).send({
        status: 'error',
        error: 'text for category too long, should not be more than 100 characters'
      });
    }
    if (description.length > 200) {
      return res.status(400).send({
        status: 'error',
        error: 'description too long, should not be more than 200 characters'
      });
    }
    const validPrice = parseInt(price, 10);
    if (isNaN(validPrice)) {
      return res.status(400).send({
        status: 'error',
        error: 'invalid data type for price, must be a number'
      });
    }
    if (!(parseInt(price, 10) === validPrice)) {
      return res.status(400).send({
        status: 'error',
        error: 'invalid number type for price, must be integer'
      });
    }
    config.query('SELECT * FROM menu WHERE food=($1) AND category=($2) AND price=($3) AND description=($4) LIMIT 1',
      [foodName, category, price, description])
      .then((result) => {
        if (result.rowCount !== 0) {
          return res.status(409).send({
            status: 'error',
            error: 'food already in database'
          });
        }
        return next();
      })
      .catch(e => console.log(e));
  }

  /**
   * @description - method that validates user input on updating status of an order
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {function} next - the callback function
   * @returns {object} - status code and error
   */
  updateStatus(req, res, next) {
    const { status } = req.body;
    if (status === undefined) {
      return res.status(400).send({
        status: 'error',
        error: 'status field not found, status field is required'
      });
    }
    if (typeof (status) !== 'string') {
      return res.status(400).send({
        status: 'error',
        error: 'invalid data type for status, must be a string'
      });
    }
    if (
      !(status.toLowerCase() === 'new'
      || status.toLowerCase() === 'processing'
      || status.toLowerCase() === 'cancelled'
      || status.toLowerCase() === 'complete')) {
      return res.status(400).send({
        status: 'error',
        error: `the string ${status} is not allowed for this field, only New, Processing, Cancelled, Complete`
      });
    }
    return next();
  }

  /**
   * @description - method that validates param
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {function} next - the callback function
   * @returns {object} - status code and error
   */
  checkParam(req, res, next) {
    if ((req.url) === `/orders/${req.params.orderId}`) {
      const { orderId } = req.params;
      const orderIdParam = parseInt(orderId, 10);
      if (isNaN(orderIdParam) || isNaN(Number(orderId)) || !(parseInt(orderIdParam, 10) === Number(orderId))) {
        return res.status(400).send({
          status: 'error',
          error: 'invalid data type, param must be an integer'
        });
      }
    }
    if ((req.url) === `/users/${req.params.userId}/orders`) {
      const { userId } = req.params;
      const userIdParam = parseInt(userId, 10);
      if (isNaN(userIdParam) || isNaN(Number(userId)) || !(parseInt(userIdParam, 10) === Number(userId))) {
        return res.status(400).send({
          status: 'error',
          error: 'invalid data type, param must be an integer'
        });
      }
    }
    return next();
  }

  /**
   * @description - method that validates input on place order route and modifies the request body of place order endpoint
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {function} next - the callback function
   * @returns {object} - status code and error
   */
  placeOrder(req, res, next) {
    const {
      orders
    } = req.body;
    if (orders === undefined) {
      return res.status(400).send({
        status: 'error',
        error: 'orders field is required'
      });
    }
    if (orders.constructor !== Array) {
      return res.status(400).send({
        status: 'error',
        error: 'invalid type for orders, must be an Array'
      });
    }
    if (orders.length === 0) {
      return res.status(400).send({
        status: 'error',
        error: 'cart order empty, please fill'
      });
    }
    const promiseArray = [];
    const userOrders = [];
    let Query;
    for (let i = 0; i < orders.length; i += 1) {
      if (orders[i].foodId === undefined) {
        return res.status(400).send({
          status: 'error',
          error: 'object needs to have foodId property'
        });
      }
      if (orders[i].quantity === undefined) {
        return res.status(400).send({
          status: 'error',
          error: 'object needs to have quantity property'
        });
      }
      if (isNaN(orders[i].foodId) || typeof (orders[i].foodId) === 'string') {
        return res.status(400).send({
          status: 'error',
          error: 'invalid type for foodId, type should be a number'
        });
      }
      if (isNaN(orders[i].quantity) || typeof (orders[i].quantity) === 'string') {
        return res.status(400).send({
          status: 'error',
          error: 'invalid type for quantity, type should be a number'
        });
      }
      if (!(parseInt(orders[i].foodId, 10) === orders[i].foodId)) {
        return res.status(400).send({
          status: 'error',
          error: 'invalid number type, foodId should be an integer'
        });
      }
      if (!(parseInt(orders[i].quantity, 10) === orders[i].quantity)) {
        return res.status(400).send({
          status: 'error',
          error: 'invalid number type, quantity should be an integer'
        });
      }
      Query = config.query(`
      SELECT food, price, category FROM menu WHERE foodId = ($1) LIMIT 1
      `, [orders[i].foodId]);
      promiseArray.push(Query);
      userOrders.push(orders[i]);
    }
    const orderArray = [];
    Promise.all(promiseArray).then((result) => {
      for (let item = 0; item < result.length; item += 1) {
        if (result[item].rowCount === 0) {
          req.error = `foodId ${userOrders[item].foodId} not found`;
          return;
        }
        result[item].rows[0].quantity = req.body.orders[item].quantity;
        result[item].rows[0].total = req.body.orders[item].quantity * result[item].rows[0].price;
        orderArray.push(result[item].rows[0]);
      }
      req.body.orders = orderArray;
      let SUMTOTAL = 0;
      for (let index = 0; index < orderArray.length; index += 1) {
        SUMTOTAL += orderArray[index].total;
      }
      res.SUMTOTAL = SUMTOTAL;
      return next();
    }).then(() => {
      if (req.error) {
        return res.status(404).send({
          status: 'error',
          error: req.error
        });
      }
    }).catch(error => res.status(500).send({ error }));
  }

  /**
   * @description - method that validates input on place order route
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {function} next - the callback function
   * @returns {object} - status code and error
   */
  getAllOrders(req, res, next) {
    config.query(`
      SELECT C.orders,
      C.orderId,
      C.status, 
      C.createdAt, 
      U.username, 
      U.address, 
      U.email,
      U.phone
      FROM cart c
      JOIN users u ON c.userId = u.userId ORDER BY orderId DESC
     `).then((result) => {
      if (result.rowCount === 0) {
        return res.status(404).send({
          status: 'error',
          error: 'No order found'
        });
      }
      req.orders = result.rows;
      return next();
    }).catch(e => console.error(e));
  }
}
export default new validation();
