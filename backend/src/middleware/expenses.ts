import { NextFunction, Response, Request } from "express";
import { body, param, validationResult } from "express-validator";
import Expense from "../models/Expense";

declare global
{
    namespace Express 
    {
        interface Request
        {
            expense?: Expense
        }
    }
}

export const validateExpenseId = async (req: Request, res: Response, next:NextFunction) =>
{
    await param('expenseId').isInt().withMessage('Invalid ID').custom(value => value > 0).withMessage('Invalid ID').run(req)

    let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
    next()
}

export const validateExpenseExists = async (req: Request, res: Response, next:NextFunction) =>
{
    try 
    {
        const {expenseId} = req.params
        const expense = await Expense.findByPk(expenseId)

        if (!expense)
        {
            const error = new Error('Expense not found')

            return res.status(404).json({error: error.message}) 
        }
        req.expense = expense
        next()
    } 
    catch (e) 
    {
        res.status(500).json({error: 'Server Error'}) 
    }
}

export const validateExpenseInput = async (req: Request, res: Response, next:NextFunction) =>
{
    await body('name').notEmpty().withMessage('Expense name required').run(req)

    await body('amount').notEmpty().withMessage('Expense amount required')
        .isNumeric().withMessage('Expense amount must be a number')
        .custom(value => value > 0).withMessage('Expense amount must be over 0.0').run(req)

    next()
}

export const belongsToBudget = async (req: Request, res: Response, next:NextFunction) =>
{
    if(req.budget.id !== req.expense.budgetId)
    {
        const error = new Error('Invalid Action')

        return res.status(403).json({error: error.message}) 
    }
    next()
}