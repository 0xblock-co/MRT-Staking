import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from "react-redux";
import rootReducer from "./mrtSlice";

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
})


export const useAppSelector = useSelector;
export const useAppDispatch = () => useDispatch();

