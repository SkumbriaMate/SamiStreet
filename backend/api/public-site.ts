import { NextResponse } from 'next/server';
import { tryGetSupabaseAnon } from '@/lib/supabaseServer';

/** Public site copy + menu rows. Never 500 for missing Supabase. */
export async function handlePublicSiteGet(): Promise<Response> {
  const supabaseAnon = tryGetSupabaseAnon();
  if (!supabaseAnon) {
    return NextResponse.json({ siteData: {}, products: [] });
  }
  try {
    const [siteRes, prodRes] = await Promise.all([
      supabaseAnon.from('site_settings').select('data').eq('id', 1).maybeSingle(),
      supabaseAnon
        .from('products')
        .select(
          'id,product_type,name,description,image_url,emoji,tags,sort_order,is_active,product_sizes(id,label,price,sort_order)',
        )
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
    ]);
    if (siteRes.error || prodRes.error) {
      console.error('[api/site]', siteRes.error ?? prodRes.error);
      return NextResponse.json({ siteData: {}, products: [] });
    }
    return NextResponse.json({
      siteData: siteRes.data?.data ?? {},
      products: prodRes.data ?? [],
    });
  } catch (e) {
    console.error('[api/site]', e);
    return NextResponse.json({ siteData: {}, products: [] });
  }
}
