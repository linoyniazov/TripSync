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
            return res.status(201).json(user);
        } catch (err) {
        console.error(err);
        return res.status(500).send("Error registering user");
        }
    };

    const generateTokens = (_id: string): { accessToken: string, refreshToken: string } | null => {
        const random = Math.floor(Math.random() * 1000000);
        const jwtSecret = process.env.JWT_SECRET;
        const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

        if (!jwtSecret || !jwtRefreshSecret) {
            throw new Error("Missing JWT configuration");
        }
        console.log("Generating token with secret:", jwtSecret);

        const accessToken = jwt.sign(
            { _id: _id, random: random },
            jwtSecret,
            { expiresIn: parseInt(process.env.JWT_EXPIRATION as string) || "1h" }
        );

        const refreshToken = jwt.sign(
            { _id: _id, random: random },
            jwtRefreshSecret,
            { expiresIn: '7d' }
        );

        return { accessToken, refreshToken };
    }

    const login = async (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) {
            res.status(400).send("wrong email or password");
            return;
        }
        try {
            const user = await userModel.findOne({ email: email });
            if (!user) {
                res.status(401).send("wrong email or password");
                return;
            }
            const validPassword = await bcrypt.compare(password, user.password);
            console.log("validPassword", validPassword);
            if (!validPassword) {
                res.status(401).send("wrong email or password");
                return;
            }

            const userId: string = user._id.toString();
            const tokens = generateTokens(userId);
            if (!tokens) {
                res.status(500).send("missing auth configuration");
                return;
            }

            if (user.refreshTokens == null) {
                user.refreshTokens = [];
            }
            user.refreshTokens.push(tokens.refreshToken);
            await user.save();
            res.status(200).send({
                email: user.email,
                _id: user._id,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send("Error logging in");
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

    export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers['authorization'];
        console.log("Authorization Header:", authHeader);

        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).send("missing token");
            return;
        }
        if (!process.env.JWT_SECRET) {
            res.status(500).send("missing auth configuration");
            return;
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if (err) {
                console.error("JWT verification failed:", err);
                res.status(403).send("invalid token");
                return;
            }
            const payload = data as TokenPayload;
            req.query.user= payload._id;
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