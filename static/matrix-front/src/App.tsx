import { Bounce, ToastContainer } from "react-toastify";
import "./App.css";
import { MatrixSolver } from "./components/MatrixSolver";

function App() {
    return (
        <>
            <MatrixSolver></MatrixSolver>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
        </>
    );
}

export default App;
