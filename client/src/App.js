import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import "./styles/main.scss";
import Footer from "./components/Footer";
import { useContext, useEffect } from "react";
import { LoaderContext } from "./context/LoaderContext";
import LoaderComponent from "./components/LoaderComponent";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BlogsPage from "./pages/BlogsPage";
import Profile from "./pages/Profile";
import { AuthContext } from "./context/userAuth";
import { getSpecificUserDetails } from "./api/getApi";
function App() {
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const { setUserDetails } = useContext(AuthContext);
  const userData = JSON.parse(localStorage.getItem("user_details"));
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);


  }, [setIsLoading]);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    const fetchUpdatedUserDetails = async () => {
      if (!userData?.id) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await getSpecificUserDetails(userData?.id);
        setUserDetails(res[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUpdatedUserDetails();
  }, [setIsLoading, setUserDetails]);


  return (
    <div className="p-4">
      <Header />
      {isLoading && <LoaderComponent />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/blogs" element={<BlogsPage />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
