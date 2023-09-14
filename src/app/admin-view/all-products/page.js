import CommonListing from "@/Components/CommonListing";
import { getAllProducts } from "@/services/product";

export default async function AdminAllProducts(){

    const allProducts = await getAllProducts();

    //console.log(allProducts);

    return (
        <CommonListing data={allProducts && allProducts.data} />
    )
}
