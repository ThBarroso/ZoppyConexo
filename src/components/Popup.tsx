import React from 'react';

interface PopupProps {
  title: string;
  message: string;
  onClose: () => void; // Função para fechar o popup
  children?: React.ReactNode; // Permite passar botões personalizados
}

const Popup: React.FC<PopupProps> = ({ title, message, onClose, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
        <div className="bg-red-500 text-white rounded-t-lg py-2">
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <div className="py-4">
          <p className="text-gray-700">{message}</p>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;