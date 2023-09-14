import CommonListing from "@/Components/CommonListing";
import { getAllProducts } from "@/services/product";

export default async function AllProducts() {
  const getAllProductss = await getAllProducts();

  return <CommonListing data={getAllProductss && getAllProductss.data} />;
}
