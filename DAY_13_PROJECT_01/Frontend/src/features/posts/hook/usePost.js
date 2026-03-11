import { getFeed } from '../services/Post.api'
import { useContext } from 'react'
import { PostContext } from '../Post.Context'
import { AuthContext } from '../../auth/auth.Contex'

export const usePost = () => {

    const { post, feed, setFeed } = useContext(PostContext)
    const { user } = useContext(AuthContext)

    const fetchFeed = async () => {
        if (!user) return   // login nahi hai to API call hi nahi hoga

        try {
            const data = await getFeed()
            setFeed(data?.posts || [])
        } catch (err) {
            console.error("Feed fetch error:", err)
        }
    }

    return { post, feed, fetchFeed }
}