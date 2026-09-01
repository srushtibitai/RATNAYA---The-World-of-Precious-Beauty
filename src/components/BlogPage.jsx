import React, { useState } from 'react';
import { BLOG_POSTS } from '../data/marketplaceData';
import { Calendar, User, ArrowRight, BookOpen, ChevronRight } from 'lucide-react';

export function BlogPage() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Jewellery Trends', 'Gold Jewellery', 'Diamond Jewellery', 'Bridal Jewellery', 'Jewellery Care', 'Style Guide'];

  const filteredPosts = selectedCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((p) => p.category === selectedCategory);

  return (
    <div style={{ backgroundColor: '#FAF6F0', paddingBottom: '100px', minHeight: '80vh' }}>
      {/* Banner */}
      <div style={{ backgroundColor: '#111111', color: '#FFFFFF', padding: '60px 0', textAlign: 'center', borderBottom: '1px solid var(--color-border-gold)' }}>
        <div className="container">
          <div style={{ fontSize: '0.78rem', color: '#C5A059', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Home / Ratnaya Editorial & Blog
          </div>
          <h1 style={{ fontSize: '2.8rem', color: '#FFFFFF', fontFamily: "'Marcellus', serif" }}>
            The Journal of Precious Beauty
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#AAA', maxWidth: '540px', margin: '12px auto 0' }}>
            Insights into 22K gold hallmarking, diamond cutting, heritage Nizam Polki, and timeless styling.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '40px' }}>
        {selectedPost ? (
          /* SINGLE BLOG ARTICLE VIEW */
          <div style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '4px', border: '1px solid var(--color-border)', maxWidth: '850px', margin: '0 auto' }}>
            <button onClick={() => setSelectedPost(null)} style={{ color: 'var(--color-gold-dark)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '20px' }}>
              ← Back to Journal Listing
            </button>
            <span className="eyebrow">{selectedPost.category}</span>
            <h1 style={{ fontSize: '2.2rem', margin: '12px 0 16px', lineHeight: 1.25 }}>{selectedPost.title}</h1>
            <div style={{ display: 'flex', gap: '20px', fontSize: '0.82rem', color: '#777', marginBottom: '24px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {selectedPost.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} /> By {selectedPost.author}</span>
            </div>
            <img src={selectedPost.image} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '4px', marginBottom: '28px' }} />
            <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text-main)' }}>
              <p style={{ marginBottom: '20px', fontWeight: '500' }}>{selectedPost.excerpt}</p>
              <p>{selectedPost.content}</p>
            </div>
          </div>
        ) : (
          /* BLOG LISTING VIEW */
          <div>
            {/* Category Filter Chips */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px', justifyContent: 'center' }}>
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: selectedCategory === cat ? '600' : '400',
                    backgroundColor: selectedCategory === cat ? 'var(--color-gold)' : '#FFFFFF',
                    color: selectedCategory === cat ? '#FFFFFF' : 'var(--color-charcoal)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid-3">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  className="product-card"
                >
                  <div style={{ aspectRatio: '16/10', overflow: 'hidden' }}>
                    <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span className="eyebrow">{post.category}</span>
                      <h3 style={{ fontSize: '1.2rem', margin: '8px 0 12px', lineHeight: 1.3 }}>{post.title}</h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{post.excerpt}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', fontSize: '0.78rem', color: 'var(--color-gold-dark)', fontWeight: '600' }}>
                      <span>{post.date}</span>
                      <span>Read Article →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
