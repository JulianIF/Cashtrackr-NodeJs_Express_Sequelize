import { createRequest, createResponse } from 'node-mocks-http'
import Expense from '../../../models/Expense'
import { ExpenseController } from '../../../controllers/ExpenseController'
import { expenses } from '../../mocks/expenses'

jest.mock('../../../models/Expense', () =>({
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
}))

describe('BudgetController.create', () =>
{
    it('Should create a new expense and return status code 201', async () => 
    {
        const mockExpense = 
        {
            save: jest.fn().mockResolvedValue(true)
        };
        (Expense.create as jest.Mock).mockResolvedValue(mockExpense)

        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            budget: { id : 1 },
            body: { name: 'Test Expense', amount: 1000 }
        })
        const res = createResponse();

        await ExpenseController.create(req, res)

        const data = res._getJSONData()

        expect(res.statusCode).toBe(201)
        expect(data).toBe('Expense Created')
        expect(mockExpense.save).toHaveBeenCalled()
        expect(mockExpense.save).toHaveBeenCalledTimes(1)
        expect(Expense.create).toHaveBeenCalledWith(req.body)
    })

    it('Should handle errors when creating expenses', async () => 
    {
        const mockExpense = 
        {
            save: jest.fn()
        };
        (Expense.create as jest.Mock).mockRejectedValue(new Error)

        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            budget: { id : 1 },
            body: { name: 'Test Expense', amount: 1000 }
        })
        const res = createResponse();

        await ExpenseController.create(req, res)

        expect(res.statusCode).toBe(500)
        expect(mockExpense.save).not.toHaveBeenCalled()
        expect(res._getJSONData()).toStrictEqual({error: 'Server Error'})
        expect(Expense.create).toHaveBeenCalledWith(req.body)
    })
})

describe('ExpenseController.getById', () =>
{
    it('Should return expense with ID 1', async () => 
    {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: expenses[0]
        })
        const res = createResponse();

        await ExpenseController.getById(req, res)

        const data = res._getJSONData()

        expect(res.statusCode).toBe(200)
        expect(data).toEqual(expenses[0])
    })
})

describe('ExpenseController.updateById', () =>
{
    it('Should update expense and resturn success message', async () => 
    {
        const mockExpense = 
        {
            ...expenses[0],
            update: jest.fn().mockResolvedValue(true)
        };
        const req = createRequest({
            method: 'PUT',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: mockExpense,
            body: { name: 'Updated Expense', amount: 100 }
        })

        const res = createResponse();

        await ExpenseController.updateById(req, res)

        const data = res._getJSONData()

        expect(res.statusCode).toBe(200)
        expect(data).toBe('Expense Updated')
        expect(mockExpense.update).toHaveBeenCalled()
        expect(mockExpense.update).toHaveBeenCalledTimes(1)
        expect(mockExpense.update).toHaveBeenCalledWith(req.body)
    })
})

describe('ExpenseController.deleteById', () =>
{
    it('Should delete expense and resturn success message', async () => 
    {
        const mockExpense = 
        {
            ...expenses[0],
            destroy: jest.fn()
        };
        const req = createRequest({
            method: 'DELETE',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: mockExpense
        })

        const res = createResponse();

        await ExpenseController.deleteById(req, res)

        const data = res._getJSONData()

        expect(res.statusCode).toBe(200)
        expect(data).toBe('Expense Eliminated')
        expect(mockExpense.destroy).toHaveBeenCalled()
        expect(mockExpense.destroy).toHaveBeenCalledTimes(1)
    })
})