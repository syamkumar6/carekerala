import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./Features/AuthSlice"
import bookingReducer from "./Features/BookingSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer
  }
})

export default store;