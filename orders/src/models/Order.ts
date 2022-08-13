import {model, Schema, Document, Types, Model} from 'mongoose'
import {OrderStatus} from '@yticketing/common'
import {TicketDoc} from './Ticket'
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'

interface OrderAttrs {
    userId: string
    status: OrderStatus
    expiresAt: Date
    ticket: TicketDoc
}

interface OrderDoc extends Document {
    userId: string
    status: OrderStatus
    expiresAt: Date
    ticket: TicketDoc
    version: number
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

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = function (attrs: OrderAttrs) {
    return new Order(attrs)
}

const Order = model<OrderDoc, OrderModel>('Order', orderSchema)

export default Order