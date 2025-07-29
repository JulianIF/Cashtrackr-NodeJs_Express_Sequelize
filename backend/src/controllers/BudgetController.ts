import type { Request, Response } from "express"
import Budget from "../models/Budget"

export class BudgetController
{
    static getAll = async (req: Request, res:Response) =>
    {
        try 
        {
            const budgets = Budget.findAll({ 
                order: 
                [
                    ['createdAt', 'DESC']
                ]
                //TODO: FILTER BY AUTHENTICATED USER
            })
        } 
        catch (e) 
        {
           res.status(500).json({error: 'Server Error'}) 
        }
    }

    static create = async (req: Request, res:Response) =>
    {
        try 
        {
            const budget = new Budget(req.body)

            await budget.save()
            res.status(201).json('Budget Created') 
        } 
        catch (e) 
        {
           res.status(500).json({error: 'Server Error'}) 
        }
    }

    static getById = async (req: Request, res:Response) =>
    {
        console.log("HALP")
        res.json(req.budget)  
    }

    static updateById = async (req: Request, res:Response) =>
    {
        await req.budget.update(req.body)
        res.json('Budget Updated') 
    }

    static deleteById = async (req: Request, res:Response) =>
    {
        await req.budget.destroy()
        res.json('Budget Eliminated') 
    }
}