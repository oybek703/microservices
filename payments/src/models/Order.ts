import {model, Schema, Document, Types, Model} from 'mongoose'
import {OrderStatus} from '@yticketing/common'
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'

interface OrderAttrs {
    id: string
    userId: string
    status: OrderStatus
    version: number
    price: number
}

interface OrderDoc extends Document {
    userId: string
    status: OrderStatus
    version: number
    price: number
}

interface OrderModel extends Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc
    findByEvent(event: { id: string, version: number }): Promise<OrderDoc | null>
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

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.findByEvent = function(event: {id: string, version: number}) {
    return Order.findOne({_id: event.id, version: event.version})
}

orderSchema.statics.build = function (attrs: OrderAttrs) {
    return new Order({
        _id: attrs.id,
        price: attrs.price,
        version: attrs.version,
        userId: attrs.userId,
        status: attrs.status
    })
}

const Order = model<OrderDoc, OrderModel>('Order', orderSchema)

export default Order