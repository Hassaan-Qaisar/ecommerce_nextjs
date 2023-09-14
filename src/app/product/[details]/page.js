import CommonDetails from "@/Components/CommonDetails/CommonDetails"
import { productById } from "@/services/product"

export default async function ProductDetails({params}){

    const productDetailsData = await productById(params.details)

    //console.log(productDetailsData)

    return <CommonDetails item={productDetailsData && productDetailsData.data} />
}
