import { handleAdminProductDelete } from '@backend/api/admin-product-delete';

type RouteCtx = { params: Promise<{ id: string }> };

export async function DELETE(req: Request, ctx: RouteCtx) {
  const { id } = await ctx.params;
  return handleAdminProductDelete(req, id);
}
