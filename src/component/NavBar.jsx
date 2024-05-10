import { Link, Navigate } from "react-router-dom";
import logo from "../images/LOGO_80P.png";

function NavBar() {
  const onLogout = () => {
    const cookies = document.cookie.split("; ");
    const token = cookies.find((v) => v.includes("token"))?.split("=");
    if (token) {
      document.cookie = `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
      return <Navigate to="/login" />;
    }
  };

  const UserButton = () => {
      if (document.cookie.includes("token")) {
        console.log('token')
      return (
        <button
          onClick={onLogout}
          className="flex items-center justify-center bg-[#F41B3B] h-6 w-14 rounded text-white font-semibold text-xs"
        >
          Logout
        </button>
      );
    }
    return (
      <Link
        to={"/login"}
        className="flex items-center justify-center bg-[#F41B3B] h-6 w-14 rounded text-white font-semibold text-xs"
      >
        Login
      </Link>
    );
  };
  return (
    <div className=" bg-black">
      <nav className="flex justify-between px-5 py-3 gap-2 items-center border-[#363536]">
        <div className=" self-stretch flex gap-10">
          <Link to="/">
            <img className="h-8 sm:h-10" src={logo} alt="" />
          </Link>
          <div className="gap-6 items-center justify-center sm:flex hidden self-stretch">
            <Link
              to={"/"}
              className="flex items-center justify-center gap-2 font-semibold text-base text-white"
            >
              <div>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.332 18.3011V8.1706L10.9987 3.69633L3.66536 8.1706V18.3011H7.33203V15.7377C7.33203 14.7488 7.71834 13.8005 8.40597 13.1012C9.09361 12.402 10.0262 12.0091 10.9987 12.0091C11.9712 12.0091 12.9038 12.402 13.5914 13.1012C14.2791 13.8005 14.6654 14.7488 14.6654 15.7377V18.3011H18.332ZM12.832 20.1654V15.7377C12.832 15.2433 12.6389 14.7691 12.2951 14.4195C11.9512 14.0698 11.4849 13.8734 10.9987 13.8734C10.5125 13.8734 10.0462 14.0698 9.70234 14.4195C9.35852 14.7691 9.16536 15.2433 9.16536 15.7377V20.1654H3.66536C3.17913 20.1654 2.71282 19.969 2.369 19.6193C2.02519 19.2697 1.83203 18.7955 1.83203 18.3011V8.1706C1.83203 7.84866 1.91401 7.53221 2.06999 7.25206C2.22597 6.97191 2.45064 6.73761 2.72211 6.57198L10.0554 2.09771C10.3404 1.92386 10.6664 1.83203 10.9987 1.83203C11.331 1.83203 11.657 1.92386 11.9419 2.09771L19.2753 6.57198C19.5468 6.73761 19.7714 6.97191 19.9274 7.25206C20.0834 7.53221 20.1654 7.84866 20.1654 8.1706V18.3011C20.1654 18.7955 19.9722 19.2697 19.6284 19.6193C19.2846 19.969 18.8183 20.1654 18.332 20.1654H12.832Z"
                    fill="white"
                  />
                </svg>
              </div>
              <span>All</span>
            </Link>
            <Link
              to={"/movie"}
              className="flex items-center justify-center gap-2 font-semibold text-base text-[#807E81]"
            >
              <div>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.48203 2.4987C2.93895 2.4987 2.4987 2.93895 2.4987 3.48203V16.5154C2.4987 17.0584 2.93895 17.4987 3.48203 17.4987H16.5154C17.0584 17.4987 17.4987 17.0584 17.4987 16.5154V3.48203C17.4987 2.93895 17.0584 2.4987 16.5154 2.4987H3.48203ZM0.832031 3.48203C0.832031 2.01848 2.01848 0.832031 3.48203 0.832031H16.5154C17.9789 0.832031 19.1654 2.01848 19.1654 3.48203V16.5154C19.1654 17.9789 17.9789 19.1654 16.5154 19.1654H3.48203C2.01848 19.1654 0.832031 17.9789 0.832031 16.5154V3.48203Z"
                    fill="#807E81"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.83333 0.832031C6.29357 0.832031 6.66667 1.20513 6.66667 1.66536V18.332C6.66667 18.7923 6.29357 19.1654 5.83333 19.1654C5.3731 19.1654 5 18.7923 5 18.332V1.66536C5 1.20513 5.3731 0.832031 5.83333 0.832031Z"
                    fill="#807E81"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.1654 0.832031C14.6256 0.832031 14.9987 1.20513 14.9987 1.66536V18.332C14.9987 18.7923 14.6256 19.1654 14.1654 19.1654C13.7051 19.1654 13.332 18.7923 13.332 18.332V1.66536C13.332 1.20513 13.7051 0.832031 14.1654 0.832031Z"
                    fill="#807E81"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.832031 9.9974C0.832031 9.53716 1.20513 9.16406 1.66536 9.16406H18.332C18.7923 9.16406 19.1654 9.53716 19.1654 9.9974C19.1654 10.4576 18.7923 10.8307 18.332 10.8307H1.66536C1.20513 10.8307 0.832031 10.4576 0.832031 9.9974Z"
                    fill="#807E81"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.832031 5.83333C0.832031 5.3731 1.20513 5 1.66536 5H5.83203C6.29227 5 6.66536 5.3731 6.66536 5.83333C6.66536 6.29357 6.29227 6.66667 5.83203 6.66667H1.66536C1.20513 6.66667 0.832031 6.29357 0.832031 5.83333Z"
                    fill="#807E81"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.832031 14.1654C0.832031 13.7051 1.20513 13.332 1.66536 13.332H5.83203C6.29227 13.332 6.66536 13.7051 6.66536 14.1654C6.66536 14.6256 6.29227 14.9987 5.83203 14.9987H1.66536C1.20513 14.9987 0.832031 14.6256 0.832031 14.1654Z"
                    fill="#807E81"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.332 14.1654C13.332 13.7051 13.7051 13.332 14.1654 13.332H18.332C18.7923 13.332 19.1654 13.7051 19.1654 14.1654C19.1654 14.6256 18.7923 14.9987 18.332 14.9987H14.1654C13.7051 14.9987 13.332 14.6256 13.332 14.1654Z"
                    fill="#807E81"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.332 5.83333C13.332 5.3731 13.7051 5 14.1654 5H18.332C18.7923 5 19.1654 5.3731 19.1654 5.83333C19.1654 6.29357 18.7923 6.66667 18.332 6.66667H14.1654C13.7051 6.66667 13.332 6.29357 13.332 5.83333Z"
                    fill="#807E81"
                  />
                </svg>
              </div>
              <span>Movies</span>
            </Link>
            <Link
              to={"/family"}
              className="flex items-center justify-center gap-2 font-semibold text-base text-[#807E81]"
            >
              <div>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_118_134)">
                    <path
                      d="M12.0058 3.28966C12.8965 2.95886 13.8442 3.61754 13.8442 4.56785L13.8436 7.16369C15.6028 7.74165 17.4755 7.95778 19.3476 7.7815C20.238 7.69748 20.9503 8.47366 20.826 9.33059L20.7927 9.49202L18.9416 16.4005C18.5771 17.7603 17.6642 18.9021 16.429 19.5582L16.1595 19.6913L15.2073 20.1267C12.6201 21.3102 9.57408 20.5611 7.82656 18.3502L7.63783 18.0985L7.35027 17.6954C5.93743 17.7107 4.52038 17.2409 3.36516 16.286L2.55823 15.6189C1.39572 14.6579 0.722656 13.2283 0.722656 11.72V4.56785C0.722656 3.61754 1.67021 2.9589 2.56113 3.28968C5.60758 4.42142 8.95931 4.42142 12.0058 3.28966ZM13.8438 8.73053L13.8442 11.72C13.8442 12.3238 13.7364 12.9151 13.5324 13.4687C14.582 13.929 15.3635 14.8458 15.6567 15.9592C15.7619 16.3588 15.5233 16.768 15.1236 16.8733C14.7331 16.9761 14.3334 16.7505 14.2172 16.3672L14.2095 16.3403C14.0211 15.6246 13.5006 15.0452 12.8063 14.7866C12.576 15.0917 12.3086 15.3709 12.0087 15.6188L11.2017 16.286C10.543 16.8305 9.79911 17.2173 9.01945 17.4464L8.85734 17.2312C10.0973 18.9748 12.3563 19.6388 14.3292 18.8738L14.5849 18.7659L15.5371 18.3304C16.4224 17.9255 17.0997 17.1779 17.4182 16.2658L17.4961 16.0132L19.298 9.28795L19.1669 9.29815C17.3603 9.42936 15.5582 9.23272 13.8438 8.73053ZM12.3478 4.75763L12.2205 4.80256C8.98852 5.92436 5.46914 5.91229 2.24348 4.76642L2.21913 4.75763V11.72C2.21913 12.7628 2.676 13.7521 3.46742 14.4283L3.51173 14.4655L4.31865 15.1326C6.03927 16.5549 8.52762 16.5549 10.2482 15.1327L11.0552 14.4655C11.8738 13.7888 12.3478 12.7821 12.3478 11.72V4.75763ZM10.2787 11.0892C10.6375 11.2942 10.7621 11.7513 10.557 12.1101C9.89057 13.2761 8.65115 14.0118 7.28346 14.0118C5.91579 14.0118 4.6764 13.2761 4.00982 12.1102C3.80472 11.7514 3.92928 11.2943 4.28803 11.0892C4.63823 10.889 5.08216 11.0029 5.29389 11.3422L5.30897 11.3674C5.71185 12.0721 6.45849 12.5153 7.28346 12.5153C8.10842 12.5153 8.85503 12.0721 9.25778 11.3675C9.46284 11.0087 9.91992 10.8841 10.2787 11.0892Z"
                      fill="#807E81"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_118_134">
                      <rect width="22" height="22" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <span>Family Drama</span>
            </Link>
          </div>
        </div>
        <div className="flex gap-4">
          <button>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_116_251)">
                <path
                  d="M8.046 1C9.91407 1.00212 11.705 1.74514 13.0259 3.06606C14.3469 4.38699 15.0899 6.17793 15.092 8.046C15.0939 9.69034 14.5181 11.2831 13.465 12.546L16.809 15.89C16.931 16.012 16.9995 16.1775 16.9995 16.35C16.9995 16.5225 16.931 16.688 16.809 16.81C16.687 16.932 16.5215 17.0005 16.349 17.0005C16.1765 17.0005 16.011 16.932 15.889 16.81L12.545 13.465C11.2824 14.5178 9.69 15.0937 8.046 15.092C6.17793 15.0899 4.38699 14.3469 3.06606 13.0259C1.74514 11.705 1.00212 9.91407 1 8.046C1.00212 6.17793 1.74514 4.38699 3.06606 3.06606C4.38699 1.74514 6.17793 1.00212 8.046 1ZM8.046 2.3C6.52273 2.30185 5.06239 2.90786 3.98536 3.98507C2.90834 5.06228 2.30259 6.52273 2.301 8.046C2.30285 9.5691 2.90872 11.0293 3.98572 12.1063C5.06271 13.1833 6.5229 13.7891 8.046 13.791C9.5691 13.7891 11.0293 13.1833 12.1063 12.1063C13.1833 11.0293 13.7891 9.5691 13.791 8.046C13.7891 6.5229 13.1833 5.06271 12.1063 3.98572C11.0293 2.90872 9.5691 2.30285 8.046 2.301V2.3Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </g>
              <defs>
                <clipPath id="clip0_116_251">
                  <rect width="18" height="18" fill="black" />
                </clipPath>
              </defs>
            </svg>
          </button>
          <UserButton />
          <Link
            to={"/upload"}
            className="flex items-center justify-center bg-blue-500 h-6 w-14 rounded text-white font-semibold text-xs"
          >
            Upload
          </Link>
        </div>
      </nav>
      <div className="sm:hidden py-1 text-white">
        <div className="flex gap-6 items-center justify-center">
          <Link
            to={"/"}
            className="flex items-center justify-center gap-2 font-semibold text-base"
          >
            <div>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.332 18.3011V8.1706L10.9987 3.69633L3.66536 8.1706V18.3011H7.33203V15.7377C7.33203 14.7488 7.71834 13.8005 8.40597 13.1012C9.09361 12.402 10.0262 12.0091 10.9987 12.0091C11.9712 12.0091 12.9038 12.402 13.5914 13.1012C14.2791 13.8005 14.6654 14.7488 14.6654 15.7377V18.3011H18.332ZM12.832 20.1654V15.7377C12.832 15.2433 12.6389 14.7691 12.2951 14.4195C11.9512 14.0698 11.4849 13.8734 10.9987 13.8734C10.5125 13.8734 10.0462 14.0698 9.70234 14.4195C9.35852 14.7691 9.16536 15.2433 9.16536 15.7377V20.1654H3.66536C3.17913 20.1654 2.71282 19.969 2.369 19.6193C2.02519 19.2697 1.83203 18.7955 1.83203 18.3011V8.1706C1.83203 7.84866 1.91401 7.53221 2.06999 7.25206C2.22597 6.97191 2.45064 6.73761 2.72211 6.57198L10.0554 2.09771C10.3404 1.92386 10.6664 1.83203 10.9987 1.83203C11.331 1.83203 11.657 1.92386 11.9419 2.09771L19.2753 6.57198C19.5468 6.73761 19.7714 6.97191 19.9274 7.25206C20.0834 7.53221 20.1654 7.84866 20.1654 8.1706V18.3011C20.1654 18.7955 19.9722 19.2697 19.6284 19.6193C19.2846 19.969 18.8183 20.1654 18.332 20.1654H12.832Z"
                  fill="white"
                />
              </svg>
            </div>
            <span>All</span>
          </Link>
          <Link
            to={"/movie"}
            className="flex items-center justify-center gap-2 font-semibold text-base text-[#807E81]"
          >
            <div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.48203 2.4987C2.93895 2.4987 2.4987 2.93895 2.4987 3.48203V16.5154C2.4987 17.0584 2.93895 17.4987 3.48203 17.4987H16.5154C17.0584 17.4987 17.4987 17.0584 17.4987 16.5154V3.48203C17.4987 2.93895 17.0584 2.4987 16.5154 2.4987H3.48203ZM0.832031 3.48203C0.832031 2.01848 2.01848 0.832031 3.48203 0.832031H16.5154C17.9789 0.832031 19.1654 2.01848 19.1654 3.48203V16.5154C19.1654 17.9789 17.9789 19.1654 16.5154 19.1654H3.48203C2.01848 19.1654 0.832031 17.9789 0.832031 16.5154V3.48203Z"
                  fill="#807E81"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.83333 0.832031C6.29357 0.832031 6.66667 1.20513 6.66667 1.66536V18.332C6.66667 18.7923 6.29357 19.1654 5.83333 19.1654C5.3731 19.1654 5 18.7923 5 18.332V1.66536C5 1.20513 5.3731 0.832031 5.83333 0.832031Z"
                  fill="#807E81"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.1654 0.832031C14.6256 0.832031 14.9987 1.20513 14.9987 1.66536V18.332C14.9987 18.7923 14.6256 19.1654 14.1654 19.1654C13.7051 19.1654 13.332 18.7923 13.332 18.332V1.66536C13.332 1.20513 13.7051 0.832031 14.1654 0.832031Z"
                  fill="#807E81"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.832031 9.9974C0.832031 9.53716 1.20513 9.16406 1.66536 9.16406H18.332C18.7923 9.16406 19.1654 9.53716 19.1654 9.9974C19.1654 10.4576 18.7923 10.8307 18.332 10.8307H1.66536C1.20513 10.8307 0.832031 10.4576 0.832031 9.9974Z"
                  fill="#807E81"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.832031 5.83333C0.832031 5.3731 1.20513 5 1.66536 5H5.83203C6.29227 5 6.66536 5.3731 6.66536 5.83333C6.66536 6.29357 6.29227 6.66667 5.83203 6.66667H1.66536C1.20513 6.66667 0.832031 6.29357 0.832031 5.83333Z"
                  fill="#807E81"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.832031 14.1654C0.832031 13.7051 1.20513 13.332 1.66536 13.332H5.83203C6.29227 13.332 6.66536 13.7051 6.66536 14.1654C6.66536 14.6256 6.29227 14.9987 5.83203 14.9987H1.66536C1.20513 14.9987 0.832031 14.6256 0.832031 14.1654Z"
                  fill="#807E81"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.332 14.1654C13.332 13.7051 13.7051 13.332 14.1654 13.332H18.332C18.7923 13.332 19.1654 13.7051 19.1654 14.1654C19.1654 14.6256 18.7923 14.9987 18.332 14.9987H14.1654C13.7051 14.9987 13.332 14.6256 13.332 14.1654Z"
                  fill="#807E81"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.332 5.83333C13.332 5.3731 13.7051 5 14.1654 5H18.332C18.7923 5 19.1654 5.3731 19.1654 5.83333C19.1654 6.29357 18.7923 6.66667 18.332 6.66667H14.1654C13.7051 6.66667 13.332 6.29357 13.332 5.83333Z"
                  fill="#807E81"
                />
              </svg>
            </div>
            <span>Movies</span>
          </Link>
          <Link
            to={"/family"}
            className="flex items-center justify-center gap-2 font-semibold text-base text-[#807E81]"
          >
            <div>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_118_134)">
                  <path
                    d="M12.0058 3.28966C12.8965 2.95886 13.8442 3.61754 13.8442 4.56785L13.8436 7.16369C15.6028 7.74165 17.4755 7.95778 19.3476 7.7815C20.238 7.69748 20.9503 8.47366 20.826 9.33059L20.7927 9.49202L18.9416 16.4005C18.5771 17.7603 17.6642 18.9021 16.429 19.5582L16.1595 19.6913L15.2073 20.1267C12.6201 21.3102 9.57408 20.5611 7.82656 18.3502L7.63783 18.0985L7.35027 17.6954C5.93743 17.7107 4.52038 17.2409 3.36516 16.286L2.55823 15.6189C1.39572 14.6579 0.722656 13.2283 0.722656 11.72V4.56785C0.722656 3.61754 1.67021 2.9589 2.56113 3.28968C5.60758 4.42142 8.95931 4.42142 12.0058 3.28966ZM13.8438 8.73053L13.8442 11.72C13.8442 12.3238 13.7364 12.9151 13.5324 13.4687C14.582 13.929 15.3635 14.8458 15.6567 15.9592C15.7619 16.3588 15.5233 16.768 15.1236 16.8733C14.7331 16.9761 14.3334 16.7505 14.2172 16.3672L14.2095 16.3403C14.0211 15.6246 13.5006 15.0452 12.8063 14.7866C12.576 15.0917 12.3086 15.3709 12.0087 15.6188L11.2017 16.286C10.543 16.8305 9.79911 17.2173 9.01945 17.4464L8.85734 17.2312C10.0973 18.9748 12.3563 19.6388 14.3292 18.8738L14.5849 18.7659L15.5371 18.3304C16.4224 17.9255 17.0997 17.1779 17.4182 16.2658L17.4961 16.0132L19.298 9.28795L19.1669 9.29815C17.3603 9.42936 15.5582 9.23272 13.8438 8.73053ZM12.3478 4.75763L12.2205 4.80256C8.98852 5.92436 5.46914 5.91229 2.24348 4.76642L2.21913 4.75763V11.72C2.21913 12.7628 2.676 13.7521 3.46742 14.4283L3.51173 14.4655L4.31865 15.1326C6.03927 16.5549 8.52762 16.5549 10.2482 15.1327L11.0552 14.4655C11.8738 13.7888 12.3478 12.7821 12.3478 11.72V4.75763ZM10.2787 11.0892C10.6375 11.2942 10.7621 11.7513 10.557 12.1101C9.89057 13.2761 8.65115 14.0118 7.28346 14.0118C5.91579 14.0118 4.6764 13.2761 4.00982 12.1102C3.80472 11.7514 3.92928 11.2943 4.28803 11.0892C4.63823 10.889 5.08216 11.0029 5.29389 11.3422L5.30897 11.3674C5.71185 12.0721 6.45849 12.5153 7.28346 12.5153C8.10842 12.5153 8.85503 12.0721 9.25778 11.3675C9.46284 11.0087 9.91992 10.8841 10.2787 11.0892Z"
                    fill="#807E81"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_118_134">
                    <rect width="22" height="22" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <span>Family Drama</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
