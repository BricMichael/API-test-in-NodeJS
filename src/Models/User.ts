import { Document, Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import bcrypt from 'bcryptjs';


export interface IUser extends Document {
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
    avatar: string
    role: string
    _id: string
    posts: { _id: Schema.Types.ObjectId }[]
}

export interface IUserMethods extends IUser {
    encryptPassword: (password: string) => Promise<string>
    comparePassword: (receivedPassword: string, passwordSaved: string) => Promise<boolean>
}


const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        min: 4,
        unique: true,
        lowercase: true
    },
    firstName: {
        type: String,
        required: true,
        lowercase: true
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        required: true,
        type: String,
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        lowercase: true
    },
    posts: [
        { type: Schema.Types.ObjectId, ref: 'Post' }
    ]

},
    { timestamps: true, versionKey: false }
);


userSchema.methods.encryptPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

userSchema.methods.comparePassword = async (receivedPassword: string, passwordSaved: string): Promise<boolean> => {
    return await bcrypt.compare(receivedPassword, passwordSaved);
}

userSchema.plugin(mongoosePaginate);

export const User = model<IUserMethods>('User', userSchema);

