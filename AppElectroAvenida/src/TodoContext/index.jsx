import { createContext, useState} from "react";

const TodoContext = createContext();

function TodoProvider({children}) {
    
    const [searchValue,setSearchValue] = useState('');
    const [product,setProduct] = useState('');

    return (
        <TodoContext.Provider value={{
            searchValue,
            setSearchValue,
            product,
            setProduct
        }}>
            {children}
        </TodoContext.Provider>
    )

}

export {TodoProvider,TodoContext};