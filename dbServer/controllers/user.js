/* eslint-disable max-len */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import config from '../config/config';
import getUser from '../middlewares/helperFunctions/getUser';
import { re } from '../middlewares/validation';

dotenv.load();
const key = process.env.KEY;

/**
 * @description contains methods that manipulates data from user model
 */
class UserController {
  /**
   * @description - method that signs up a user, the first user to sign up is added as admin whereas the rest are stored as mere users
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - status code and server message
   */
  signupUser(req, res) {
    const encodedPassword = bcrypt.hashSync(req.body.password, 8);
    const {
      username, email, address, phone
    } = req.body;
    config
      .query(
        `INSERT INTO users(
        username,
        email,
        address,
        password,
        phone) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [username, email, address, encodedPassword, phone]
      )
      .then((result) => {
        const token = jwt.sign(
          {
            id: result.rows[0].userid,
            username: result.rows[0].username,
            userType: result.rows[0].user_role
          },
          key,
          {
            expiresIn: 86400
          }
        );
        const user = {
          username: result.rows[0].username,
          email: result.rows[0].email,
          password: req.body.password,
          address: result.rows[0].address,
          userType: result.rows[0].user_role,
          phone: result.rows[0].phone
        };
        return res.status(201).send({
          status: 'success',
          user,
          token,
          message: 'signup successful'
        });
      })
      .catch((err) => {
        const errorDetail = err.detail;
        let error;
        if (errorDetail.includes('email')) {
          error = 'user with email already exists';
        } else {
          error = 'user with username already exists';
        }
        return res.status(409).send({
          status: 'error',
          error
        });
      });
  }

  /**
   * @description - method that logins a user
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - status code and server message
   */
  loginUser(req, res) {
    const message = 'login successful';
    const { email, password } = req.body;
    config
      .query(
        'SELECT * FROM users WHERE email=($1) LIMIT 1',
        [email]
      )
      .then((result) => {
        if (result.rowCount === 0) {
          return res.status(404).send({
            status: 'error',
            error: 'user with email not found'
          });
        }
        const isPasswordValid = bcrypt.compareSync(
          password,
          result.rows[0].password
        );
        if (!isPasswordValid) {
          return res.status(401).send({
            status: 'error',
            error: 'incorrect password'
          });
        }
        const token = jwt.sign(
          {
            id: result.rows[0].userid,
            username: result.rows[0].username,
            userAdmin: result.rows[0].user_role
          },
          key,
          {
            expiresIn: 86400
          }
        );
        const user = {
          username: result.rows[0].username,
          email: result.rows[0].email,
          password: req.body.password,
          address: result.rows[0].address,
          userType: result.rows[0].user_role,
          phone: result.rows[0].phone
        };
        return res.status(200).send({
          status: 'success',
          token,
          user,
          message
        });
      });
  }

  /**
   * @description - method that updates profile of a user
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - status code and server message
   */
  async updateUser(req, res) {
    try {
      const foundUser = await getUser(req.userId);
      const payload = {
        username: req.body.username || foundUser.username,
        email: req.body.email || foundUser.email,
        address: req.body.address || foundUser.address,
        password: req.body.password || foundUser.password,
        phone: req.body.phone || foundUser.phone
      };
      if (!re.test(String(payload.email).toLowerCase())) {
        return res.status(400).send({
          status: 'error',
          error: 'invalid email'
        });
      }
      if (
        !payload.phone.trim()
        || payload.phone.includes(' ')
        || payload.phone.includes('\n')
        || payload.phone.includes('\t')
      ) {
        return res.status(400).send({
          status: 'error',
          error: 'space character is not allowed in phone field'
        });
      }
      if (String(payload.phone).length !== 11) {
        return res.status(400).send({
          status: 'error',
          error: 'phone must be 11 digits'
        });
      }
      if (typeof payload.username !== 'string') {
        return res.status(400).send({
          status: 'error',
          error: 'only strings are allowed for the username field'
        });
      }
      if (
        !payload.username.trim()
        || payload.username.includes(' ')
        || payload.username.includes('\n')
        || payload.username.includes('\t')
      ) {
        return res.status(400).send({
          status: 'error',
          error: 'space character is invalid for username field'
        });
      }
      if (typeof payload.address !== 'string') {
        return res.status(400).send({
          status: 'error',
          error: 'only strings are allowed for the address field'
        });
      }
      if (!payload.address.trim()) {
        return res.status(400).send({
          status: 'error',
          error: 'address field cannot be blank'
        });
      }
      const updatedUser = await config.query(
        `
          UPDATE users SET username=($1), email=($2), address=($3), password=($4), phone=($5) WHERE userId=($6) RETURNING * 
        `,
        [
          payload.username,
          payload.email,
          payload.address,
          payload.password,
          payload.phone,
          req.userId
        ]
      );
      return res.status(200).send({
        message: 'user successfully updated',
        updatedUser: updatedUser.rows[0]
      });
    } catch (error) {
      return res.status(500).send({ error });
    }
  }
}
export default new UserController();
