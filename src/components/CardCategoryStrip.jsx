import Card from "./card";
import VideoURLs from '../data.json'
function CardCategoryStrip({ videoTable = VideoURLs }) {
    
    return (
        <>
            <div className="pt-8">
                <div className="flex justify-between px-5 ">
                    <h1 className="text-xl font-bold">Latest Movies</h1>
                    <span className="flex items-center gap-2 text-sm font-semibold">
                        <span>See all</span>
                        <span>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.33073 7.58073L9.4299 7.58073L6.16906 10.8416L6.99739 11.6641L11.6641 6.9974L6.9974 2.33073L6.1749 3.15323L9.4299 6.41406L2.33073 6.41406L2.33073 7.58073Z" fill="#F41B3B" stroke="#F41B3B" strokeWidth="0.2" />
                            </svg>
                        </span>
                    </span>
                </div>
                <div className="flex py-3 lg:py-5 gap-4 overflow-x-auto  first:hover:text-red-500 items-center snap-x snap-proximity scroll_style relative scroll-mx-5">
                    {videoTable.map((v) => <Card key={v.id} data={v} />)}
                </div>
            </div>
            <div></div>
        </>
    );
}

export default CardCategoryStrip;