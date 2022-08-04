import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CommentCreate from './CommentCreate'
import CommentList from './CommentList'

const PostList = () => {
    const [posts, setPosts] = useState([])

    async function fetchPosts () {
        const { data } = await axios.get('http://posts.com/posts')
        setPosts(Object.values(data))
    }

    useEffect(() => {
        fetchPosts()
    }, [])
    return (
        <div className='card-body'>
            <h3>Posts</h3>
            <ul className='mt-2 d-flex flex-wrap'>
                {
                    !posts.length
                        ? <i>No posts yet...</i>
                        : posts.map(({ id, title, comments }) => <div className='card mx-1 card-body' key={id}>
                            {title}
                            <CommentCreate postId={id}/>
                            <CommentList comments={comments}/>
                        </div>)
                }
            </ul>
        </div>
    )
}

export default PostList
