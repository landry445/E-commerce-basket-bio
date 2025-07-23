"use client";
// import Navbar from "./components/layout/navbar/Navbar";
// import SidebarAdmin from "./components/sidebarAdmin/SidebarAdmin";
import FormPanier from "./components/form/FormPanier";

export default function Home() {
  return (
    <>
      {/* <Navbar /> */}
      {/* <SidebarAdmin
      // userName="Adri"
      // activePage="panier"
      // onNavigate={() => {
      // Navigation ou setState ici, ex :
      // router.push(`/admin/${}`)
      /> */}
      <FormPanier
        onSubmit={(values) => {
          // handle form submission here
          console.log("Form submitted:", values);
        }}
      />
    </>
  );
}
