import {OrderCancelledEvent, Publisher, Subjects} from '@yticketing/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}

export default OrderCancelledPublisher