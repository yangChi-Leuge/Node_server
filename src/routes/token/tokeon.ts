// import jwt from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';
// import { env } from '../../env';
// import { UserPayload } from '../../type/user'; 

// const JWT_SECRET = env.JWT_SECRET; 


// export function verifyAccessToken(req: Request, res: Response, next: NextFunction): void {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     const token = authHeader.split(' ')[1];

//     jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
//       if (err) {
//         return res.sendStatus(403);
//       }
//       req.user = decoded as UserPayload; 
//       next();
//     });
//   } else {
//     res.sendStatus(401);
//   }
// }
