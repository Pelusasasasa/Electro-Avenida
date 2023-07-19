import { createContext, useState} from "react";

const TodoContext = createContext();

function TodoProvider({children}) {
    
    const [searchValue,setSearchValue] = useState('');

    return (
        <TodoContext.Provider value={{searchValue,setSearchValue}}>
            {children}
        </TodoContext.Provider>
    )

}

export {TodoProvider,TodoContext};