"use client";

import emailjs from "emailjs-com";
import ComponentLevelLoader from "@/Components/Loader/Componentlevel/ComponentLevel";
import { GlobalContext } from "@/Context";
import { getAllOrdersForAllUsers, updateStatusOfOrder } from "@/services/order";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";

export default function AdminView() {
  const {
    allOrdersForAllUsers,
    setAllOrdersForAllUsers,
    user,
    pageLevelLoader,
    setPageLevelLoader,
    componentLevelLoader,
    setComponentLevelLoader,
  } = useContext(GlobalContext);

  const router = useRouter();

  async function extractAllOrdersForAllUsers() {
    setPageLevelLoader(true);
    const res = await getAllOrdersForAllUsers();

    //console.log(res);

    if (res.success) {
      setPageLevelLoader(false);
      //console.log(res.success);
      setAllOrdersForAllUsers(
        //   res.data && res.data.length
        //     ? res.data.filter((item) => item.user._id !== user._id)
        //     : []
        res.data
      );
      //console.log(allOrdersForAllUsers);
    } else {
      setPageLevelLoader(false);
    }
  }

  useEffect(() => {
    //console.log(user);
    if (user !== null) extractAllOrdersForAllUsers();
  }, [user]);

  //console.log(allOrdersForAllUsers);

  async function handleUpdateOrderStatus(getItem) {
    setComponentLevelLoader({ loading: true, id: getItem._id });
    const res = await updateStatusOfOrder({
      ...getItem,
      isProcessing: false,
      isPaid: true,
    });

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      // console.log(getItem)

      // console.log(getItem?.user?.email)
      // console.log(getItem?.user?.name)

      const { shippingAddress, paymentMethod, totalPrice, orderItems } =
        getItem;
      const { address, city } = shippingAddress;
      const orderItemNames = orderItems.map((item) => item.product.name);
      const orderItemQuantities = orderItems.map((item) => item.qty);

      const customerEmail = getItem?.user?.email;
      const customerName = getItem?.user?.name;

      //const orderDetails = `Customer: ${customerName} \n Email: ${customerEmail} \n Order: ${orderItemNames} \n Quantity: ${orderItemQuantities} \n Total Price: ${totalPrice} Payment Method: ${paymentMethod} \n Address: ${address} ${city}`;

      // const orderDetails = `Customer: ${customerName} <br> Email: ${customerEmail} <br> Order: ${orderItemNames} <br> Quantity: ${orderItemQuantities} <br> Total Price: ${totalPrice} Payment Method: ${paymentMethod} <br> Address: ${address} ${city}`;

      // const orderDetails = `Customer: ${customerName} 
      // Email: ${customerEmail} 
      // Order: ${orderItemNames} 
      // Quantity: ${orderItemQuantities} 
      // Total Price: ${totalPrice} 
      // Payment Method: ${paymentMethod} 
      // Address: ${address} ${city}`;

      const orderDetails = `
      Order ID: ${getItem._id} 
      Customer: ${customerName} 
      Email: ${customerEmail} 
      Order: ${orderItemNames} 
      Quantity: ${orderItemQuantities} 
      Total Price: ${totalPrice} 
      Payment Method: ${paymentMethod} 
      Address: ${address} ${city}
    `

      sendOrderConfirmationEmail(customerEmail, customerName, orderDetails);

      extractAllOrdersForAllUsers();
    } else {
      setComponentLevelLoader({ loading: true, id: "" });
    }
  }

  const sendOrderConfirmationEmail = (
    customerEmail,
    customerName,
    orderDetails
  ) => {
    const templateParams = {
      to_email: customerEmail,
      to_name: customerName,
      order_details: orderDetails,
    };

    emailjs
      .send(
        "service_kf4slfu",
        "template_rrrxg1c",
        templateParams,
        "BZ-i6jgs9PBnJVYQj"
      )
      .then((response) => {
        console.log("Email sent:", response);
      })
      .catch((error) => {
        console.error("Email error:", error);
      });
  };

  if (pageLevelLoader) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <PulseLoader
          color={"#000000"}
          loading={pageLevelLoader}
          size={30}
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <section>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <div className="px-4 py-6 sm:px-8 sm:py-10">
            <div className="flow-root">
              {allOrdersForAllUsers && allOrdersForAllUsers.length ? (
                <ul className="flex flex-col gap-4">
                  {allOrdersForAllUsers.map((item) => (
                    <li
                      key={item._id}
                      className="bg-gray-200 shadow p-5 flex flex-col space-y-3 py-6 text-left"
                    >
                      <div className="flex">
                        <h1 className="font-bold text-lg mb-3 flex-1">
                          #order: {item._id}
                        </h1>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center">
                            <p className="mr-3 text-sm font-medium text-gray-900">
                              User Name :
                            </p>
                            <p className="text-sm  font-semibold text-gray-900">
                              {item?.user?.name}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <p className="mr-3 text-sm font-medium text-gray-900">
                              User Email :
                            </p>
                            <p className="text-sm  font-semibold text-gray-900">
                              {item?.user?.email}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <p className="mr-3 text-sm font-medium text-gray-900">
                              Total Paid Amount :
                            </p>
                            <p className="text-sm  font-semibold text-gray-900">
                              ${item?.totalPrice}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {item.orderItems.map((orderItem, index) => (
                          <div key={index} className="shrink-0">
                            <img
                              alt="Order Item"
                              className="h-24 w-24 max-w-full rounded-lg object-cover"
                              src={
                                orderItem &&
                                orderItem.product &&
                                orderItem.product.imageUrl
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-5">
                        <button className="disabled:opacity-50 mt-5 mr-5  inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide">
                          {item.isProcessing
                            ? "Order is Processing"
                            : "Order is delivered"}
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(item)}
                          disabled={!item.isProcessing}
                          className="disabled:opacity-50 mt-5 mr-5  inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide"
                        >
                          {componentLevelLoader &&
                          componentLevelLoader.loading &&
                          componentLevelLoader.id === item._id ? (
                            <ComponentLevelLoader
                              text={"Updating Order Status"}
                              color={"#ffffff"}
                              loading={
                                componentLevelLoader &&
                                componentLevelLoader.loading
                              }
                            />
                          ) : (
                            "Update Order Status"
                          )}
                        </button>
                        <button
                          onClick={() => router.push(`/orders/${item._id}`)}
                          className="disabled:opacity-50 mt-5 mr-5  inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide"
                        >
                          {componentLevelLoader &&
                          componentLevelLoader.loading &&
                          componentLevelLoader.id === item._id ? (
                            <ComponentLevelLoader
                              // text={"Order"}
                              color={"#ffffff"}
                              loading={
                                componentLevelLoader &&
                                componentLevelLoader.loading
                              }
                            />
                          ) : (
                            "View Order Details"
                          )}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
