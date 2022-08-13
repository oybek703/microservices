import {OrderCreatedEvent, Publisher, Subjects} from '@yticketing/common'

class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}

export default OrderCreatedPublisher