import {model, Schema, Document, Model} from 'mongoose'
import Order from './Order'
import {OrderStatus} from '@yticketing/common'

interface TicketAttrs {
    title: string
    price: number
}

export interface TicketDoc extends Document {
    title: string
    price: number

    isReserved(): Promise<boolean>
}

interface TicketModel extends Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
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

ticketSchema.statics.build = function (attrs: TicketAttrs) {
    return new Ticket(attrs)
}

ticketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    })
    return Boolean(existingOrder)
}

const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export default Ticket