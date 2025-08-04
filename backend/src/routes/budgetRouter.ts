import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validator";
import { hasAccess, validateBudgetExists, validateBudgetId, validateBudgetInput } from "../middleware/budget";
import { ExpenseController } from "../controllers/ExpenseController";
import { validateExpenseExists, validateExpenseId, validateExpenseInput } from "../middleware/expenses";
import { authenticate } from "../middleware/auth";

const router = Router()

router.use(authenticate)

/* BUDGET ROUTES*/
router.param('budgetId', validateBudgetId)
router.param('budgetId', validateBudgetExists)
router.param('budgetId', hasAccess)

router.get('/', BudgetController.getAll)

router.post('/', 
    validateBudgetInput,
    handleInputErrors,
    BudgetController.create)

router.get('/:budgetId', BudgetController.getById)

router.put('/:budgetId',
    validateBudgetInput,
    handleInputErrors,
    BudgetController.updateById)

router.delete('/:budgetId', BudgetController.deleteById)


/* EXPENSES ROUTES*/
router.param('expenseId', validateExpenseId)
router.param('expenseId', validateExpenseExists)

router.post('/:budgetId/expenses/', 
    validateExpenseInput,
    handleInputErrors,
    ExpenseController.create)

router.get('/:budgetId/expenses/:expenseId', ExpenseController.getById)

router.put('/:budgetId/expenses/:expenseId',
    validateExpenseInput,
    handleInputErrors,
    ExpenseController.updateById)

router.delete('/:budgetId/expenses/:expenseId', ExpenseController.deleteById)

export default router

