import React, { useEffect, useState } from "react";
import CachedQuery from "../../models/CachedQuery";

function HistoryScreen() {
  const [searchHistory, setSearchHistory] = useState<CachedQuery[]>([]);

  useEffect(() => {
    // Retrieve search history from local storage or any other cache
    const history = localStorage.getItem("searchCache");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  console.log(searchHistory);
  return (
    <div className="flex flex-col items-center">
      <div className="wrapper">
        <h1 className="font-bold text-2xl text-main-purple">ისტორია</h1>
        <h3 className="font-bold text-lg text-main-purple mb-4">ისტორია</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {searchHistory &&
            Object.entries(searchHistory).map((searchItem, index) => (
              <div 
              key={index}
              className="w-full border-2 border-solid border-main-purple text-xl p-2 rounded-lg 
              hover:cursor-pointer hover:bg-main-red hover:text-white
              ease-in duration-100 transition-all
              "
              >
              {searchItem[0]}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default HistoryScreen;
