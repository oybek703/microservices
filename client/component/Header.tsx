import React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'

const Header = ({currentUser}) => {
    const {pathname} = useRouter()
    const links = [
        !currentUser && {label: 'Sign Up', href: '/auth/signUp'},
        !currentUser && {label: 'Sign In', href: '/auth/signIn'},
        currentUser && {label: 'Sell ticket', href: '/tickets/newTicket'},
        currentUser && {label: 'My Orders', href: '/orders'},
        currentUser && {label: 'Sign Out', href: '/auth/signOut'}
    ].filter(Boolean).map(({label, href}) => <li className='nav-item mx-2'
                                                 key={label}>
        <Link href={href}>
            <a className={`nav-link btn px-2 py-1 ${href === pathname ? 'btn-info' : 'btn-light'}`}>
                {label}
            </a>
        </Link>
    </li>)
    return (
        <nav className="navbar navbar-light bg-secondary justify-content-between px-5">
            <Link href='/'>
                <a className="navbar-brand text-uppercase rounded-2 text-white">Ticketing</a>
            </Link>
            <ul className="navbar-nav mr-auto d-flex flex-row">
                {links}
            </ul>
        </nav>
    )
}

export default Header