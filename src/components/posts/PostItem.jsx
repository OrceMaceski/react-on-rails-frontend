import { Link } from 'react-router-dom'
import { deletePost } from '../../services/posts'
import { useAuth } from '../../contexts/AuthContext'

function PostItem({ post, onPostDeleted }) {
  const { currentUser } = useAuth()

  const isAuthor = currentUser && currentUser.id === post.user_id

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post.id)
        onPostDeleted()
      } catch (error) {
        console.error('Failed to delete post:', error)
      }
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-2">
        <Link to={`/posts/${post.id}`} className="text-blue-600 hover:text-blue-800">
          {post.title}
        </Link>
      </h2>
      <p className="text-gray-700 mb-4 line-clamp-3">{post.body}</p>

      <div className="flex justify-between items-center">
        <Link
          to={`/posts/${post.id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          Read More
        </Link>

        {isAuthor && (
          <div className="space-x-2">
            <Link
              to={`/posts/${post.id}/edit`}
              className="text-yellow-600 hover:text-yellow-800"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostItem