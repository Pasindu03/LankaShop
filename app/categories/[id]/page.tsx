import Navbar from "@/components/navbar";
import ProductPage from "@/components/product-page";
import { getCategoryById } from "@/lib/services/categoryService";
import { getSubcategoriesByCategoryId } from "@/lib/services/subCategoryService";
import { getProductsByCategory } from "@/lib/services/filteredProductService";

interface Props {
  params: { id: string };
}

export default async function CategoryPage({ params }: Props) {
  const categoryId = params.id;

  // 1) Fetch category metadata
  const category = await getCategoryById(categoryId);
  if (!category) {
    return <p className="p-8 text-center">Category not found</p>;
  }

  // 2) Fetch sub-categories
  const subcategories = await getSubcategoriesByCategoryId(categoryId);

  // 3) Fetch products
  const products = await getProductsByCategory(categoryId);

  return (
    <main>
      <Navbar />
      <ProductPage
        title={category.name}
        description={category.description}
        products={products}
        heroImage={category.heroImage}
        categories={subcategories}
      />
    </main>
  );
}
