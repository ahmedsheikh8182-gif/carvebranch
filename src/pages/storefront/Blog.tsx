import { Layout } from "@/components/layout/Layout";
import { SEOMeta } from "@/components/SEOMeta";
import { PageTransition } from "@/components/PageTransition";
import { useListBlogPosts } from "@workspace/api-client-react";
import { Link } from "wouter";

export default function Blog() {
  const { data: postsRes, isLoading } = useListBlogPosts();
  const posts = postsRes?.data || postsRes || [];

  return (
    <Layout>
      <SEOMeta
        title="The Journal"
        description="Musings on craft, architecture, and the pursuit of quiet luxury from the Carve atelier."
        url="/blog"
      />
      <div className="w-full max-w-[1400px] mx-auto pt-32 pb-24 px-6 md:px-12">
        <PageTransition className="text-center mb-24 max-w-2xl mx-auto">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">Editorial</span>
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.15] pb-2 mb-8">The Journal</h1>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            Musings on craft, architecture, and the pursuit of quiet luxury.
          </p>
        </PageTransition>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
            {[1, 2].map(i => (
              <div key={i} className="flex flex-col gap-6">
                <div className="aspect-[4/3] bg-secondary" />
                <div className="h-8 w-2/3 bg-secondary" />
                <div className="h-4 w-1/3 bg-secondary" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-24 gap-x-12">
            {posts.map((post: any, idx: number) => {
              const date = new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });

              return (
                <PageTransition key={post.id} delay={(idx % 2) * 100} className="group flex flex-col">
                  <Link href={`/blog/${post.slug}`} className="block relative aspect-[4/3] bg-secondary overflow-hidden mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F5F3EF] via-[#EDE9E3] to-[#E2DDD6] flex flex-col items-center justify-center transition-transform duration-1000 ease-out group-hover:scale-105">
                      <span className="font-serif italic text-[3rem] text-[#C9A96E]/25 tracking-[0.3em] select-none">C</span>
                      <span className="font-sans text-[9px] uppercase tracking-[0.35em] text-[#6B6560]/40 mt-3">The Journal</span>
                    </div>
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </Link>
                  
                  <div className="flex flex-col flex-grow">
                    <div className="flex gap-4 items-center mb-4">
                      {post.category && (
                        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-foreground">{post.category}</span>
                      )}
                      <span className="font-sans text-[10px] tracking-[0.1em] text-muted-foreground">{date}</span>
                    </div>
                    
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="font-serif text-3xl md:text-4xl mb-4 group-hover:text-muted-foreground transition-colors">{post.title}</h2>
                    </Link>
                    
                    {post.excerpt && (
                      <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-8 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    
                    <div className="mt-auto">
                      <Link href={`/blog/${post.slug}`} className="font-sans text-[11px] uppercase tracking-[0.2em] border-b border-border hover:border-foreground pb-1 transition-colors">
                        Read Story
                      </Link>
                    </div>
                  </div>
                </PageTransition>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
