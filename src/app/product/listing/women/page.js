import CommonListing from "@/Components/CommonListing";
import { productByCategory } from "@/services/product";

export default async function WomenAllProducts() {
  const getAllProducts = await productByCategory("women");

  return <CommonListing data={getAllProducts && getAllProducts.data} />;
}