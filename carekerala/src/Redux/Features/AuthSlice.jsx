/* eslint-disable react-refresh/only-export-components */
import { createSlice } from '@reduxjs/toolkit'

export const AuthSlice = createSlice({
    name: 'auth',
    initialState: {
        UserAuthStatus: false,
        HospitalAuthStatus: false,
        authDetails: null
    },
    reducers: {
        addHospitalAuth: (state, action) => {
            state.HospitalAuthStatus = action.payload
        },
        addUserAuth: (state, action) => {
            state.UserAuthStatus = action.payload
        },
        addAuthDetails: (state, action) => {
            state.authDetails = action.payload
        }
    }
})

export const {addHospitalAuth,addUserAuth, addAuthDetails} = AuthSlice.actions
export default AuthSlice.reducer