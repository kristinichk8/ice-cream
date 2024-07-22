import React, { lazy, Suspense } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Login from "./pages/Login";
import Product from "./pages/Product";
import ShopCart from "./pages/ShopCart";
import PersonalAccount from "./pages/PersonalAccount";
import AdminOrders from "./pages/AdminOrders";
import AdminProduct from "./components/AdminProduct";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminCategories from "./components/AdminCategories";

const FirstPage = lazy(() => import("./pages/FirstPage"));
const Directory = lazy(() => import("./pages/Directory"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Registration = lazy(() => import("./pages/Registration"));

function App() {
  return (
    <div className="App">
      <Router>
        <Menu />
        <Routes>
          <Route path="/"element={<Suspense fallback={<div>Загрузка...</div>}><FirstPage /></Suspense>}/>
          <Route path="/directory"element={<Suspense fallback={<div>Загрузка...</div>}><Directory /></Suspense>}/>
          <Route path="/contacts" element={<Suspense fallback={<div>Загрузка...</div>}><Contacts /></Suspense>}/>
          <Route path="/registration" element={<Suspense fallback={<div>Загрузка...</div>}><Registration /></Suspense>}/>
          <Route path="/login" element={<Suspense fallback={<div>Загрузка...</div>}><Login /></Suspense>}/>
          <Route path="/product/:id" element={<Suspense fallback={<div>Загрузка...</div>}><Product/></Suspense>}/>
          <Route path="/cart" element={<Suspense fallback={<div>Загрузка...</div>}><ShopCart/></Suspense>}/>
          <Route path="/lk" element={<Suspense fallback={<div>Загрузка...</div>}><PersonalAccount /></Suspense>}/>
          <Route path="/admin" element={<Suspense fallback={<div>Загрузка...</div>}><AdminOrders /></Suspense>}/>
          <Route path="/admin/newproduct" element={<Suspense fallback={<div>Загрузка...</div>}><AdminProduct /></Suspense>}/>
          <Route path="/admin/editproduct/:id" element={<Suspense fallback={<div>Загрузка...</div>}><AdminEditProduct/></Suspense>}/>
          <Route path="/admin/categories" element={<Suspense fallback={<div>Загрузка...</div>}><AdminCategories/></Suspense>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
