import React, { useEffect, useState } from "react";
import CachedQuery from "../../models/CachedQuery";
import SearchHistoryViewer from "../../Components/ImageViewer/SearchHistoryViewever";

function HistoryScreen() {
  const [searchHistory, setSearchHistory] = useState<CachedQuery[]>([]);
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    // get search history from cache
    const history = localStorage.getItem("searchCache");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="wrapper">
        <h1 className="font-bold text-4xl text-main-purple">ისტორია</h1>
        <h3 className="font-bold text-lg text-main-purple mb-4">ბოლო <span className="font-bold">{Object.entries(searchHistory).length }</span> მონაძებნი:</h3>
        
        {/* map out the images */}
        <div className={`grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 p-4 my-8 max-h-96 
        ${Object.entries(searchHistory).length > 15 ? 'border-2 border-solid border-main-purple overflow-y-scroll' : ''}`}>
          {searchHistory &&
            Object.entries(searchHistory).map((searchItem, index) => (
              <div 
              key={index}
              className="w-full border-2 border-solid border-main-purple text-xl p-2 rounded-lg 
              hover:cursor-pointer hover:bg-main-red hover:text-white
              ease-in duration-100 transition-all
              "
              onClick={() => setSearchString(searchItem[0])}
              >
              {searchItem[0]}
              </div>
            ))}
        </div>
        {/* if there is nothing in the cache , show jer araferi mogidzebniat */}
        {Object.entries(searchHistory).length === 0 && <h1 className="text-4xl text-main-red text-center w-full">ჯერ არაფერი მოგიძებნიათ!</h1>}
        
        
        {searchString !== "" && <SearchHistoryViewer searchString={searchString} />}
      </div>
    </div>
  );
}

export default HistoryScreen;
