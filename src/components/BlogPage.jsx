import React, { useState, useEffect } from 'react';
import { BLOG_POSTS } from '../data/marketplaceData';
import { api } from '../services/api';
import { Calendar, User, ArrowRight, BookOpen, ChevronRight, Loader2 } from 'lucide-react';

export function BlogPage() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [posts, setPosts] = useState(BLOG_POSTS);
  const [loading, setLoading] = useState(false);

  const categories = [
    'All',
    'Jewellery Trends',
    'Gold Jewellery',
    'Diamond Jewellery',
    'Bridal Jewellery',
    'Jewellery Care',
    'Style Guide'
  ];

  // Fetch blogs dynamically from MongoDB Backend API
  useEffect(() => {
    let isMounted = true;
    async function fetchBlogsFromDB() {
      try {
        setLoading(true);
        const data = await api.getBlogs(selectedCategory);
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          setPosts(data);
        } else if (isMounted) {
          // Fallback to local filtering if database array is empty
          const filtered = selectedCategory === 'All'
            ? BLOG_POSTS
            : BLOG_POSTS.filter((p) => p.category === selectedCategory);
          setPosts(filtered);
        }
      } catch (err) {
        console.warn('MongoDB API fetch fallback to local blog posts:', err);
        if (isMounted) {
          const filtered = selectedCategory === 'All'
            ? BLOG_POSTS
            : BLOG_POSTS.filter((p) => p.category === selectedCategory);
          setPosts(filtered);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchBlogsFromDB();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  return (
    <div className="bg-[#FAF6F0] pb-24 min-h-[80vh]">
      {/* Banner Header */}
      <div className="bg-[#111111] text-white py-12 sm:py-16 text-center border-b border-gold/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-xs text-gold tracking-widest uppercase mb-2">
            Home / Ratnaya Editorial & Blog
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl text-white" style={{ color: '#FFFFFF' }}>
            The Journal of Precious Beauty
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-3 font-light">
            Insights into 22K gold hallmarking, diamond cutting, heritage Nizam Polki, and timeless styling.
          </p>
        </div>
      </div>

      {/* Main Content Area with Generous Top Margin Spacing */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-16">
        {selectedPost ? (
          /* SINGLE BLOG ARTICLE VIEW */
          <div className="bg-white p-6 sm:p-10 rounded-sm border border-gray-200 max-w-3xl mx-auto shadow-sm animate-fadeIn">
            <button
              onClick={() => setSelectedPost(null)}
              className="text-xs text-gold-dark font-semibold mb-4 bg-transparent border-none cursor-pointer hover:underline flex items-center gap-1"
            >
              ← Back to Journal Listing
            </button>
            <span className="eyebrow block text-gold-dark text-xs font-semibold tracking-widest uppercase mb-2">
              {selectedPost.category}
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl my-3 text-charcoal leading-snug">
              {selectedPost.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-6 border-b border-gray-100 pb-4">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {selectedPost.date}
              </span>
              <span className="flex items-center gap-1">
                <User size={14} /> By {selectedPost.author || 'Ratnaya Editorial Team'}
              </span>
              {selectedPost.readTime && (
                <span className="text-gold-dark font-medium">{selectedPost.readTime}</span>
              )}
            </div>
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full aspect-video object-cover rounded-sm mb-6 border border-gray-100"
            />
            <div className="text-sm sm:text-base leading-relaxed text-charcoal space-y-4">
              <p className="font-medium text-gray-800 text-lg leading-relaxed">{selectedPost.excerpt}</p>
              <p className="text-gray-600 font-light leading-relaxed">{selectedPost.content}</p>
            </div>
          </div>
        ) : (
          /* BLOG LISTING VIEW */
          <div>
            {/* Category Filter Chips with generous spacing */}
            <div className="flex gap-2.5 flex-wrap mb-10 justify-center">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-2 px-5 rounded-full text-xs font-sans transition-all duration-200 border cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-gold text-white font-semibold border-gold shadow-sm scale-105'
                      : 'bg-white text-charcoal hover:bg-gray-100 border-gray-200 hover:border-gold/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <Loader2 size={32} className="animate-spin text-gold mb-3" />
                <p className="text-xs uppercase tracking-widest font-medium">Fetching Articles from MongoDB...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white p-12 text-center border border-gray-200 rounded-sm my-6">
                <BookOpen size={36} className="mx-auto text-gold mb-3" />
                <h3 className="font-heading text-xl mb-2">No Articles Found</h3>
                <p className="text-xs text-gray-500">There are no articles available for this category right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {posts.map((post) => (
                  <div
                    key={post._id || post.id || post.slug}
                    onClick={() => setSelectedPost(post)}
                    className="bg-white border border-gray-200 rounded-sm overflow-hidden cursor-pointer flex flex-col justify-between hover:shadow-medium transition-all group duration-300"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-[#FAF8F5] relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm text-white text-[0.65rem] uppercase tracking-wider px-2.5 py-1 rounded font-medium">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-[0.7rem] text-gray-400 mb-2">
                          <Calendar size={12} />
                          <span>{post.date}</span>
                        </div>
                        <h3 className="font-heading text-lg text-charcoal my-1 group-hover:text-gold leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed font-light">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gold-dark font-semibold">
                        <span>READ FULL STORY</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
