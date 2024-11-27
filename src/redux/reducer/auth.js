import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "userData",
  initialState: {
    userData: {},
    nav: {},
    QRCode: "",
    compInfo: "",
    Kit_Id: "",
    locationItem: {},
    is_New_Registration: false,
    addItemFromProduct: "",
    AdminUserId: "",
    distributerLinkemail: {},
  },
  reducers: {
    saveUserData: (state, action) => {
      // console.log("auth reducer slice ", state, "--", action);
      state.userData = action.payload;
      console.log(action.payload, "payload of saveUserData");
    },
    NewLocation: (state, action) => {
      console.log("nav reducer slice ", state, "--", action);
      state.nav = action.payload;
    },
    addQRCode: (state, action) => {
      console.log("set qr code action reducer slice ", state, "--", action);
      state.QRCode = action.payload;
    },
    addKitId: (state, action) => {
      console.log("set Kit_Id", state, "--", action);
      state.Kit_Id = action.payload;
    },
    addCompInfoVal: (state, action) => {
      console.log("set qr code action reducer slice ", state, "--", action);
      state.compInfo = action.payload;
    },
    addLocationItem: (state, action) => {
      console.log("set qr code action reducer slice ", state, "--", action);
      state.locationItem = action.payload;
    },
    addNewKitLocation: (state, action) => {
      state.is_New_Registration = action.payload;
    },
    addItemFromProductFound: (state, action) => {
      state.addItemFromProduct = action.payload;
    },
    addAdminUserId: (state, action) => {
      state.AdminUserId = action.payload;
    },
    addDistributerId: (state, action) => {
      state.distributerLinkemail = action.payload;
    },
  },
});

export const {
  saveUserData,
  NewLocation,
  addQRCode,
  addCompInfoVal,
  addKitId,
  addLocationItem,
  addNewKitLocation,
  addItemFromProductFound,
  addAdminUserId,
  addDistributerId,
} = authSlice.actions;

export default authSlice.reducer;
