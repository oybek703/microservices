import {model, Schema, Document, Types} from 'mongoose'
import {OrderStatus} from '@yticketing/common'

export interface IOrder extends Document {
    userId: string
    status: OrderStatus,
    expiresAt: Date,
    ticket: Types.ObjectId
}

const orderSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: Date,
        required: true
    },
    ticket: {
        type: Types.ObjectId,
        ref: 'Ticket'
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


const Order = model<IOrder>('Order', orderSchema)

export default Order