import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getPost, deletePost } from '../../services/posts'
import { useAuth } from '../../contexts/AuthContext'

function PostDetails() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const data = await getPost(id)
      setPost(data)
    } catch (err) {
      setError('Failed to fetch post')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id)
        navigate('/posts')
      } catch (error) {
        console.error('Failed to delete post:', error)
      }
    }
  }

  if (loading) return <div className="text-center py-10">Loading post...</div>

  if (error) return <div className="text-center py-10 text-red-600">{error}</div>

  if (!post) return <div className="text-center py-10">Post not found</div>

  const isAuthor = currentUser && currentUser.id === post.user_id

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Link to="/posts" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        &larr; Back to Posts
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6 mt-4">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

        {/* Display image if available */}
        {post.image_url && (
          <div className="mb-6">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-auto max-h-96 object-cover rounded-lg mb-4"
            />
          </div>
        )}

        <div className="prose max-w-none">
          <p className="whitespace-pre-line">{post.body}</p>
        </div>

        {isAuthor && (
          <div className="mt-8 flex space-x-4">
            <Link
              to={`/posts/${post.id}/edit`}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Edit Post
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete Post
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostDetails