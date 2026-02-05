import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    // Get auth token from Authorization header or cookies
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Forward the request to the backend
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const response = await fetch(`${base}/api/v1/media`, {
      method: 'POST',
      body: backendFormData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, ...data }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Media upload proxy error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Get auth token from Authorization header or cookies
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Forward the request to the backend
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const url = `${base}/api/v1/media${type ? `?type=${type}` : ''}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, ...data }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Media list proxy error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch media' },
      { status: 500 }
    );
  }
}
