// // import express, { Request, Response, NextFunction } from "express";
// // import userModel from "../models/user_model";
// // import bcrypt from "bcrypt";
// // import jwt from "jsonwebtoken";

// // const secretKey: string = process.env.SECRET_KEY || 'defaultSecretKey';
// // const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET || 'defaultRefreshTokenSecret';
// // const register = async (req: Request, res: Response): Promise<Response> => {
// //   try {
// //     //  const email = req.body.email;
// //     // const password = req.body.password;
// //     // const name= req.body.username;
// //     // const profileImage= req.body.profileImage;
// //     const { email, password, username, profileImage } = req.body;

// //     if (!email || !password || !username) {
// //       return res.status(400).send("Missing email, password or name ");
// //     }
// //     // Check if user already exists
// //     const existingUser = await userModel.findOne({ email: email });
// //     if (existingUser) {
// //       return res.status(406).send("Email already exists");
// //     }
// //     const salt = await bcrypt.genSalt(10);
// //     const hashedPassword = await bcrypt.hash(password, salt);

// //     const user = await userModel.create({
// //       email: email,
// //       password: hashedPassword,
// //       username: username,
// //       profileImage: profileImage,
// //       // bio: "", // Add bio field if needed
// //       // refreshTokens: [] // Initialize refreshTokens array
// //     });

// //     const accessToken = jwt.sign({ _id: user._id }, secretKey, {
// //       expiresIn: "1h",
// //     });
// //     const refreshToken = jwt.sign({ _id: user._id }, refreshTokenSecret, {
// //       expiresIn: "7d",
// //     });
// //     return res
// //       .status(201)
// //       .json({ ...user.toObject(), accessToken, refreshToken });
// //   } catch (err) {
// //     return res.status(500).send("Server error");
// //   }
// // };
// // //         return res.status(201).json(user);
// // //     } catch (err) {
// // //     console.error(err);
// // //     return res.status(500).send("Error registering user");
// // //     }
// // // };

// // const generateTokens = (
// //   _id: string
// // ): { accessToken: string; refreshToken: string } | null => {
// //   const random = Math.floor(Math.random() * 1000000);
// //   const jwtSecret = process.env.JWT_SECRET;
// //   const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

// //   if (!jwtSecret || !jwtRefreshSecret) {
// //     throw new Error("Missing JWT configuration");
// //   }
// //   const accessToken = jwt.sign(
// //     { _id: _id },
// //     process.env.JWT_SECRET as string,
// //     { expiresIn: process.env.JWT_EXPIRATION || "24h" } as jwt.SignOptions
// //   );

// //   const refreshToken = jwt.sign(
// //     { _id: _id, random: random },
// //     jwtRefreshSecret,
// //     { expiresIn: "7d" } as jwt.SignOptions
// //   );

// //   return { accessToken, refreshToken };
// // };

// // const login = async (req: Request, res: Response) => {
// //   const email = req.body.email;
// //   const password = req.body.password;
// //   if (!email || !password) {
// //     res.status(400).send("wrong email or password");
// //     return;
// //   }
// //   try {
// //     const user = await userModel.findOne({ email: email });
// //     if (!user) {
// //       res.status(401).send("wrong email or password");
// //       return;
// //     }
// //     const validPassword = await bcrypt.compare(password, user.password);
// //     console.log("validPassword", validPassword);
// //     if (!validPassword) {
// //       res.status(401).send("wrong email or password");
// //       return;
// //     }

// //     const userId: string = user._id.toString();
// //     const tokens = generateTokens(userId);
// //     if (!tokens) {
// //       res.status(500).send("missing auth configuration");
// //       return;
// //     }

// //     if (user.refreshTokens == null) {
// //       user.refreshTokens = [];
// //     }
// //     user.refreshTokens.push(tokens.refreshToken);
// //     await user.save();
// //     res.status(200).send({
// //       email: user.email,
// //       _id: user._id,
// //       accessToken: tokens.accessToken,
// //       refreshToken: tokens.refreshToken,
// //     });
// //   } catch (err) {
// //     console.error(err);
// //     return res.status(500).send("Error logging in");
// //   }
// // };

// // const logout = async (req: Request, res: Response) => {
// //   const refreshToken = req.body.refreshToken;
// //   if (!refreshToken) {
// //     res.status(400).send("missing refresh token");
// //     return;
// //   }
// //   //first validate the refresh token
// //   if (!process.env.JWT_REFRESH_SECRET) {
// //     res.status(400).send("missing auth configuration");
// //     return;
// //   }
// //   jwt.verify(
// //     refreshToken,
// //     process.env.JWT_REFRESH_SECRET,
// //     async (err: any, data: any) => {
// //       if (err) {
// //         res.status(403).send("invalid token");
// //         return;
// //       }
// //       const payload = data as TokenPayload;
// //       try {
// //         const user = await userModel.findOne({ _id: payload._id });
// //         if (!user) {
// //           res.status(400).send("invalid token");
// //           return;
// //         }
// //         if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
// //           res.status(400).send("invalid token");
// //           user.refreshTokens = [];
// //           await user.save();
// //           return;
// //         }
// //         const tokens = user.refreshTokens.filter(
// //           (token) => token !== refreshToken
// //         );
// //         user.refreshTokens = tokens;
// //         await user.save();
// //         res.status(200).send("logged out");
// //       } catch (err) {
// //         console.error(err);
// //         res.status(500).send("Internal server error");
// //       }
// //     }
// //   );
// // };

// // const refresh = async (req: Request, res: Response) => {
// //   const refreshToken = req.body.refreshToken;
// //   if (!refreshToken) {
// //     res.status(400).send("invalid token");
// //     return;
// //   }
// //   if (!process.env.JWT_REFRESH_SECRET) {
// //     res.status(400).send("missing auth configuration");
// //     return;
// //   }
// //   jwt.verify(
// //     refreshToken,
// //     process.env.JWT_REFRESH_SECRET,
// //     async (err: any, data: any) => {
// //       if (err) {
// //         res.status(403).send("invalid token");
// //         return;
// //       }
// //       const payload = data as TokenPayload;
// //       try {
// //         const user = await userModel.findOne({ _id: payload._id });
// //         if (!user) {
// //           res.status(400).send("invalid token");
// //           return;
// //         }
// //         if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
// //           user.refreshTokens = [];
// //           await user.save();
// //           res.status(400).send("invalid token");
// //           return;
// //         }
// //         const newTokens = generateTokens(user._id.toString());
// //         if (!newTokens) {
// //           user.refreshTokens = [];
// //           await user.save();
// //           res.status(400).send("missing auth configuration");
// //           return;
// //         }

// //         user.refreshTokens = user.refreshTokens.filter(
// //           (token) => token !== refreshToken
// //         );
// //         user.refreshTokens.push(newTokens.refreshToken);
// //         await user.save();

// //         res.status(200).send({
// //           accessToken: newTokens.accessToken,
// //           refreshToken: newTokens.refreshToken,
// //         });
// //       } catch (err) {
// //         res.status(400).send("invalid token");
// //       }
// //     }
// //   );
// // };

// // type TokenPayload = {
// //   _id: string;
// // };

// // export const authMiddleware = (
// //   req: Request,
// //   res: Response,
// //   next: NextFunction
// // ) => {
// //   const authHeader = req.headers["authorization"];
// //   console.log("Authorization Header:", authHeader);

// //   const token = authHeader && authHeader.split(" ")[1];
// //   if (!token) {
// //     res.status(401).send("missing token");
// //     return;
// //   }
// //   if (!process.env.JWT_SECRET) {
// //     res.status(500).send("missing auth configuration");
// //     return;
// //   }
// //   jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
// //     if (err) {
// //       console.error("JWT verification failed:", err);
// //       res.status(403).send("invalid token");
// //       return;
// //     }
// //     const payload = data as TokenPayload;
// //     req.query.user = payload._id;
// //     console.log("Extracted User ID:", req.query.user);
// //     next();
// //   });
// // };

// // export default {
// //   register: register as unknown as express.RequestHandler,
// //   login: login as unknown as express.RequestHandler,
// //   refresh: refresh as unknown as express.RequestHandler,
// //   logout: logout as unknown as express.RequestHandler,
// //   generateTokens,
// // };
// import { NextFunction, Request, Response } from 'express';
// import userModel, { IUser } from '../models/user_model';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { Document } from 'mongoose';

// const register = async (req: Request, res: Response) => {
//     try {
//         const password = req.body.password;
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);
//         const user = await userModel.create({
//             email: req.body.email,
//             password: hashedPassword,
//         });
//         res.status(200).send(user);
//     } catch (err) {
//         res.status(400).send(err);
//     }
// };

// type tTokens = {
//     accessToken: string,
//     refreshToken: string
// }

// const generateToken = (userId: string): tTokens | null => {
//     if (!process.env.TOKEN_SECRET) {
//         return null;
//     }
//     // generate token
//     const random = Math.random().toString();
//     const accessToken = jwt.sign({
//         _id: userId,
//         random: random
//     },
//         process.env.TOKEN_SECRET,
//         { expiresIn: Number(process.env.TOKEN_EXPIRES) });

//     const refreshToken = jwt.sign({
//         _id: userId,
//         random: random
//     },
//         process.env.TOKEN_SECRET,
//         { expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES) });
//     return {
//         accessToken: accessToken,
//         refreshToken: refreshToken
//     };
// };
// const login = async (req: Request, res: Response) => {
//     try {
//         const user = await userModel.findOne({ email: req.body.email });
//         if (!user) {
//             res.status(400).send('wrong username or password');
//             return;
//         }
//         const validPassword = await bcrypt.compare(req.body.password, user.password);
//         if (!validPassword) {
//             res.status(400).send('wrong username or password');
//             return;
//         }
//         if (!process.env.TOKEN_SECRET) {
//             res.status(500).send('Server Error');
//             return;
//         }
//         // generate token
//         const tokens = generateToken(user._id);
//         if (!tokens) {
//             res.status(500).send('Server Error');
//             return;
//         }
//         if (!user.refreshTokens) {
//             user.refreshTokens = [];
//         }
//         user.refreshTokens.push(tokens.refreshToken);
//         await user.save();
//         res.status(200).send(
//             {
//                 accessToken: tokens.accessToken,
//                 refreshToken: tokens.refreshToken,
//                 _id: user._id
//             });

//     } catch (err) {
//         res.status(400).send(err);
//     }
// };

// type tUser = Document<unknown, {}, IUser> & IUser & Required<{
//     _id: string;
// }> & {
//     __v: number;
// }
// const verifyRefreshToken = (refreshToken: string | undefined) => {
//     return new Promise<tUser>((resolve, reject) => {
//         //get refresh token from body
//         if (!refreshToken) {
//             reject("fail");
//             return;
//         }
//         //verify token
//         if (!process.env.TOKEN_SECRET) {
//             reject("fail");
//             return;
//         }
//         jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, payload: any) => {
//             if (err) {
//                 reject("fail");
//                 return
//             }
//             //get the user id fromn token
//             const userId = payload._id;
//             try {
//                 //get the user form the db
//                 const user = await userModel.findById(userId);
//                 if (!user) {
//                     reject("fail");
//                     return;
//                 }
//                 if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
//                     user.refreshTokens = [];
//                     await user.save();
//                     reject("fail");
//                     return;
//                 }
//                 const tokens = user.refreshTokens!.filter((token) => token !== refreshToken);
//                 user.refreshTokens = tokens;

//                 resolve(user);
//             } catch (err) {
//                 reject("fail");
//                 return;
//             }
//         });
//     });
// }

// const logout = async (req: Request, res: Response) => {
//     try {
//         const user = await verifyRefreshToken(req.body.refreshToken);
//         await user.save();
//         res.status(200).send("success");
//     } catch (err) {
//         res.status(400).send("fail");
//     }
// };

// const refresh = async (req: Request, res: Response) => {
//     try {
//         const user = await verifyRefreshToken(req.body.refreshToken);
//         if (!user) {
//             res.status(400).send("fail");
//             return;
//         }
//         const tokens = generateToken(user._id);

//         if (!tokens) {
//             res.status(500).send('Server Error');
//             return;
//         }
//         if (!user.refreshTokens) {
//             user.refreshTokens = [];
//         }
//         user.refreshTokens.push(tokens.refreshToken);
//         await user.save();
//         res.status(200).send(
//             {
//                 accessToken: tokens.accessToken,
//                 refreshToken: tokens.refreshToken,
//                 _id: user._id
//             });
//         //send new token
//     } catch (err) {
//         res.status(400).send("fail");
//     }
// };

// type Payload = {
//     _id: string;
// };

// export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     const authorization = req.header('authorization');
//     const token = authorization && authorization.split(' ')[1];

//     if (!token) {
//         res.status(401).send('Access Denied');
//         return;
//     }
//     if (!process.env.TOKEN_SECRET) {
//         res.status(500).send('Server Error');
//         return;
//     }

//     jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
//         if (err) {
//             res.status(401).send('Access Denied');
//             return;
//         }
//         req.params.userId = (payload as Payload)._id;
//         next();
//     });
// };

// export default {
//     register,
//     login,
//     refresh,
//     logout
// };

import express, {  Request, Response, NextFunction } from 'express';
import userModel from '../models/user_model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const register = async (req: Request, res: Response) : Promise<Response> =>  {
   
    try {
         const email = req.body.email;
        const password = req.body.password;
        const name= req.body.username;
            if (!email || !password || !name) {
                return res.status(400).send("Missing email, password or name ");
                }
        // Check if user already exists
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(406).send("Email already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            email: email,
            password: hashedPassword,
            username: name,
            // refreshTokens: [] // Initialize refreshTokens array
        });
        return res.status(200).json(user);
    } catch (err) {
    console.error(err);
    return res.status(500).send("Error registering user");
    }
};

// const generateTokens = (_id: string): { accessToken: string, refreshToken: string } | null => {
//     const random = Math.floor(Math.random() * 1000000);
//     const jwtSecret = process.env.JWT_SECRET;
//     const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

//     if (!jwtSecret || !jwtRefreshSecret) {
//         throw new Error("Missing JWT configuration");
//     }
//     const accessToken = jwt.sign(
//         { _id: _id },
//         process.env.JWT_SECRET as string,
//         { expiresIn: process.env.JWT_EXPIRATION || "24h" } as jwt.SignOptions
//     );

//     const refreshToken = jwt.sign(
//         { _id: _id, random: random },
//         jwtRefreshSecret,
//         { expiresIn: '7d' } as jwt.SignOptions
//     );

//     return { accessToken, refreshToken };
// }

const generateTokens = (_id: string): { accessToken: string, refreshToken: string } | null => {
    const random = Math.random().toString();
    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtSecret || !jwtRefreshSecret) {
        throw new Error("Missing JWT configuration");
    }

    const accessToken = jwt.sign(
        { _id: _id, random },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRATION || "24h" } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
        { _id: _id, random },
        jwtRefreshSecret,
        { expiresIn: '7d' } as jwt.SignOptions
    );

    return { accessToken, refreshToken };
};


// const login = async (req: Request, res: Response) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     if (!email || !password) {
//         res.status(400).send("wrong email or password");
//         return;
//     }
//     try {
//         const user = await userModel.findOne({ email: email });
//         if (!user) {
//             res.status(401).send("wrong email or password");
//             return;
//         }
//         const validPassword = await bcrypt.compare(password, user.password);
//         console.log("validPassword", validPassword);
//         if (!validPassword) {
//             res.status(401).send("wrong email or password");
//             return;
//         }

//         const userId: string = user._id.toString();
//         const tokens = generateTokens(userId);
//         if (!tokens) {
//             res.status(500).send("missing auth configuration");
//             return;
//         }

//         if (user.refreshTokens == null) {
//             user.refreshTokens = [];
//         }
//         user.refreshTokens.push(tokens.refreshToken);
//         await user.save();
//         res.status(200).send({
//             email: user.email,
//             _id: user._id,
//             accessToken: tokens.accessToken,
//             refreshToken: tokens.refreshToken,
//         });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Error logging in");
//     }
// };

const login = async (req: Request, res: Response) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            res.status(400).send('wrong username or password');
            return;
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).send('wrong username or password');
            return;
        }
        if (!process.env.JWT_SECRET) {
            res.status(500).send('Server Error');
            return;
        }
        // generate token
        const tokens = generateTokens(user._id);
        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshTokens) {
            user.refreshTokens = [];
        }
        user.refreshTokens.push(tokens.refreshToken);
        await user.save();
        res.status(200).send(
            {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                _id: user._id
            });

    } catch (err) {
        res.status(400).send(err);
    }
};

const logout = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(400).send("missing refresh token");
        return;
    }
        //first validate the refresh token
    if (!process.env.JWT_REFRESH_SECRET) {
        res.status(400).send("missing auth configuration");
        return;
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err: any, data: any) => {
        if (err) {
            res.status(403).send("invalid token");
            return;
        }
        const payload = data as TokenPayload;
        try {
            const user = await userModel.findOne({ _id: payload._id });
            if (!user) {
                res.status(400).send("invalid token");
                return;
            }
            if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                res.status(400).send("invalid token");
                user.refreshTokens = [];
                await user.save();
                return;
            }
            const tokens = user.refreshTokens.filter((token) => token !== refreshToken);
            user.refreshTokens = tokens;
            await user.save();
            res.status(200).send("logged out");
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal server error");
        }
    });
};

const refresh = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(400).send("invalid token");
        return;
    }
    if (!process.env.JWT_REFRESH_SECRET) {
        res.status(400).send("missing auth configuration");
        return;
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err: any, data: any) => {
        if (err) {
            res.status(403).send("invalid token");
            return;
        }
        const payload = data as TokenPayload;
        try {
            const user = await userModel.findOne({ _id: payload._id });
            if (!user) {
                res.status(400).send("invalid token");
                return;
            }
            if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                user.refreshTokens = [];
                await user.save();
                res.status(400).send("invalid token");
                return;
            }
            const newTokens = generateTokens(user._id.toString());
            if (!newTokens) {
                user.refreshTokens = [];
                await user.save();
                res.status(400).send("missing auth configuration");
                return;
            }

            user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
            user.refreshTokens.push(newTokens.refreshToken);
            await user.save();

            res.status(200).send({
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
            });
        } catch (err) {
            res.status(400).send("invalid token");
        }
    });
};

type TokenPayload = {
    _id: string;
};

// export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     const authHeader = req.headers['authorization'];
//     console.log("Authorization Header:", authHeader);

//     const token = authHeader && authHeader.split(' ')[1];
//     if (!token) {
//         res.status(401).send("missing token");
//         return;
//     }
//     if (!process.env.JWT_SECRET) {
//         res.status(500).send("missing auth configuration");
//         return;
//     }
//     jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
//         if (err) {
//             console.error("JWT verification failed:", err);
//             res.status(403).send("invalid token");
//             return;
//         }
//         const payload = data as TokenPayload;
//         req.query.user= payload._id;
//         console.log("Extracted User ID:", req.query.user);
//         next();
//     });
// };
// export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     console.log("Authorization Header:", req.headers.authorization);

//     const authorization = req.header('Authorization');
//     const token = authorization && authorization.split(' ')[1];

//     if (!token) {
//         res.status(401).send('Access Denied');
//         return;
//     }
//     if (!process.env.JWT_SECRET) {
//         res.status(500).send('Server Error');
//         return;
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
//         if (err) {
//             res.status(401).send('Access Denied');
//             return;
//         }
//         req.params.userId = (payload as TokenPayload)._id;
//         next();
//     });
// };

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header('authorization');
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
        res.status(401).send('Access Denied');
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(500).send('Server Error');
        return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.status(401).send('Access Denied');
            return;
        }
        req.params.userId = (payload as TokenPayload)._id;
        next();
    });
};
export default { 
register: register as unknown as express.RequestHandler,
login: login as unknown as express.RequestHandler,
refresh: refresh as unknown as express.RequestHandler,
logout: logout as unknown as express.RequestHandler,
generateTokens
 };