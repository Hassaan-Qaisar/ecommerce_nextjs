import connectToDB from "@/database";
import User from "@/models/user";
import { hash } from "bcryptjs";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().required(),
  });

  export const dynamic = "force-dynamic";


export async function POST(req){
    await connectToDB();
    const {name, email, password, role} = await req.json();

    // validation input fields

    const {error} = schema.validate({name, email, password, role})

    if (error){
        return NextResponse.json({
            success: false,
            message: error.details[0].message
        })
    }

    try {
        // check if user already exist
        const isUserAlreadyExists = await User.findOne({email});

        if (isUserAlreadyExists) {
            return NextResponse.json({
                success: false,
                message: 'User with this email already exists.'
            })
        } else {
            const hashPassword = await hash(password, 12);

            const newUser = await User.create({
                name, email, password : hashPassword, role
            })

            if (newUser) {
                return NextResponse.json({
                    success: true,
                    message: 'Account created successfully'
                })
            }
        }

    } catch (error) {
        console.log('An error occurred during registration. Please try again later.')

        return NextResponse.json ({
            success: false,
            message: ` ${error} An error occurred during registration. Please try again later.`
        })
        
    }
}
