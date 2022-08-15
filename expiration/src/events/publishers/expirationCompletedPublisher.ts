import {ExpirationCompleteEvent, Publisher, Subjects} from '@yticketing/common'

class ExpirationCompletedPublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted
}

export default ExpirationCompletedPublisher