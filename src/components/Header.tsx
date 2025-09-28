'use client';

import { FC } from 'react';
import { WheelIcon } from './icons';

const Toggle: FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center space-x-2">
    <label className="text-sm text-gray-400 select-none">{label}</label>
    <div className="relative inline-block w-10 h-5 rounded-full cursor-pointer bg-gray-600">
      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform"></div>
    </div>
  </div>
);

const DropDownBox: FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center space-x-2">
    <label className="text-sm text-gray-400 select-none">{label}</label>
    <select className="bg-gray-700 text-white text-sm rounded p-1 outline-none border border-gray-600 focus:ring-2 focus:ring-blue-500">
      <option>English</option>
      <option>Tiếng Việt</option>
    </select>
  </div>
);

export const Header: FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between shadow-md z-10 flex-shrink-0">
      <div className="flex items-center space-x-4">
        <WheelIcon className="w-8 h-8 text-blue-400" />
        <h1 className="text-xl font-bold">Random Wheel</h1>
      </div>
      <div className="flex items-center space-x-8">
        <Toggle label="Sound" />
        <Toggle label="Animation" />
        <DropDownBox label="Languages" />
      </div>
    </header>
  );
};