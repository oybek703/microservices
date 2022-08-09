import {model, Schema, Document} from 'mongoose'

export interface ITicket extends Document {
    title: string
    price: number,
    userId: string
}

const ticketSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
        }
    }
})


const Ticket = model<ITicket>('Ticket', ticketSchema)

export default Ticket