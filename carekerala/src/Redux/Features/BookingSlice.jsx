/* eslint-disable react-refresh/only-export-components */
import { createSlice } from '@reduxjs/toolkit'

export const BookingSlice = createSlice({
    name: 'booking',
    initialState: {
        hospital: null,
    },
    reducers: {
        addHospital: (state, action) => {
            state.hospital = action.payload
        },
    }
})

export const {addHospital} = BookingSlice.actions
export default BookingSlice.reducer