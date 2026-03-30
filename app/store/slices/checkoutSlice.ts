// Purpose: Redux slice to manage checkout state (shipping method, billing/shipping forms, payment method)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FormData {
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  city: string;
  address1: string;
  address2: string;
  postalCode: string;
  phone: string;
  email: string;
  isCompany: boolean;
  companyName: string;
  companyICO: string;
  companyDIC: string;
  companyICDPH: string;
}

export interface CheckoutState {
  orderId: string;
  orderDate: string;
  shippingForm: FormData;
  billingForm: FormData;
  shippingMethodId: string;
  paymentMethodId: string;
  differentBilling: boolean;
  promoCode: string | null;
  discountPercentage: number;
}

const initialForm: FormData = {
  firstName: "",
  lastName: "",
  country: "",
  state: "",
  city: "",
  address1: "",
  address2: "",
  postalCode: "",
  phone: "",
  email: "",
  isCompany: false,
  companyName: "",
  companyICO: "",
  companyDIC: "",
  companyICDPH: "",
};

const initialState: CheckoutState = {
  orderId: "",
  orderDate: "",
  shippingForm: initialForm,
  billingForm: initialForm,
  shippingMethodId: "",
  paymentMethodId: "",
  differentBilling: false,
  promoCode: null,
  discountPercentage: 0,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setOrderInfo(state, action: PayloadAction<{ id: string; date: string }>) {
      state.orderId = action.payload.id;
      state.orderDate = action.payload.date;
    },
    setShippingForm(state, action: PayloadAction<Partial<FormData>>) {
      state.shippingForm = { 
        ...state.shippingForm, 
        ...action.payload,
        isCompany: action.payload.isCompany ?? state.shippingForm.isCompany ?? false
      };
    },
    setBillingForm(state, action: PayloadAction<Partial<FormData>>) {
      state.billingForm = { 
        ...state.billingForm, 
        ...action.payload,
        isCompany: action.payload.isCompany ?? state.billingForm.isCompany ?? false
      };
    },
    setShippingMethod(state, action: PayloadAction<string>) {
      state.shippingMethodId = action.payload;
    },
    setPaymentMethod(state, action: PayloadAction<string>) {
      state.paymentMethodId = action.payload;
    },
    setDifferentBilling(state, action: PayloadAction<boolean>) {
      state.differentBilling = action.payload;
    },
    applyPromoCode(state, action: PayloadAction<string>) {
      const code = action.payload.trim().toUpperCase();
      if (code === "FINDIGO" || code === "FINGO") {
        state.promoCode = code;
        state.discountPercentage = 10;
      } else {
        state.promoCode = null;
        state.discountPercentage = 0;
      }
    },
    removePromoCode(state) {
      state.promoCode = null;
      state.discountPercentage = 0;
    },
  },
});

export const {
  setOrderInfo,
  setShippingForm,
  setBillingForm,
  setShippingMethod,
  setPaymentMethod,
  setDifferentBilling,
  applyPromoCode,
  removePromoCode,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
