import Footer from "../components/Footer";
import ReservationForm from "../components/form/ReservationForm";
import Navbar from "../components/navbar/Navbar";
export const dynamic = "force-dynamic";

export default function ReserverPage() {
  return (
    <>
      <Navbar />
      <ReservationForm />
      <Footer />
    </>
  );
}
