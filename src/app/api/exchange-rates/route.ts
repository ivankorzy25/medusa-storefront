import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://192.168.1.100:9000';

    console.log('[API Route] Fetching exchange rates from:', `${backendUrl}/exchange-rates`);

    const response = await fetch(`${backendUrl}/exchange-rates`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[API Route] Exchange rates fetch failed:', response.status, response.statusText);
      return NextResponse.json(
        { success: false, error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[API Route] Exchange rates fetched successfully');

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[API Route] Error fetching exchange rates:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch exchange rates' },
      { status: 500 }
    );
  }
}
