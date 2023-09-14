import Cookies from "js-cookie";

//add new product
export const addNewProduct = async (formData) => {
  try {
    //console.log("in services")
    const response = await fetch("/api/admin/add-product", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    //console.log("in services after try")

    const data = await response.json();

    return data;
  } catch (error) {
    //console.log(error);
  }
};

// get all products
export const getAllProducts = async () => {
  try {
    const res = await fetch("https://ecommerce-nextjs-beige.vercel.app/api/admin/all-products", {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

// update product
export const updateAProduct = async (formData) => {
  try {
    const res = await fetch("/api/admin/update-product", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// delete product
export const deleteAProduct = async (id) => {
  try {
    const res = await fetch(`/api/admin/delete-product?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

// get product by specific category
export const productByCategory = async (id) => {
  try {
    const res = await fetch(
      `https://ecommerce-nextjs-beige.vercel.app/api/admin/product-by-category?id=${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

// get product by specific id
export const productById = async (id) => {
  try {
    const res = await fetch(
      `https://ecommerce-nextjs-beige.vercel.app/api/admin/product-by-id?id=${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};
