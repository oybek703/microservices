import {model, Schema, Document, Model} from 'mongoose'
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'

interface TicketAttrs {
    title: string
    price: number
    userId: string
}

interface TicketDoc extends Document {
    title: string
    price: number
    userId: string
    version: number
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

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = function(attrs: TicketAttrs) {
    return new Ticket(attrs)
}

const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export default Ticket