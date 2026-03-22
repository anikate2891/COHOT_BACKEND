import { createContext , useState } from "react";


export const AuthContext = createContext()
// create a Context in this context we have

export const AuthProvider = function ({children}){
    const [user, setuser] = useState(null);
    const [loading, setloading] = useState(false);

    return( // this four things which create in AuthProvider
        <AuthContext.Provider value={{user , setuser , loading ,setloading}}>
            {children}
        </AuthContext.Provider>
    )
}

// Data Store in State layer - and import it on App.jsx beacuse of full data is here