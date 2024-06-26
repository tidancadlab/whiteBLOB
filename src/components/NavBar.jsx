import { useEffect, useState } from 'react';
import { Link, Navigate, useMatch, useSearchParams } from 'react-router-dom';

import { GoHomeFill } from 'react-icons/go';
import { MdMovieCreation } from 'react-icons/md';
import { FaTheaterMasks } from 'react-icons/fa';

import { Button, Input } from './form-field';
import logo from 'asset/image/LOGO_314p.png';
import { twMerge } from 'tailwind-merge';

const navLinks = [
  { id: 1, path: '/', name: 'All', icon: GoHomeFill },
  { id: 2, path: '/movie', name: 'Movies', icon: MdMovieCreation },
  { id: 3, path: '/family', name: 'Show', icon: FaTheaterMasks },
];

const NavLink = ({ value }) => {
  return (
    <Link
      aria-selected={useMatch(value.path)?.pathname === value.path}
      to={value.path}
      className="flex items-center justify-center gap-2 rounded-lg px-4 py-1 font-semibold text-white duration-200 ease-in-out hover:text-white aria-selected:bg-white aria-selected:text-black">
      <value.icon className="text-xl" />
      <span>{value.name}</span>
    </Link>
  );
};

function NavBar({ isButton, position = 'top-4' }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [search, setSearch] = useSearchParams();

  // TODO: implement cookie for auth
  const onLogout = () => {
    const cookies = document.cookie.split('; ');
    const token = cookies.find((v) => v.includes('token'))?.split('=');
    if (token) {
      document.cookie = `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
      return <Navigate to="/login" />;
    }
  };

  const UserButton = () => {
    if (window.localStorage.getItem('token')) {
      return (
        <Button
          onClick={() => {
            window.localStorage.clear('token');
            window.location.reload();
          }}
          className="flex h-6 w-14 items-center justify-center rounded bg-[#F41B3B] text-xs font-semibold text-white">
          Logout
        </Button>
      );
    }
    return (
      <Link to={'/login'} className="flex h-6 w-14 items-center justify-center rounded bg-[#F41B3B] text-xs font-semibold text-white">
        Login
      </Link>
    );
  };

  useEffect(() => {
    window.addEventListener('scroll', (e) => setIsScrolled(window.scrollY >= 64));
  }, []);

  if (isButton) {
    return (
      <div aria-checked={true} className="left-4 top-4 z-10 mt-1 flex w-full justify-start aria-checked:fixed">
        <Button className="bg-green-500 opacity-20 hover:opacity-100" onClick={() => window.history.back()}>
          Back
        </Button>
        ;
      </div>
    );
  }

  return (
    <div className=" h-fit sm:h-16">
      <div aria-checked={isScrolled} className={twMerge('z-10 flex w-full justify-center aria-checked:fixed', position)}>
        <nav
          aria-checked={isScrolled}
          role="checkbox"
          className="flex w-screen flex-wrap items-center justify-between gap-2 rounded-3xl bg-black px-5 py-3 outline-white duration-200 ease-out aria-checked:w-[332px] aria-checked:py-2 aria-checked:outline">
          <div aria-hidden={isScrolled} className="order-1 flex gap-10 self-stretch aria-hidden:hidden">
            <Link to="/">
              <img className="h-8 sm:h-10" src={logo} alt="logo" />
            </Link>
          </div>
          <div className="order-3 flex grow items-center justify-center gap-1 self-stretch sm:order-2">
            {navLinks.map((v) => (
              <NavLink key={v.id} value={v} />
            ))}
          </div>
          <div aria-hidden={isScrolled} className="order-2 flex gap-4 aria-hidden:hidden ">
            <div className="flex gap-2">
              <Input
                type="search"
                labelTitle=" "
                placeholder="Search Videos"
                value={search.get('search') || ''}
                onChange={(e) => setSearch({ search: e.target.value })}
                className={{
                  input: 'h-full pl-3 pr-1',
                  container: 'hidden lg:flex',
                }}
              />
            </div>
            <UserButton />
            <Link to={'/upload'} className="flex h-6 w-14 items-center justify-center rounded bg-blue-500 text-xs font-semibold text-white">
              Upload
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default NavBar;
