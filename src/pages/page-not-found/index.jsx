import { useParams } from "react-router-dom";

function PageNotFound() {
    let url = useParams()

    return (
        <div className="flex items-center justify-center h-screen grow bg-black text-white">
            <div className="text-center">
                <h2 className="sm:text-4xl text-3xl font-bold mb-4">404 - Page Not Found</h2>
                <p>The {url['*']} page you are looking for does not exist.</p>
            </div>
        </div>
    )
}

export default PageNotFound;