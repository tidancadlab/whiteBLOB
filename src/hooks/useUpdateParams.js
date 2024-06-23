import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 *
 * @param {{key: string}} defaultParams
 */
const useUpdateSearchParams = (defaultParams = {}) => {
  const [searchParam, setSearchParam] = useSearchParams();
  const [params, setParams] = useState(defaultParams);

  useEffect(() => {
    
    if (Object.entries(params).length <= 0) return;
    for (const [key, value] of Object.entries(params)) {
      if (searchParam.has(key)) {
        searchParam.set(key, value);
      } else {
        searchParam.append(key, value);
      }
    }
    searchParam.sort();
    setSearchParam(searchParam);
  }, [params]);

  let paramsObject = {};
  for (const [key, value] of searchParam.entries()) {
    paramsObject[key] = value;
  }
  return [paramsObject, setParams];
};

export default useUpdateSearchParams