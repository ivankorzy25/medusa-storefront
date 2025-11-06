import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('product_id');
    const tipoCambio = searchParams.get('tipo_cambio') || 'oficial';
    const incluirIva = searchParams.get('incluir_iva') || 'true';

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'product_id is required' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://192.168.1.100:9000';
    const url = `${backendUrl}/exchange-rates/calculate-price?product_id=${productId}&tipo_cambio=${tipoCambio}&incluir_iva=${incluirIva}`;

    console.log('[API Route] Calculating price from:', url);

    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[API Route] Calculate price fetch failed:', response.status, response.statusText);
      return NextResponse.json(
        { success: false, error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[API Route] Price calculated successfully for product:', productId);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[API Route] Error calculating price:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to calculate price' },
      { status: 500 }
    );
  }
}
