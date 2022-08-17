import React, {Fragment} from 'react'
import {NextPage} from 'next'
import buildClient from '../api/buildClient'
import Link from 'next/link'

interface LandingPageProps {
    tickets: object[]
}

export interface ITicket {
    id: string
    title: string
    price: number
}

export interface IOrder {
    id: string
    userId: string
    status: string
    expiresAt: Date
    ticket: any
}


const LandingPage: NextPage<LandingPageProps> = ({tickets}) => {
    return (
        <Fragment>
            <br/>
            <div className='d-flex justify-content-between align-items-center'>
                <h1 className='font-monospace'>Tickets </h1>
                <Link href='/tickets/newTicket'>
                    <a className='btn btn-success font-monospace'>Add new ticket</a>
                </Link>
            </div>
            <table className='table table-secondary'>
                <thead className=''>
                <tr>
                    <th className='text-center'>#</th>
                    <th className='text-center'>Title</th>
                    <th className='text-center'>Price</th>
                    <th className='text-center'>Action</th>
                </tr>
                </thead>
                <tbody>
                {tickets.map((ticket: ITicket, index) => <tr key={ticket.id}>
                    <td className='text-center'>{index + 1}</td>
                    <td className='text-center'>{ticket.title}</td>
                    <td className='text-center'>{ticket.price}</td>
                    <td className='text-center'>
                        <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
                            <a>View</a>
                        </Link>
                    </td>
                </tr>)}
                </tbody>
            </table>
        </Fragment>
    )
}

LandingPage.getInitialProps = async function ({req}) {
    const client = await buildClient({req})
    const {data} = await client.get('/api/tickets')
    return {tickets: data}
}

export default LandingPage