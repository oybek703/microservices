import React, { useEffect, useState } from 'react'
import axios from 'axios'

const CommentList = ({ postId }) => {
    const [comments, setComments] = useState([])

    async function fetchComments () {
        const { data } = await axios.get(
            `http://localhost:4001/posts/${postId}/comments`)
        setComments(Object.values(data))
    }

    useEffect(() => {
        fetchComments()
    // eslint-disable-next-line
    }, [])
    return (
        <div className='card-body'>
            <h3>Comments</h3>
            <ul className='mt-2'>
                {
                    !comments.length
                        ? <i>No comments yet...</i>
                        : comments.map(({ id, content }) => <li key={id}>
                            {content}
                        </li>)
                }
            </ul>
        </div>
    )
}

export default CommentList
