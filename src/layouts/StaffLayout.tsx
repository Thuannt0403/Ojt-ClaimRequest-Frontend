import React from 'react';

const StaffLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-row">
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
};

export default StaffLayout; 