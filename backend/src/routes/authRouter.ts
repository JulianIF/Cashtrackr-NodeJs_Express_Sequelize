import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validator";
import { validateBudgetExists, validateBudgetId, validateBudgetInput } from "../middleware/budget";
import { ExpenseController } from "../controllers/ExpenseController";
import { validateExpenseExists, validateExpenseId, validateExpenseInput } from "../middleware/expenses";
import { AuthController } from "../controllers/AuthController";
import { rateLimiter } from "../config/limiter";
import { authenticate } from "../middleware/auth";

const router = Router()

router.use(rateLimiter)
router.post('/create-account', 
    body('name')
        .notEmpty().withMessage('Name required'),
    body('password')
        .notEmpty().withMessage('Password required')
        .isLength({min: 8}).withMessage('Password too short - Minimum 8 characters'),
    body('email')
        .notEmpty().withMessage('Email required')
        .isEmail().withMessage('Invalid email'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token')
    .isLength({min:6, max:6}).withMessage('Invalid Token'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/logIn',
    body('email')
        .isEmail().withMessage('Invalid email'),
    body('password')
        .notEmpty().withMessage('Password required'),
    handleInputErrors,
    AuthController.logIn
)

router.post('/forgot-password',
    body('email')
        .notEmpty().withMessage('Email required')
        .isEmail().withMessage('Invalid email'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token')
    .notEmpty().isLength({min:6, max:6}).withMessage('Invalid Token'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/reset-password/:token',
    param('token')
    .notEmpty().isLength({min:6, max:6}).withMessage('Invalid Token'),
    body('password')
        .notEmpty().withMessage('New password required')
        .isLength({min: 8}).withMessage('New password is too short - Minimum 8 characters'),
    handleInputErrors,
    AuthController.resetPasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.user
)

router.put('/user',
    authenticate,
    AuthController.updateUser
)

router.post('/update-password',
    authenticate,
    body('current-password')
        .notEmpty().withMessage('Current password required'),
    body('password')
        .notEmpty().withMessage('New password required')
        .isLength({min: 8}).withMessage('New password is too short - Minimum 8 characters'),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
)

router.get('/check-password',
    authenticate,
    body('password')
        .notEmpty().withMessage('Current password required'),
    handleInputErrors,
    AuthController.checkPassword
)

export default router