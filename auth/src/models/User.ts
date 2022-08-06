import {model, Schema, Document} from 'mongoose'
import Password from '../services/password'

export interface IUser extends Document {
    email: string
    password: string
}

const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password
            ret.id = ret._id
            delete ret._id
            delete ret.__v
        }
    }
})

userSchema.pre('save', async function (done) {
    if(this.isModified('password')) {
        const hashedPassword = await Password.toHash(this.get('password'))
        this.set('password', hashedPassword)
    }
    done()
})

const User = model<IUser>('User', userSchema)

export default User