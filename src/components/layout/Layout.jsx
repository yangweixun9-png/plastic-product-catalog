import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import QuoteDrawer from "../quote/QuoteDrawer"

export default function Layout() {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <QuoteDrawer />
    </div>
  )
}
