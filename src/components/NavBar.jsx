import { useEffect, useRef, useState } from 'react';
import { Link, useMatch, useSearchParams } from 'react-router-dom';

import { GoHomeFill } from 'react-icons/go';
import { MdMovieCreation } from 'react-icons/md';
import { FaTheaterMasks } from 'react-icons/fa';

import { Button, Input } from './form-field';
import logo from 'asset/image/LOGO_314p.png';
import { twMerge } from 'tailwind-merge';
import { FaVideo } from 'react-icons/fa6';

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
      className={twMerge(
        'flex items-center justify-center gap-2 rounded-lg px-4 py-1 font-semibold text-white duration-200 ease-in-out hover:text-white aria-selected:bg-white aria-selected:text-black',
        value.className,
      )}>
      <value.icon className="text-xl" />
      <span>{value.name}</span>
    </Link>
  );
};

function NavBar({ isButton, position = 'top-4' }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useSearchParams();

  const profileCard = useRef();

  const UserButton = () => {
    if (window.localStorage.getItem('token')) {
      return (
        <>
          <Button className="bg-emerald-500" onClick={() => setShowProfile((pre) => !pre)}>
            Profile
          </Button>
          <div
            onBlur={(e) => {
              if (e.relatedTarget) {
                return;
              }
              setShowProfile(false);
            }}
            onClick={() => document.getElementById('profile').focus()}
            tabIndex={0}
            id="profile"
            aria-busy={!showProfile}
            ref={profileCard}
            className="absolute right-4 top-14 z-50 flex w-[156px] flex-col gap-4 rounded-xl bg-gray-900 shadow-lg shadow-black aria-busy:hidden">
            <div className="rounded-t bg-gray-800 px-4 py-4 text-center text-white">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border bg-gray-900 text-xl">P</div>
              <p>Praveen Kumar</p>
            </div>
            <NavLink value={{ id: 3, path: '/studio', name: 'Studio', icon: FaVideo, className: 'mx-2' }} />
            <Button
              onClick={() => {
                window.localStorage.clear('token');
                window.location.reload();
              }}
              className="w-full rounded-none rounded-b bg-red-500">
              Logout
            </Button>
            <div className="absolute -top-1 left-9 h-8 w-6 rotate-45 rounded bg-gray-800"></div>
          </div>
        </>
      );
    }
    return (
      <Link to={'/login'} className="flex h-6 w-14 items-center justify-center rounded bg-[#F41B3B] text-xs font-semibold text-white">
        Login
      </Link>
    );
  };

  useEffect(() => {
    if (showProfile && profileCard.current) {
      profileCard.current.focus();
    }
  }, [showProfile]);

  useEffect(() => {
    setShowProfile(false);
  }, [window.history.state.idx]);

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
                onChange={(e) => setSearch({ search: e.target.value.trimStart() })}
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
