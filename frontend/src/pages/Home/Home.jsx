import Navbar from "../../components/layout/Navbar/Navbar";
import Hero from "../../components/Home/Hero/Hero";
import Features from "../../components/Home/Features/Features";
import HowItWorks from "../../components/Home/HowItWorks/HowItWorks";
import DeviceSection from "../../components/Home/DeviceSection/DeviceSection";
import Support from "../../components/Home/Support/Support";
import GetStarted from "../../components/Home/GetStarted/GetStarted";
import Footer from "../../components/layout/Footer/Footer";

const Home = () => {
  return (
    <>
      <Navbar />

      <main className="home-main">
        <Hero />
        <Features />
        <HowItWorks  />
        <DeviceSection />
        <Support />
        <GetStarted />
      </main>

      <Footer />
    </>
  );
};

export default Home;