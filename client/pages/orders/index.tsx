import React from 'react'
import {NextPage} from 'next'
import {IOrder} from '../index'
import buildClient from '../../api/buildClient'

interface IOrderProps {
    orders: IOrder[]
}

const Orders: NextPage<IOrderProps> = ({orders}) => {
    return (
        <div>
            <br/>
            <h1>My Orders</h1>
            <hr/>
            <ul className="list-group">
                {orders.map(order => <li key={order.id}
                                         className="list-group-item d-flex justify-content-between align-items-center list-group-item-action list-group-item-secondary">
                    {order.ticket.title}
                    <span className="badge text-black badge-pill">{order.ticket.price}$</span>
                </li>)}
            </ul>
        </div>
    )
}

Orders.getInitialProps = async function ({req}) {
    const client = await buildClient({req})
    const {data: orders} = await client.get('/api/orders')
    return {orders}
}

export default Orders