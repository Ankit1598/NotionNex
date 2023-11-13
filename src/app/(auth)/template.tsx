import React from "react";

interface AuthTemplateProps {
	children: React.ReactNode;
}

const AuthTemplate: React.FC<AuthTemplateProps> = ({ children }) => {
	return <div className='h-screen p-6 flex justify-center'>{children}</div>;
};

export default AuthTemplate;
