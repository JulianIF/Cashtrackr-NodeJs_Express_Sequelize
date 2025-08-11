import { createRequest, createResponse } from 'node-mocks-http'
import User from '../../../models/User'
import { AuthController } from '../../../controllers/AuthController'
import { checkPassword, hashPassword } from '../../../utils/auth'
import { generateToken } from '../../../utils/token'
import { AuthEmail } from '../../../emails/AuthEmail'
import { generateJWT } from '../../../utils/jwt'

jest.mock('../../../models/User')
jest.mock('../../../utils/auth')
jest.mock('../../../utils/token')
jest.mock('../../../utils/jwt')

describe('AuthController.createAccount', () =>
{
    beforeEach(() =>
    {
        jest.resetAllMocks()
    })

    it('Should return status code 409 and an error message if email already registered', async () => 
    {
        (User.findOne as jest.Mock).mockResolvedValue(true)

         const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account',
            body: { email: 'test@test.com', password: 'password' }
        })
        const res = createResponse();

        await AuthController.createAccount(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(409)
        expect(data).toHaveProperty('error', 'User already exists')
        expect(User.findOne).toHaveBeenCalled()
        expect(User.findOne).toHaveBeenCalledTimes(1)
    })


    it('Should register a new user and return a success message', async () => 
    {
         const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account',
            body: { email: 'test@test.com', password: 'password', name: 'Test Name' }
        })
        const res = createResponse();

        const mockUser = { ...req.body, save: jest.fn() };

        (User.create as jest.Mock).mockResolvedValue(mockUser);
        (hashPassword as jest.Mock).mockResolvedValue('hashedpassword');
        (generateToken as jest.Mock).mockReturnValue('123456');
        jest.spyOn(AuthEmail, "sendConfirmationEmail").mockImplementation(() => Promise.resolve());

        await AuthController.createAccount(req, res)

        expect(User.create).toHaveBeenCalledWith(req.body)
        expect(User.create).toHaveBeenCalledTimes(1)
        
        expect(mockUser.save).toHaveBeenCalled()
        expect(mockUser.password).toBe('hashedpassword')
        expect(mockUser.token).toBe('123456')

        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith(
            {
                name: req.body.name,
                token: '123456',
                email: req.body.email
            }
        )
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1)

        expect(res.statusCode).toBe(201)
    })
})

describe('AuthController.logIn', () =>
{
    it('Should return status code 404 and an error message if user is not found', async () => 
    {
        (User.findOne as jest.Mock).mockResolvedValue(null)

         const req = createRequest({
            method: 'POST',
            url: '/api/auth/logIn',
            body: { email: 'test@test.com', password: 'password' }
        })
        const res = createResponse();

        await AuthController.logIn(req, res)

        const data = res._getJSONData()
        
        expect(res.statusCode).toBe(404)
        expect(data).toHaveProperty('error', 'User not found')
    })

    it('Should return status code 403 and an error message if account is not confirmed', async () => 
    {
        (User.findOne as jest.Mock).mockResolvedValue(
            {
                id: 1,
                email: "test@test.com",
                password: "password",
                confirmed: false
            }
        )

         const req = createRequest({
            method: 'POST',
            url: '/api/auth/logIn',
            body: { email: 'test@test.com', password: 'password' }
        })
        const res = createResponse();

        await AuthController.logIn(req, res)

        const data = res._getJSONData()
        
        expect(res.statusCode).toBe(403)
        expect(data).toHaveProperty('error', 'Account not confirmed')
    })

    it('Should return status code 401 and an error message if password is incorrect', async () => 
    {
        const userMock = 
        {
            id: 1,
            email: "test@test.com",
            password: "password",
            confirmed: true
        };
        (User.findOne as jest.Mock).mockResolvedValue(userMock)

         const req = createRequest({
            method: 'POST',
            url: '/api/auth/logIn',
            body: { email: 'test@test.com', password: 'password' }
        })
        const res = createResponse();

        (checkPassword as jest.Mock).mockResolvedValue(false)

        await AuthController.logIn(req, res)

        const data = res._getJSONData()
        
        expect(res.statusCode).toBe(401)
        expect(data).toHaveProperty('error', 'Incorrect Password')
        expect(checkPassword).toHaveBeenCalledWith(req.body.password, userMock.password)
        expect(checkPassword).toHaveBeenCalledTimes(1)
    })

    it('Should return status code a JWT if authentication is successful', async () => 
    {
        const userMock = 
        {
            id: 1,
            email: "test@test.com",
            password: "password",
            confirmed: true
        };

         const req = createRequest({
            method: 'POST',
            url: '/api/auth/logIn',
            body: { email: 'test@test.com', password: 'password' }
        })
        const res = createResponse();

        const testJWT = 'test_jwt';
        (User.findOne as jest.Mock).mockResolvedValue(userMock);
        (checkPassword as jest.Mock).mockResolvedValue(true);
        (generateJWT as jest.Mock).mockReturnValue(testJWT);

        await AuthController.logIn(req, res)

        const data = res._getJSONData()
        
        expect(res.statusCode).toBe(200)
        expect(data).toEqual(testJWT)
        expect(generateJWT).toHaveBeenCalledWith(userMock.id)
        expect(generateJWT).toHaveBeenCalledTimes(1)
    })

})