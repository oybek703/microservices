import React from 'react'
import {NextPage} from 'next'
import buildClient from '../api/buildClient'
import {TCurrentUser} from './_app'

interface LandingPageProps {
    currentUser: TCurrentUser
}

const LandingPage: NextPage<LandingPageProps> = ({currentUser}) => {
    if(!currentUser) return <h1>You are not logged in.</h1>
    return (
        <h1>
            Welcome {currentUser.email}
        </h1>
    )
}

LandingPage.getInitialProps = async function ({req}) {
    const client = await buildClient({req})
    const {data} = await client.get('/api/users/currentUser')
    return data
}

export default LandingPage