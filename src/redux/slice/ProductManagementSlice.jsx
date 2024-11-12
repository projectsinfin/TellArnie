import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import API from "../../services/api";
import { toast } from "react-toastify";
const initialState = {
  ProductManagementData: [],
  status: StatusCode.IDLE,
};
const { PRODUCTMANAGEMENT,DELETEPRODUCTMANAGEMENTDATA } = ApiEndPoint;
export const ProductManagementSlice = createSlice({
  name: "Productmanagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsManagementData.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(fetchProductsManagementData.fulfilled, (state, action) => {
        state.ProductManagementData = action.payload.data.products;
        state.status = StatusCode.IDLE;
      })
      .addCase(fetchProductsManagementData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })
      // DELETE PRODUCT
      .addCase(deletepProductManagementData.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      // .addCase(deleteKitManagementData.fulfilled, (state, action) => {
      //   if (Array.isArray(state.KitManagementData)) {
      //     state.KitManagementData = state.KitManagementData.filter(
      //       (curElm) => !action.payload?.kitIds.includes(curElm._id)
      //     );
      //   }
      //   state.status = StatusCode.IDLE;
      // })
      .addCase(deletepProductManagementData.fulfilled, (state, action) => {

        const {payload} = action;
        console.log(payload,"payload")
        
        state.ProductManagementData = state.ProductManagementData?.filter(
          (curElm) => !action.payload?.productIds.includes(curElm._id)
        );
        state.status = StatusCode.IDLE;
      })
      
      .addCase(deletepProductManagementData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      });
  },
});

export const {} = ProductManagementSlice.actions;
export default ProductManagementSlice.reducer;

export const fetchProductsManagementData = createAsyncThunk(
  "admin/get/products",
  async () => {
    try {
      const res = await API.get(PRODUCTMANAGEMENT);
      if (res.data?.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error("Failed to fetch product management data:", error);
      throw error;
    }
  }
);

export const deletepProductManagementData = createAsyncThunk(
  "admin/delete/product",
  async (data) => {
    try {
      const res = await API.delete(`${DELETEPRODUCTMANAGEMENTDATA}`, {
        data: data,
      });
      if (res.status === 200) {
        toast.success(res?.data?.message);
        return data;
      }
    } catch (error) {
      toast.error(error.data?.message);
      throw error;
    }
  }
);

