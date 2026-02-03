import { useNavigate, useParams } from "react-router-dom";
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import { useState, useEffect } from "react";
import { allBlogs, BlogPost } from "@/lib/blogData";

const BlogDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    // Find blog by slug
    const foundBlog = allBlogs.find(b => b.slug === slug);
    if (foundBlog) {
      setBlog(foundBlog);
    }
  }, [slug]);

  if (!blog) {
    return (
      <div className="min-h-screen bg-white">
        <LandingNavbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog not found</h1>
          <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
        </div>
        <LandingFooter />
      </div>
    );
  }

  // Format content with proper HTML styling
  const formatContent = (content: string) => {
    return content
      .split('\n\n')
      .map(paragraph => {
        // Remove ** from start and end, treat as heading
        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
          const headingText = paragraph.replace(/\*\*/g, '').trim();
          return `<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6 pb-3 border-b-2 border-blue-600">${headingText}</h2>`;
        } 
        // Bullet list
        else if (paragraph.startsWith('- ')) {
          const items = paragraph.split('\n').map(item => 
            `<li class="ml-6 mb-2 text-gray-700">${item.substring(2)}</li>`
          ).join('');
          return `<ul class="list-disc list-inside space-y-2 my-6 pl-4">${items}</ul>`;
        } 
        // Regular paragraph
        else {
          return `<p class="text-gray-700 text-lg leading-relaxed mb-6">${paragraph}</p>`;
        }
      })
      .join('');
  };

  const relatedBlogs = allBlogs.filter(b => b.id !== blog.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      {/* Back Button */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/blog")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={blog.image} 
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="max-w-4xl">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
                {blog.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {blog.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-8 border-b mb-8">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>8 min read</span>
              </div>
            </div>

            {/* Content */}
            <div 
              className="max-w-none"
              dangerouslySetInnerHTML={{ __html: formatContent(blog.content) }}
            />

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share this article</h3>
              <div className="flex gap-4">
                <Button variant="outline" size="sm">
                  Facebook
                </Button>
                <Button variant="outline" size="sm">
                  Twitter
                </Button>
                <Button variant="outline" size="sm">
                  LinkedIn
                </Button>
                <Button variant="outline" size="sm">
                  WhatsApp
                </Button>
              </div>
            </div>

            {/* Related Articles */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <div 
                    key={relatedBlog.id}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/blog/${relatedBlog.slug}`)}
                  >
                    <img 
                      src={relatedBlog.image}
                      alt={relatedBlog.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <span className="text-xs font-semibold text-blue-600 mb-2 block">{relatedBlog.category}</span>
                      <h4 className="font-bold text-lg mb-2 hover:text-blue-600 line-clamp-2">
                        {relatedBlog.title}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {relatedBlog.excerpt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>

      <LandingFooter />
    </div>
  );
};

export default BlogDetail;
