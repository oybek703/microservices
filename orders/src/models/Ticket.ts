import {model, Schema, Document, Model} from 'mongoose'
import Order from './Order'
import {OrderStatus} from '@yticketing/common'
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'

interface TicketAttrs {
    id: string
    title: string
    price: number
}

export interface TicketDoc extends Document {
    title: string
    price: number
    version: number
    isReserved(): Promise<boolean>
}

interface TicketModel extends Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
    findByEvent(event: {id: string, version: number}): Promise<TicketDoc | null>
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

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.findByEvent = async function(event: {id: string, version: number}) {
    return Ticket.findOne({_id: event.id, version: event.version - 1})
}

ticketSchema.statics.build = function (attrs: TicketAttrs) {
    return new Ticket({
        _id: attrs.id,
        price: attrs.price,
        title: attrs.title
    })
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