import { Request, Response } from 'express';
import userModel from '../models/user_model';
const register = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }
    try {
        const user = await userModel.create({
            email: email,
            password: password,
        });
        return res.status(200).send(user);
    } catch (err) {
        return res.status(400);
    }
};


const login = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    res.status(400).send("Not implemented");
};

export default { register, login };