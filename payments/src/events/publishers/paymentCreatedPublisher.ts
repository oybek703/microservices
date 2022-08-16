import {PaymentCreatedEvent, Publisher, Subjects} from '@yticketing/common'

class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}

export default PaymentCreatedPublisher