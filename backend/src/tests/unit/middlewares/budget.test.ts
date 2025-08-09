import { createRequest, createResponse } from 'node-mocks-http'
import { hasAccess, validateBudgetExists } from '../../../middleware/budget';
import Budget from '../../../models/Budget'
import { budgets } from '../../mocks/budgets';

jest.mock('../../../models/Budget', () =>({
    findByPk: jest.fn()
}))

describe('Budget Middleware - validateBudgetExists', () =>
{
    it('Should handle non existent budgets', async () => 
    {
        (Budget.findByPk as jest.Mock).mockResolvedValue(null)

        const req = createRequest({
            params: 
            {
                budgetId: 1
            }
        })
        const res = createResponse();
        const next = jest.fn()

        await validateBudgetExists(req, res, next)

        const data = res._getJSONData()

        expect(data).toStrictEqual({ error: 'Budget not found' })
        expect(res.statusCode).toBe(404)
        expect(next).not.toHaveBeenCalled()
    })

    it('Should handle catch', async () => 
    {
        (Budget.findByPk as jest.Mock).mockRejectedValue(new Error)

        const req = createRequest({
            params: 
            {
                budgetId: 1
            }
        })
        const res = createResponse();
        const next = jest.fn()

        await validateBudgetExists(req, res, next)

        const data = res._getJSONData()

        expect(data).toStrictEqual({ error: 'Server Error' })
        expect(res.statusCode).toBe(500)
        expect(next).not.toHaveBeenCalled()
    })

    it('Should proceed to next middleware if budget exists', async () => 
    {
        (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0])

        const req = createRequest({
            params: 
            {
                budgetId: 1
            }
        })
        const res = createResponse();
        const next = jest.fn()

        await validateBudgetExists(req, res, next)

        expect(req.budget).toEqual(budgets[0])
        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
    })
})

describe('Budget Middleware - hasAccess', () =>
{
    beforeEach(() =>
    {
        (Budget.findByPk as jest.Mock).mockImplementation(id =>
        {
            const budget = budgets.filter(b => b.id === id)[0];
            return Promise.resolve(budget)
        })
    })

    it('Should return 401 error when the user does not have access', () => 
    {
        (Budget.findByPk as jest.Mock).mockResolvedValue(null)

        const req = createRequest({
            budget: budgets[0],
            user: { id: 2 }
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
        (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0])

        const req = createRequest({
            budget: budgets[0],
            user: { id: 1 }
        })
        const res = createResponse();
        const next = jest.fn()

        hasAccess(req, res, next)

        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
    })
})