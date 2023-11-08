import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-b from-blue-800 to-blue-900 p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <a href="/" className="text-white text-2xl font-bold">Admin Panel</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
