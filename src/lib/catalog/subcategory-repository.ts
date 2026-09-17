import { fetchSubcategoriesByCategoryFromSupabase } from "@/lib/supabase/queries";

import type { CategoryId, Subcategory } from "./types";

export async function listSubcategoriesByCategoryAsync(
  categoryId: CategoryId,
): Promise<Subcategory[]> {
  return fetchSubcategoriesByCategoryFromSupabase(categoryId);
}
