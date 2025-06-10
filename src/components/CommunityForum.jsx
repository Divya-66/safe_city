import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Flag, Send, User, Clock } from 'lucide-react';

// Mock data for forum posts
const MOCK_POSTS = [
  {
    id: 1,
    author: 'JohnDoe',
    title: 'Safety Concerns in Downtown Area',
    content: 'Has anyone else noticed increased suspicious activity around Main Street after dark? We should organize a community watch program.',
    timestamp: '2023-05-15T18:30:00',
    likes: 15,
    comments: [
      {
        id: 1,
        author: 'SafetyCaptain',
        content: 'I agree, I\'ve noticed this too. I\'ve already contacted our local police department about this.',
        timestamp: '2023-05-15T19:15:00',
        likes: 8
      },
      {
        id: 2,
        author: 'ConcernedCitizen',
        content: 'Count me in for the community watch program. We need to take action.',
        timestamp: '2023-05-15T20:00:00',
        likes: 5
      }
    ]
  },
  {
    id: 2,
    author: 'SafetyFirst',
    title: 'New Street Lights Installation',
    content: 'Great news! The city council approved the installation of new LED street lights in our neighborhood. This should help improve visibility and safety.',
    timestamp: '2023-05-14T14:20:00',
    likes: 32,
    comments: [
      {
        id: 3,
        author: 'GreenEnergy',
        content: 'This is excellent! LED lights are also energy-efficient.',
        timestamp: '2023-05-14T15:45:00',
        likes: 12
      }
    ]
  }
];

const CommunityForum = () => {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newComment, setNewComment] = useState('');
  const [activePost, setActivePost] = useState(null);
  const [filter, setFilter] = useState('recent');

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    const post = {
      id: posts.length + 1,
      author: 'CurrentUser',
      title: newPost.title,
      content: newPost.content,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '' });
  };

  const handleCreateComment = (postId) => {
    if (!newComment) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: post.comments.length + 1,
              author: 'CurrentUser',
              content: newComment,
              timestamp: new Date().toISOString(),
              likes: 0
            }
          ]
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    setNewComment('');
  };

  const handleLike = (postId, commentId = null) => {
    const updatedPosts = posts.map(post => {
      if (commentId === null && post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      } else if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => 
            comment.id === commentId 
              ? { ...comment, likes: comment.likes + 1 }
              : comment
          )
        };
      }
      return post;
    });

    setPosts(updatedPosts);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (filter === 'recent') {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
    return b.likes - a.likes;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
          <MessageSquare size={24} />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">
          Community Forum
        </h1>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <input
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            placeholder="Post Title"
            className="input-field w-full"
          />
          <textarea
            placeholder="Write your post..."
            className="input-field w-full h-32 resize-none"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
          <div className="flex justify-end">
            <button type="submit" className="btn-primary">
              <Send className="w-4 h-4 mr-2" />
              Post
            </button>
          </div>
        </form>
      </div>

      {/* Filter */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-100">Community Posts</h3>
          <select
            className="input-field"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {sortedPosts.map((post) => (
          <div key={post.id} className="bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-700 rounded-full">
                <User size={20} className="text-gray-300" />
              </div>
              <div>
                <p className="font-medium text-gray-100">{post.author}</p>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <Clock size={14} />
                  {formatDate(post.timestamp)}
                </p>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">{post.title}</h3>
            <p className="text-gray-200 mb-4">{post.content}</p>
            
            {/* Post Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likes}</span>
              </button>
              <button
                onClick={() => setActivePost(activePost === post.id ? null : post.id)}
                className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{post.comments.length}</span>
              </button>
            </div>

            {/* Comments Section */}
            {activePost === post.id && (
              <div className="mt-4 space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gray-600 rounded-full">
                        <User size={16} className="text-gray-300" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-100">{comment.author}</p>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Clock size={12} />
                          {formatDate(comment.timestamp)}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-200">{comment.content}</p>
                    <button
                      onClick={() => handleLike(post.id, comment.id)}
                      className="mt-2 flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span className="text-sm">{comment.likes}</span>
                    </button>
                  </div>
                ))}

                {/* Add Comment */}
                <div className="flex items-center space-x-2 mt-4">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="input-field flex-1"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    onClick={() => handleCreateComment(post.id)}
                    className="btn-primary"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityForum; 