import { createRequest, createResponse } from 'node-mocks-http'
import { validateExpenseExists } from '../../../middleware/expenses'
import Expense from '../../../models/Expense'
import { expenses } from '../../mocks/expenses'
import { budgets } from '../../mocks/budgets'
import { hasAccess } from '../../../middleware/budget'

jest.mock('../../../models/Expense', () =>({
    findByPk: jest.fn()
}))

describe('Expense Middleware - validateExpenseExists', () =>
{
    beforeEach(() =>
    {
        (Expense.findByPk as jest.Mock).mockImplementation(id =>
        {
            const expense = expenses.filter(e => e.id === id)[0] ?? null;
            return Promise.resolve(expense)
        })
    })

    it('Should handle non existent expenses', async () => 
    {
        const req = createRequest({
            params: 
            {
                expenseId: 10
            }
        })
        const res = createResponse();
        const next = jest.fn()

        await validateExpenseExists(req, res, next)

        const data = res._getJSONData()

        expect(data).toStrictEqual({ error: 'Expense not found' })
        expect(res.statusCode).toBe(404)
        expect(next).not.toHaveBeenCalled()
    })

    it('Should handle catch', async () => 
    {
        (Expense.findByPk as jest.Mock).mockRejectedValue(new Error)

        const req = createRequest({
            params: 
            {
                expenseId: 1
            }
        })
        const res = createResponse();
        const next = jest.fn()

        await validateExpenseExists(req, res, next)

        const data = res._getJSONData()

        expect(data).toStrictEqual({ error: 'Server Error' })
        expect(res.statusCode).toBe(500)
        expect(next).not.toHaveBeenCalled()
    })

    it('Should proceed to next middleware if expense exists', async () => 
    {
        const req = createRequest({
            params: 
            {
                expenseId: 1
            }
        })
        const res = createResponse();
        const next = jest.fn()

        await validateExpenseExists(req, res, next)

        expect(req.expense).toEqual(expenses[0])
        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
    })

    it('Should return 401 error when the user does not have access', () => 
    {
        const req = createRequest({
            budget: budgets[0],
            user: { id: 20 },
            body: { name: 'New Expense', amount: 3000}
        })
        const res = createResponse();
        const next = jest.fn()

        hasAccess(req, res, next)

        const data = res._getJSONData()

        expect(data).toStrictEqual({ error: 'Invalid Action' })
        expect(res.statusCode).toBe(401)
        expect(next).not.toHaveBeenCalled()
    })

    it('Should proceed to next middleware if user has access', () => 
    {
        const req = createRequest({
            budget: budgets[0],
            user: { id: 1 },
            body: { name: 'New Expense', amount: 3000}
        })
        const res = createResponse();
        const next = jest.fn()

        hasAccess(req, res, next)

        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
    })
})
