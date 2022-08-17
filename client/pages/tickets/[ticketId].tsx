import React, {useState} from 'react'
import {NextPage} from 'next'
import buildClient from '../../api/buildClient'
import {IOrder, ITicket} from '../index'
import {useRouter} from 'next/router'
import useRequest from '../../hooks/useRequest'

interface ITicketDetailsProps {
    ticket: ITicket
}

const TicketDetails: NextPage<ITicketDetailsProps> = ({ticket}) => {
    const [loading, setLoading] = useState(false)
    const {push} = useRouter()
    const {makeRequest, errors} = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order: IOrder) => push('orders/orderId', `/orders/${order.id}`)
        // onSuccess: (order: IOrder) => push('/orders/[orderId]', `/orders/${order.id}`)
    })

    async function handlePurchase() {
        setLoading(true)
        await makeRequest()
        setLoading(false)
    }

    return (
        <div>
            <br/>
            <div className="card">
                <div className="card-header">
                    <h2>Ticket details</h2>
                </div>
                <div className="card-body">
                    <h5 className="card-title">
                        <span className='fw-semibold'>Title: &nbsp;</span>
                        {ticket.title}
                    </h5>
                    <div className="card-text mt-1">
                        <span className='fw-semibold'>Price: &nbsp;</span>
                        {ticket.price}
                    </div>
                    {errors}
                    <button disabled={loading} onClick={handlePurchase} className="btn btn-success">
                        Purchase {loading && <span className='spinner-border spinner-border-sm'/>}
                    </button>
                </div>
            </div>
        </div>
    )
}

TicketDetails.getInitialProps = async function(context) {
    const {ticketId} = context.query
    const client = await buildClient({req: context.req})
    const {data} = await client.get(`/api/tickets/${ticketId}`)
    return {ticket: data}
}

export default TicketDetails