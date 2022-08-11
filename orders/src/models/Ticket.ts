import {model, Schema, Document} from 'mongoose'
import Order from './Order'
import {OrderStatus} from '@yticketing/common'

export interface ITicket extends Document {
    title: string
    price: number
    isReserved(): Promise<boolean>
}

const ticketSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
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


ticketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete,
            ]
        }
    })
    return Boolean(existingOrder)
}

const Ticket = model<ITicket>('Ticket', ticketSchema)

export default Ticket