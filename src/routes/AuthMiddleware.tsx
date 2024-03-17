import SocketProvider from '@/context/socketContext';
import React from 'react';

const AuthMiddleware = ({ children}: {children: React.ReactNode}) => {

    console.log("authmiddleware middle");

    return (
        <SocketProvider>
            {children}
        </SocketProvider>
    )
}

export default AuthMiddleware;