import { Outlet } from "react-router-dom"
import { Toaster } from 'react-hot-toast';
import Header from "../Components/Header/Header"
import Footer from "../Components/Footer/Footer"
import Headroom from 'react-headroom';

function RootRoute() {
  return (
    <>
    <Headroom style={{ zIndex: 100 }}>
      <Header/>
    </Headroom>
      <main>
        <Outlet/>
      </main>
      <Footer/>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}

export default RootRoute