import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPosts } from '../../services/posts'
import PostItem from './PostItem'

function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    items: 2,
    pages: 1,
    count: 0
  })

  useEffect(() => {
    fetchPosts(pagination.page)
  }, [pagination.page])

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true)
      // Update api.js to pass the page parameter
      const response = await getPosts(page)

      // Extract data and pagination info based on your API response format
      const { data, pagy } = response

      setPosts(data)
      setPagination({
        page: pagy.page,
        items: pagy.items,
        pages: pagy.pages,
        count: pagy.count
      })
    } catch (err) {
      setError('Failed to fetch posts')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }))
    }
  }

  const renderPaginationControls = () => {
    const { page, pages } = pagination

    // Create an array of page numbers to display
    let pageNumbers = []
    const maxPageButtons = 5

    if (pages <= maxPageButtons) {
      // Show all pages if there are fewer than maxPageButtons
      pageNumbers = Array.from({ length: pages }, (_, i) => i + 1)
    } else {
      // Always include first and last page
      pageNumbers.push(1)

      // Calculate the range of middle pages to show
      const startPage = Math.max(2, page - 1)
      const endPage = Math.min(pages - 1, page + 1)

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('...')
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis before last page if needed
      if (endPage < pages - 1) {
        pageNumbers.push('...')
      }

      // Add last page
      pageNumbers.push(pages)
    }

    return (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {pageNumbers.map((pageNum, index) => (
          pageNum === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-1">...</span>
          ) : (
            <button
              key={`page-${pageNum}`}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-1 rounded border ${
                page === pageNum ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </button>
          )
        ))}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === pages || pages === 0}
          className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    )
  }

  if (loading && posts.length === 0) {
    return <div className="text-center py-10">Loading posts...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>
  }

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link
          to="/posts/new"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Create New Post
        </Link>
      </div>

      {loading && <div className="text-center py-2">Loading...</div>}

      {!loading && posts.length === 0 ? (
        <div className="text-center py-10 text-gray-600">
          No posts found. Create your first post!
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {posts.map(post => (
              <PostItem
                key={post.id}
                post={post}
                onPostDeleted={() => fetchPosts(pagination.page)}
              />
            ))}
          </div>

          {pagination.pages > 1 && renderPaginationControls()}

          <div className="text-center text-sm text-gray-500 mt-4">
            Showing {posts.length} of {pagination.count} posts (Page {pagination.page} of {pagination.pages})
          </div>
        </>
      )}
    </div>
  )
}

export default Posts