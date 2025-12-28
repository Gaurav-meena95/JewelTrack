import { useContext, useState } from "react";


const AuthContext = useContext(undefined)

const AuthProvider = ({ children }) => {
    const [user,setUser] = useState(null)
    
    return (
        <AuthContext.AuthProvider>
            {children}
        </AuthContext.AuthProvider>
    )
}
