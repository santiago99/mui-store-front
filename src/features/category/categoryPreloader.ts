import { store } from "@/app/store";
import { apiSlice } from "@/app/apiSlice";

export async function categoryPreloader(args: any) {
  const { params } = args;
  const categoryId = parseInt(params.categoryId, 10);
  
  if (isNaN(categoryId)) {
    throw new Response("Category ID must be a number", { status: 400 });
  }

  // Preload category data
  const categoryPromise = store.dispatch(
    apiSlice.endpoints.getCategory.initiate(categoryId)
  );

  // Wait for the query to complete
  await categoryPromise;

  return null;
}
