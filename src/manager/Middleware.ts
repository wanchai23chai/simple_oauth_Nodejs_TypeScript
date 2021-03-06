import { Request, Response, NextFunction } from 'express'
import JWT from '../common/jwt'
import dbService, { dbAuth } from '../service/dbService'
import { IError, ErrorHandle, CommonError } from '../common/errorHandle';
import * as Joi from '@hapi/joi';
import { commonValidation } from '../common/validation';
export class Middelware {
  async OwnerSystemClient(req: Request, res: Response, next: NextFunction) {
    try {
      const err = new CommonError()
      const schemaClient: Joi.SchemaMap = {
        client_id: Joi.string().required(),
        client_secret: Joi.string().required()
      }
      req.headers = commonValidation(schemaClient, req.headers, true)
      const { client_id, client_secret } = req.headers
      const clientId = process.env.SERVER_OAUTH_ID || '1'
      const secret = process.env.SERVER_OAUTH_SECRATE || 'oauth_password'
      if (client_id === clientId && client_secret === secret) {
        res.locals.client = {
          clientId: clientId,
          clientSecret: secret
        }
        next()
      } else {
        err.setErrorByCode('INVALID_CLIENT')
        throw err
      }
    } catch (error) {
      const err = new ErrorHandle(error)
      err.sendErrorResponse(res)
    }
  }
  async handleClientFromeRequet(req: Request, res: Response, next: NextFunction) {
    try {
      const err = new CommonError()
      const schemaClient: Joi.SchemaMap = {
        client_id: Joi.string().required(),
        client_secret: Joi.string().required()
      }
      req.headers = commonValidation(schemaClient, req.headers, true)
      const { client_id, client_secret } = req.headers
      const result = await dbAuth.client.getClientInfo(parseInt(client_id as string, 10), client_secret as string)
      if (result) {
        const { is_active, client_name, description } = result
        if (is_active) {
          res.locals.client = result
          next()
        } else {
          err.setCustomError(403, 'Client is revoke.', 'CLIENT_REVOKE',
            { isActive: is_active, clientName: client_name, description: description })
          throw err
        }
      } else {
        err.setErrorByCode('INVALID_CLIENT')
        throw err
      }

    } catch (error) {
      const err = new ErrorHandle(error)
      err.sendErrorResponse(res)
    }
  }
  handleToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers
      if (authorization) {
        const token = authorization.replace('Bearer ', '')
        const payload = JWT.verifyToken(token)
        res.locals.payload = payload
        next()
      } else {
        const err = new CommonError()
        err.setErrorByCode('REQUIRE_AUTH')
        throw err
      }
    } catch (error) {
      const err = new ErrorHandle(error)
      err.sendErrorResponse(res)
    }
  }
  getUserPayload(req: Request) {
    try {
      const { authorization } = req.headers
      if (authorization) {
        const token = authorization.replace('Bearer ', '')
        const payload = JWT.verifyToken(token)
        return payload
      } else {
        const err = new CommonError()
        err.setErrorByCode('REQUIRE_AUTH')
        throw err
      }
    } catch (error) {
      const err = new ErrorHandle(error)
      throw err
    }
  }
  async checkRole(roleCode: string) {
    try {

    } catch (error) {
      throw error
    }
  }
  async checkPermission(PermissionCode: Array<string>) {
    try {

    } catch (error) {
      const err = new ErrorHandle(error)
      throw err;
    }
  }
}
export default new Middelware()