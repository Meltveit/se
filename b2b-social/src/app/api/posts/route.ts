// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/config';
import { createPost, getPosts, getPostBySlug } from '@/lib/db/posts';
import { getCompanyById } from '@/lib/db/companies';

// POST - Create a new post
export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse the request body
    const formData = await request.formData();
    const postData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      excerpt: formData.get('excerpt') as string,
      category: formData.get('category') as string,
      tags: formData.get('tags') as string,
      status: formData.get('status') as 'draft' | 'published',
    };

    const companyId = formData.get('companyId') as string;
    
    // Get featured image if provided
    const featuredImage = formData.get('featuredImage') as File || undefined;

    // Basic validation
    if (!postData.title || !postData.content || !postData.category || !companyId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user is a member of the company
    const company = await getCompanyById(companyId);
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    if (!company.members.includes(currentUser.uid)) {
      return NextResponse.json(
        { error: 'You do not have permission to create posts for this company' },
        { status: 403 }
      );
    }

    // Check if a post with the same slug already exists
    const slug = postData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    const existingPost = await getPostBySlug(slug);
    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with a similar title already exists' },
        { status: 400 }
      );
    }

    // Create the post
    const postId = await createPost(postData, companyId, currentUser.uid, featuredImage);

    return NextResponse.json({ id: postId, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// GET - List posts with optional filters
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category') || undefined;
    const companyId = url.searchParams.get('companyId') || undefined;
    const query = url.searchParams.get('query') || undefined;
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');

    // We're not implementing pagination with cursors in this simplified version
    const { posts } = await getPosts(category, companyId, query, undefined, pageSize);

    return NextResponse.json({ 
      posts,
      page,
      pageSize,
      totalPages: Math.ceil(posts.length / pageSize)
    });
  } catch (error) {
    console.error('Error listing posts:', error);
    return NextResponse.json(
      { error: 'Failed to list posts' },
      { status: 500 }
    );
  }
}