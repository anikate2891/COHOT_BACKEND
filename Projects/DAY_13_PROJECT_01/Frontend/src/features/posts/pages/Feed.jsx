import '../styles/feed.scss'
import Post from '../Components/post'
import { usePost } from '../hook/usePost'
import { useEffect } from 'react'

const Feed = () => {
  const { feed, fetchFeed } = usePost()

  useEffect(() => {
    console.log("Feed mounted")
    fetchFeed()
    }, [])

  return (
    <div className="feedPage">
    <div className="posts">
      {feed && feed.map((post) => (
        <Post key={post._id} post={post} user={post.user} />
      ))}
    </div>
    </div>
  )
}

export default Feed