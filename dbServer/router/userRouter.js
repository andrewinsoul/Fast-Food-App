import express from 'express';
import user from '../controllers/user';
import validation from '../middlewares/validation';
import verifyToken from '../middlewares/helperFunctions/verifyToken';

const userRouter = express.Router();

userRouter
  .post('/auth/signup',
    validation.signupMiddleware,
    user.signupUser)
  .post('/auth/login',
    validation.loginMiddleware,
    user.loginUser)
  .put('/update',
    verifyToken,
    validation.updateUser,
    user.updateUser);

export default userRouter;
