import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Cart from "@/models/cart";
import Order from "@/models/order";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectToDB();
    const isAuthUser = await AuthUser(req);

    if (isAuthUser) {
      const data = await req.json();
      const { user } = data;

      const saveNewOrder = await Order.create(data);
      //console.log(user)

      if (saveNewOrder) {
        await Cart.deleteMany({ userID: user });
        //console.log("after delete cart items")
        // Access the _id of the newly created orde

        const orderId = saveNewOrder._id;

        // console.log(orderId)

        return NextResponse.json({
          success: true,
          message: "Products are on the way !",
          orderId: orderId,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to create a order ! Please try again",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "You are not authticated",
      });
    }
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Something went worng in payment gateway",
    });
  }
}
