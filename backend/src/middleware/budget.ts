import { NextFunction, Response, Request } from "express";
import { body, param, validationResult } from "express-validator";
import Budget from "../models/Budget";

declare global
{
    namespace Express 
    {
        interface Request
        {
            budget?: Budget
        }
    }
}

export const validateBudgetId = async (req: Request, res: Response, next:NextFunction) =>
{
    await param('budgetId').isInt().withMessage('Invalid ID').custom(value => value > 0).withMessage('Invalid ID').run(req)

    let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
    next()
}

export const validateBudgetExists = async (req: Request, res: Response, next:NextFunction) =>
{
    try 
    {
        const {budgetId} = req.params
        const budget = await Budget.findByPk(budgetId)

        if (!budget)
        {
            const error = new Error('Budget not found')

            return res.status(404).json({error: error.message}) 
        }
        req.budget = budget
        next()
    } 
    catch (e) 
    {
        res.status(500).json({error: 'Server Error'}) 
    }
}

export const validateBudgetInput = async (req: Request, res: Response, next:NextFunction) =>
{
    await body('name').notEmpty().withMessage('Budget name required').run(req)

    await body('amount').notEmpty().withMessage('Budget amount required')
        .isNumeric().withMessage('Budget amount must be a number')
        .custom(value => value > 0).withMessage('Budget amount must be over 0.0').run(req)

    next()
}

export function hasAccess(req:Request, res:Response, next:NextFunction)
{
    if(req.budget.userId !== req.user.id)
    {
        const error = new Error('Invalid Action')

        return res.status(401).json({error: error.message}) 
    }

    next()
}