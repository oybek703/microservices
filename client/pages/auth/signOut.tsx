import React, {useEffect} from 'react'
import useRequest from '../../hooks/useRequest'
import {useRouter} from 'next/router'

const SignOut = () => {
    const {push} = useRouter()
    const {makeRequest} = useRequest({
        url: '/api/users/signOut',
        body: {},
        method: 'post',
        onSuccess: push.bind(null, '/')
    })
    useEffect(() => {
        (async function () {
            await makeRequest()
        })()
    }, [])
    return (
        <div>
            Signing you out...
        </div>
    )
}

export default SignOut