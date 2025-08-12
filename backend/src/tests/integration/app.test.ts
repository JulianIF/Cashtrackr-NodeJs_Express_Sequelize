import request from "supertest";
import server from "../../server";
import { AuthController } from "../../controllers/AuthController";
import User from "../../models/User";
import * as authUtils from "../../utils/auth";
import * as jwtUtils from "../../utils/jwt";

describe('Authentication - Create Account', () =>
{
    it('Should display validation errors when form is empty', async () => 
    {
        const response = await request(server)
                                .post('/api/auth/create-account')
                                .send({})

        const createAccountMock = jest.spyOn(AuthController, 'createAccount')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(5)

        expect(createAccountMock).not.toHaveBeenCalled()
    })  

    it('Should code 400 if email is invalid', async () => 
    {
        const response = await request(server)
                                .post('/api/auth/create-account')
                                .send({
                                    name: 'Test User',
                                    email: 'invalid-email',
                                    password: 'password123'
                                })

        const createAccountMock = jest.spyOn(AuthController, 'createAccount')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.body.errors[0].msg).toBe('Invalid email')

        expect(createAccountMock).not.toHaveBeenCalled()
    })  

    it('Should code 400 if password is too short', async () => 
    {
        const response = await request(server)
                                .post('/api/auth/create-account')
                                .send({
                                    name: 'Test User',
                                    email: 'valid@email.com',
                                    password: 'pass'
                                })

        const createAccountMock = jest.spyOn(AuthController, 'createAccount')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Password too short - Minimum 8 characters')

        expect(createAccountMock).not.toHaveBeenCalled()
    })  

    it('Should register a new user successfully', async () => 
    {
        jest.setTimeout(15000);
        const userData = 
        {
            name: 'Test User',
            email: 'valid@email.com',
            password: 'password'
        }
        const response = await request(server)
                                .post('/api/auth/create-account')
                                .send(userData)

        expect(response.status).toBe(201)
        expect(response.body).not.toHaveProperty('errors')
    })

    it('Should return 409 conflict when user is already registered', async () => 
    {
        jest.setTimeout(15000);
        const userData = 
        {
            name: 'Test User',
            email: 'valid@email.com',
            password: 'password'
        }
        const response = await request(server)
                                .post('/api/auth/create-account')
                                .send(userData)

        expect(response.status).toBe(409)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('User already exists')
        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(201)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('Authentication - Confirm Account with token', () =>
{
    it('Should display error if token is empty or invalid', async () => 
    {
        const response = await request(server)
                                .post('/api/auth/confirm-account')
                                .send({token: 'invalid'})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Invalid Token')
    })

    it('Should display error if token doesnt exist', async () => 
    {
        const response = await request(server)
                                .post('/api/auth/confirm-account')
                                .send({token: '123456'})

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Invalid Token')
    })

    it('Should confirm account with a valid token', async () => 
    {
        const token = globalThis.cashTrackerConfirmationToken

        const response = await request(server)
                                .post('/api/auth/confirm-account')
                                .send({ token })

        expect(response.status).toBe(200)
        expect(response.body).not.toHaveProperty('error')
        expect(response.body).toBe('Account Confirmed')
    })
})

describe('Authentication - Log In', () =>
{
    beforeEach(() =>
    {
        jest.clearAllMocks()
    })

    it('Should display validation errors when form is empty', async () => 
    {
        const response = await request(server)
                                .post('/api/auth/logIn')
                                .send({})

        const logInMock = jest.spyOn(AuthController, 'logIn')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(logInMock).not.toHaveBeenCalled()
    })

    it('Should return code 400 when email is invalid', async () => 
    {
        const response = await request(server)
                                .post('/api/auth/logIn')
                                .send({ password: 'password', email: 'invalid-email' })

        const logInMock = jest.spyOn(AuthController, 'logIn')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(logInMock).not.toHaveBeenCalled()
        expect(response.body.errors[0].msg).toBe('Invalid email')
    })

    it('Should return code 404 when user is not found', async () => 
    {
        const response = await request(server)
                                .post('/api/auth/logIn')
                                .send({ password: 'password', email: 'not_found@email.com' })


        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('User not found')

        expect(response.status).not.toBe(200)
    })

    it('Should return code 403 when user is not confirmed', async () => 
    {
        //This can also be tested with a real endpoint by sending a request to create an account before logging in
        (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id: 1,
                confirmed:false,
                password: 'hashedpassword',
                email: 'not_confirmed@email.com'
            })

        const response = await request(server)
                                .post('/api/auth/logIn')
                                .send({ password: 'password', email: 'not_confirmed@email.com' })

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Account not confirmed')

        expect(response.status).not.toBe(200)
        expect(response.status).not.toBe(400)
    })

    it('Should return code 401 when password is incorrect', async () => 
    {
        const findOne = (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id: 1,
                confirmed:true,
                password: 'hashedpassword',
                email: 'confirmed@email.com'
            })
        const checkPassword = jest.spyOn(authUtils, 'checkPassword').mockResolvedValue(false)

        const response = await request(server)
                                .post('/api/auth/logIn')
                                .send({ password: 'wrong_password', email: 'confirmed@email.com' })

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Incorrect Password')
        expect(checkPassword).toHaveBeenCalledTimes(1)
        expect(findOne).toHaveBeenCalledTimes(1)

        expect(response.status).not.toBe(200)
        expect(response.status).not.toBe(400)
    })

    it('Should return code 201 and return JWT when validation is correct', async () => 
    {
        const findOne = (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id: 1,
                confirmed:true,
                password: 'hashedpassword',
                email: 'confirmed@email.com'
            })
        const checkPassword = jest.spyOn(authUtils, 'checkPassword').mockResolvedValue(true)

        const generateJWT = jest.spyOn(jwtUtils, 'generateJWT').mockReturnValue('jwt_token')

        const response = await request(server)
                                .post('/api/auth/logIn')
                                .send({ password: 'password', email: 'confirmed@email.com' })

        expect(response.status).toBe(200)

        expect(checkPassword).toHaveBeenCalledTimes(1)
        expect(findOne).toHaveBeenCalledTimes(1)
        expect(generateJWT).toHaveBeenCalledTimes(1)

        expect(response.body).toEqual('jwt_token')
        expect(checkPassword).toHaveBeenCalledWith('password', 'hashedpassword')
        expect(generateJWT).toHaveBeenCalledWith(1)

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('error')
    })
})

let jwt:string

async function authenticateAndGetJWT()
{
    const response = await request(server)
                        .post('/api/auth/logIn')
                        .send({ password: 'password', email: 'valid@email.com' })
    jwt = response.body
    expect(response.status).toBe(200)
}

describe('GET /api/budgets', () =>
{
    beforeAll( async () =>
    {
        jest.restoreAllMocks()
    })

    beforeAll( async () =>
    {
        await authenticateAndGetJWT()
    })

    it('Should reject users without a JWT', async () => 
    {
        const response = await request(server)
                                .get('/api/budgets')
        
        expect(response.status).toBe(401)
        expect(response.body.error).toBe('Not Authorized')
    })

    it('Should allow users with a valid JWT access to budgets', async () => 
    {
        const response = await request(server)
                                .get('/api/budgets')
                                .auth(jwt, { type: 'bearer' })
        
        expect(response.status).toBe(200)
        expect(response.status).not.toBe(401)
    })

    it('Should reject users without a valid JWT', async () => 
    {
        const response = await request(server)
                                .get('/api/budgets')
                                .auth('invalid_jwt', { type: 'bearer' })
        
        expect(response.status).toBe(500)
        expect(response.body.error).toBe('Invalid Token')
        expect(response.status).not.toBe(200)
    })
})

describe('POST /api/budgets', () =>
{
    beforeAll( async () =>
    {
        await authenticateAndGetJWT()
    })

    it('Should reject post request from users without a JWT', async () => 
    {
        const response = await request(server)
                                .post('/api/budgets')
        
        expect(response.status).toBe(401)
        expect(response.body.error).toBe('Not Authorized')
    })

    it('Should return code 400 and an error message if the new budget is empty', async () => 
    {
        const response = await request(server)
                                .post('/api/budgets')
                                .auth(jwt, { type: 'bearer' })
                                .send({})
        
        expect(response.status).toBe(400)
        expect(response.body.errors).toHaveLength(4)
    })

    it('Should create a new budget and return a success message', async () => 
    {
        const response = await request(server)
                                .post('/api/budgets')
                                .auth(jwt, { type: 'bearer' })
                                .send({ name: 'Test Budget', amount: 1000 })
        
        expect(response.status).toBe(201)
        expect(response.body).toBe('Budget Created')
        expect(response.status).not.toBe(400)
    })
})

describe('GET /api/budgets/:budgetId', () =>
{
    beforeAll( async () =>
    {
        await authenticateAndGetJWT()
    })

    it('Should reject get request to budget id without a JWT', async () => 
    {
        const response = await request(server)
                                .get('/api/budgets/1')
        
        expect(response.status).toBe(401)
        expect(response.body.error).toBe('Not Authorized')
    })

    it('Should return code 400 when id is not valid', async () => 
    {
        const response = await request(server)
                                .get('/api/budgets/not_valid')
                                .auth(jwt, { type: 'bearer' })
        
        expect(response.status).toBe(400)
        expect(response.status).not.toBe(401)
        expect(response.body.errors).toBeDefined()
        expect(response.body.error).not.toBe('Not Authorized')
    })

    it('Should return code 404 when a budget doesnt exist', async () => 
    {
        const response = await request(server)
                                .get('/api/budgets/3000')
                                .auth(jwt, { type: 'bearer' })
        
        expect(response.status).toBe(404)
        expect(response.status).not.toBe(401)
        expect(response.status).not.toBe(400)
        expect(response.body.error).toBe('Budget not found')
    })

    it('Should return code 201 and return a budget by id', async () => 
    {
        const response = await request(server)
                                .get('/api/budgets/1')
                                .auth(jwt, { type: 'bearer' })
        
        expect(response.status).toBe(200)
        expect(response.status).not.toBe(401)
        expect(response.status).not.toBe(400)
    })
})

describe('PUT /api/budgets/:budgetId', () =>
{
    beforeAll( async () =>
    {
        await authenticateAndGetJWT()
    })

    it('Should reject get request to budget id without a JWT', async () => 
    {
        const response = await request(server)
                                .put('/api/budgets/1')
        
        expect(response.status).toBe(401)
        expect(response.body.error).toBe('Not Authorized')
    })

    it('Should display validation errors if form is empty', async () => 
    {
        const response = await request(server)
                                .put('/api/budgets/1')
                                .auth(jwt, { type: 'bearer' })
                                .send({})
        
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
        expect(response.body.errors).toHaveLength(4)
    })

    it('Should update a budget by id and return a success message', async () => 
    {
        const response = await request(server)
                                .put('/api/budgets/1')
                                .auth(jwt, { type: 'bearer' })
                                .send({ name: 'Updated Budget', amount: 300 })
        
        expect(response.status).toBe(200)
        expect(response.body).toBe('Budget Updated')
    })
})

describe('DELETE /api/budgets/:budgetId', () =>
{
    beforeAll( async () =>
    {
        await authenticateAndGetJWT()
    })

    it('Should reject get request to budget id without a JWT', async () => 
    {
        const response = await request(server)
                                .delete('/api/budgets/1')
        
        expect(response.status).toBe(401)
        expect(response.body.error).toBe('Not Authorized')
    })

    it('Should return code 404 when budget doesnt exist', async () => 
    {
        const response = await request(server)
                                .delete('/api/budgets/3000')
                                .auth(jwt, { type: 'bearer' })
        
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Budget not found')
    })

    it('Should delete a budget by id and return a success message', async () => 
    {
        const response = await request(server)
                                .delete('/api/budgets/1')
                                .auth(jwt, { type: 'bearer' })
        
        expect(response.status).toBe(200)
        expect(response.body).toBe('Budget Eliminated')
    })
})