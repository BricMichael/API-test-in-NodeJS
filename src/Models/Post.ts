import { Schema, model } from 'mongoose';


export interface IPost {
    mediaUrl: string
    description: string
    userId: Schema.Types.ObjectId
    _id: Schema.Types.ObjectId
    protocol: string
}


const postSchema = new Schema<IPost>({
    mediaUrl: { required: true, type: String },
    description: { required: true, type: String },
    protocol: { required: true, type: String },
    userId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
    { timestamps: true, versionKey: false }
);


export const Post = model<IPost>('Post', postSchema);
