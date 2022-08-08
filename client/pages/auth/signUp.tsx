import React, {FormEvent, useState} from 'react'
import useRequest from '../../hooks/useRequest'
import {useRouter} from 'next/router'

const SignUp = () => {
    const {push} = useRouter()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const {makeRequest, errors} = useRequest({
        url: '/api/users/signUp',
        method: 'post',
        body: {email, password},
        onSuccess: push.bind(null, '/')

    })
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        await makeRequest()
    }
    return (
        <form onSubmit={handleSubmit}>
            <h1 className='text-center'>Sign Up</h1>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input value={email} onChange={({target: {value}}) => setEmail(value)}
                       type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input value={password} onChange={({target: {value}}) => setPassword(value)}
                       type="password" className="form-control" id="exampleInputPassword1"/>
            </div>
            {errors}
            <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
    )
}

export default SignUp