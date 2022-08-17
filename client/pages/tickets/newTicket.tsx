import React, {FormEvent, useState} from 'react'
import useRequest from '../../hooks/useRequest'
import {useRouter} from 'next/router'

const NewTicket = () => {
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState<string>('')
    const [price, setPrice] = useState<string>('')
    const {push} = useRouter()
    const {makeRequest, errors} = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {title, price},
        onSuccess: push.bind(null, '/')
    })
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        await makeRequest()
        setLoading(false)
    }

    function handleBlur() {
        const parsedPrice = parseFloat(price)
        if(isNaN(parsedPrice)) return
        setPrice(parsedPrice.toFixed(2))
    }
    return (
        <form onSubmit={handleSubmit}>
            <h1 className='text-center'>Add new ticket</h1>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Title</label>
                <input value={title} onChange={({target: {value}}) => setTitle(value)}
                       type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Price</label>
                <input onBlur={handleBlur} value={price} onChange={({target: {value}}) => setPrice(value)}
                       type="number" className="form-control" id="exampleInputPassword1"/>
            </div>
            {errors}
            <button disabled={loading} type="submit" className="btn btn-primary">
                Add {loading && <span className='spinner-border spinner-border-sm'/>}
            </button>
        </form>
    )
}

export default NewTicket