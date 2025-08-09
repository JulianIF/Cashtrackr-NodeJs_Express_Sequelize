import { createRequest, createResponse } from 'node-mocks-http'
import { budgets } from '../../mocks/budgets'
import { BudgetController } from '../../../controllers/BudgetController'
import Budget from '../../../models/Budget'
import Expense from '../../../models/Expense'

jest.mock('../../models/Budget', () =>({
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
}))
describe('BudgetController.getAll', () =>
{
    beforeEach(() =>
    {
        (Budget.findAll as jest.Mock).mockReset();
        (Budget.findAll as jest.Mock).mockImplementation((options) =>
        {
            const filteredBudgets = budgets.filter(budget => budget.userId === options.where.userId);
            return Promise.resolve(filteredBudgets)
        })
    })

    it('Should retrieve 2 budgets for user with ID 1', async () => 
    {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id : 1 }
        })
        const res = createResponse();

        await BudgetController.getAll(req, res)

        const data = res._getJSONData()

        expect(data).toHaveLength(2)
        expect(res.statusCode).toBe(200)
    })

    it('Should retrieve 1 budget for user with ID 2', async () => 
    {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id : 2 }
        })
        const res = createResponse();

        await BudgetController.getAll(req, res)

        const data = res._getJSONData()

        expect(data).toHaveLength(1)
        expect(res.statusCode).toBe(200)
    })

    it('Should retrieve 0 budgets for user with ID 10', async () => 
    {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id : 10 }
        })
        const res = createResponse();

        await BudgetController.getAll(req, res)

        const data = res._getJSONData()

        expect(data).toHaveLength(0)
        expect(res.statusCode).toBe(200)
    })

    it('Should handle errors when fetching budgets', async () => 
    {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id : 10 }
        })
        const res = createResponse();

        (Budget.findAll as jest.Mock).mockRejectedValue(new Error)
        await BudgetController.getAll(req, res)

        expect(res.statusCode).toBe(500)
        expect(res._getJSONData()).toStrictEqual({error: 'Server Error'})
    })
})

describe('BudgetController.create', () =>
{
    it('Should create a new budget and return status code 201', async () => 
    {
        const mockBudget = 
        {
            save: jest.fn().mockResolvedValue(true)
        };
        (Budget.create as jest.Mock).mockResolvedValue(mockBudget)

        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id : 1 },
            body: { name: 'Test Budget', amount: 1000 }
        })
        const res = createResponse();

        await BudgetController.create(req, res)

        const data = res._getJSONData()

        expect(res.statusCode).toBe(201)
        expect(data).toBe('Budget Created')
        expect(mockBudget.save).toHaveBeenCalled()
        expect(mockBudget.save).toHaveBeenCalledTimes(1)
        expect(Budget.create).toHaveBeenCalledWith(req.body)
    })

    it('Should handle errors when creating budgets', async () => 
    {
        const mockBudget = 
        {
            save: jest.fn()
        };
        (Budget.create as jest.Mock).mockRejectedValue(new Error)
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets',
            user: { id : 10 }
        })
        const res = createResponse();

        await BudgetController.create(req, res)

        expect(res.statusCode).toBe(500)
        expect(mockBudget.save).not.toHaveBeenCalled()
        expect(res._getJSONData()).toStrictEqual({error: 'Server Error'})
        expect(Budget.create).toHaveBeenCalledWith(req.body)
    })
})

describe('BudgetController.getById', () =>
{
    beforeEach(() =>
    {
        (Budget.findByPk as jest.Mock).mockImplementation(id =>
        {
            const budget = budgets.filter(b => b.id === id)[0];
            return Promise.resolve(budget)
        })
    })

    it('Should return a budget with ID 1 and 3 expenses', async () => 
    {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:budgetId',
            budget: { id : 1 }
        })
        const res = createResponse();

        await BudgetController.getById(req, res)

        const data = res._getJSONData()

        expect(data.expenses).toHaveLength(3)
        expect(res.statusCode).toBe(200)
        expect(Budget.findByPk).toHaveBeenCalled()
        expect(Budget.findByPk).toHaveBeenCalledTimes(1)
        expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id, { include: [Expense] })
    })

    it('Should return a budget with ID 2 and 2 expenses', async () => 
    {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:budgetId',
            budget: { id : 2 }
        })
        const res = createResponse();

        await BudgetController.getById(req, res)

        const data = res._getJSONData()

        expect(data.expenses).toHaveLength(2)
        expect(res.statusCode).toBe(200)
    })

    it('Should return a budget with ID 3 and 0 expenses', async () => 
    {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:budgetId',
            budget: { id : 3 }
        })
        const res = createResponse();

        await BudgetController.getById(req, res)

        const data = res._getJSONData()

        expect(data.expenses).toHaveLength(0)
        expect(res.statusCode).toBe(200)
    })
})

describe('BudgetController.updateById', () =>
{
    beforeEach(() =>
    {
        (Budget.findByPk as jest.Mock).mockImplementation(id =>
        {
            const budget = budgets.filter(b => b.id === id)[0];
            return Promise.resolve(budget)
        })
    })

    it('Should update a budget and return a success message', async () => 
    {
        const mockBudget = 
        {
            update: jest.fn().mockResolvedValue(true)
        };
        const req = createRequest({
            method: 'PUT',
            url: '/api/budgets/:budgetId',
            budget: mockBudget,
            body: { name: 'Updated Budget', amount: 5000 }
        })
        const res = createResponse();

        await BudgetController.updateById(req, res)

        const data = res._getJSONData()

        expect(data).toBe('Budget Updated')
        expect(res.statusCode).toBe(200)
        expect(mockBudget.update).toHaveBeenCalled()
        expect(mockBudget.update).toHaveBeenCalledTimes(1)
        expect(mockBudget.update).toHaveBeenCalledWith(req.body)
    })
})

describe('BudgetController.deleteById', () =>
{
    beforeEach(() =>
    {
        (Budget.findByPk as jest.Mock).mockImplementation(id =>
        {
            const budget = budgets.filter(b => b.id === id)[0];
            return Promise.resolve(budget)
        })
    })

    it('Should delete a budget and return a success message', async () => 
    {
        const mockBudget = 
        {
            destroy: jest.fn().mockResolvedValue(true)
        };
        const req = createRequest({
            method: 'DELETE',
            url: '/api/budgets/:budgetId',
            budget: mockBudget
        })
        const res = createResponse();

        await BudgetController.deleteById(req, res)

        const data = res._getJSONData()

        expect(data).toBe('Budget Eliminated')
        expect(res.statusCode).toBe(200)
        expect(mockBudget.destroy).toHaveBeenCalled()
        expect(mockBudget.destroy).toHaveBeenCalledTimes(1)
    })
})