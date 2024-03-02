import Image from "./Image";

interface CachedQuery {
    key: {
        images: Image[];
    }
}

export default CachedQuery;