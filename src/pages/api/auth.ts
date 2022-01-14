import type { NextApiRequest, NextApiResponse } from 'next'
import { createHash } from 'crypto';

export default (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === "POST") {
    if(req.body.password) {

      const hash = createHash('sha256')
        .update(req.body.password)
        .digest('hex');

      if(process.env.PASSWORD_HASH === hash) {
         res.json({
          token: process.env.AUTH_TOKEN
        })
      } else {
        res.statusCode = 403;
        res.json({
          error: {
            code: "FORBIDDEN",
            message: `Incorrect password`
          }
        })
      }
    }
  } else {
    res.statusCode = 405;
    res.json({
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: `Invalid method ${req.method}. Please use the POST method.`
      }
    })
  }
}