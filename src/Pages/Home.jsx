import posterBackgroundImage from '../images/BG.png'
function HomePage() {
    return (
        <>
            <div className='bg-black -mt-10 text-white min-h-screen'>
                <div style={{ backgroundImage: `url('${posterBackgroundImage}')` }} className="bg-cover h-[442px] pt-28 px-5">
                    <h1 className='font-semibold text-base'>Welcome to whiteBLOB</h1>
                    <h1 className='text-2xl font-extrabold mt-2'>
                        Download Unlimited <br />
                        Movies, Drama, Music Video <br />
                        and More Content.
                    </h1>
                    <p className='text-sm font-light mt-4'>
                        Enjoy exclusive Music Video popular movies <br />
                        and Live shows. Subscribe BD Screen now
                    </p>
                    <div className='flex items-center mt-4 rounded bg-white text-black py-2'>
                        <h1 className='px-3 border-r border-red-500 mr-3 h-8 flex items-center'>+91</h1>
                        <div>
                            <input className='outline-none' type="number" name="" id="" placeholder='Enter mobile number' />
                        </div>
                    </div>
                </div>

            </div>
            <div></div>
        </>
    );
}

export default HomePage;