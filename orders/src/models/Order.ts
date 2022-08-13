import {model, Schema, Document, Types, Model} from 'mongoose'
import {OrderStatus} from '@yticketing/common'
import {ITicket} from './Ticket'

interface OrderAttrs {
    userId: string
    status: OrderStatus,
    expiresAt: Date,
    ticket: ITicket
}

interface OrderDoc extends Document {
    userId: string
    status: OrderStatus,
    expiresAt: Date,
    ticket: ITicket
}

interface OrderModel extends Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc
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

orderSchema.statics.build = function (attrs: OrderAttrs) {
    return new Order(attrs)
}

const Order = model<OrderDoc, OrderModel>('Order', orderSchema)

export default Order