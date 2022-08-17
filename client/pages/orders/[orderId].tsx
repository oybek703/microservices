import React, {useEffect, useState} from 'react'
import {NextPage} from 'next'
import buildClient from '../../api/buildClient'
import {IOrder} from '../index'
import StripeCheckout  from 'react-stripe-checkout'
import {ICurrentUser} from '../_app'
import useRequest from '../../hooks/useRequest'
import {useRouter} from 'next/router'

export interface IOrderProps {
    order: IOrder,
    currentUser: ICurrentUser
}

const OrderDetails: NextPage<IOrderProps> = ({order, currentUser}) => {
    const {push} = useRouter()
    const [timeLeft, setTimeLeft] = useState(0)
    const {makeRequest, errors} = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: (payment: IOrder) => console.log(payment)
    })
    useEffect(() => {
        const findTimeLeft = () => {
            // @ts-ignore
            const msLeft = new Date(order.expiresAt) - new Date()
            setTimeLeft(Math.round(msLeft / 1000))
        }

        findTimeLeft()
        const timerId = setInterval(findTimeLeft, 1000)

        return () => {
            clearInterval(timerId)
        }
    }, [order])
    if (timeLeft < 0) {
        return <div>Order Expired</div>
    }
    return (
        <div>
            <br/>
            <div className="card">
                <div className="card-header">
                    <h2>Order details</h2>
                </div>
                <div className="card-body">
                    <h5 className="card-title">
                        <span className='fw-semibold'>
                            Time left to pay: &nbsp; {timeLeft}s
                        </span>
                    </h5>
                </div>
                {errors}
                <StripeCheckout
                    token={token => makeRequest({token})}
                    amount={order.ticket.price * 100}
                    stripeKey={'pk_test_51KZ8QwKUMbKWjip6v99eeuAtKgwQ2eIWks9V2VFhYXfmBK4GoJaIJjggm1nacvmcM4cV9rcHskEhc6KvfTPCkPxj00BnqUWy3D'}
                    email={currentUser.email}/>
            </div>
        </div>
    )
}

OrderDetails.getInitialProps = async function (context) {
    const {orderId} = context.query
    const client = await buildClient({req: context.req})
    const {data} = await client.get(`/api/orders/${orderId}`)
    const {data: currentUser} = await client.get('/api/users/currentUser')
    return {order: data, currentUser}
}

export default OrderDetails