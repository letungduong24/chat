import React from "react";
import { useAuthStore } from "../../store/useAuthStore";

const UserCard = ({id, avatar, name, status, onClick}) => {
  const {selectedUser, setCurrentUser} = useAuthStore() 
  const isActive = id === (selectedUser ?? false);
  
  return (
      <div onClick={() => onClick(id)}
        className={`${
          isActive ? "bg-gray-600" : ""
        } flex items-start gap-3 w-full cursor-pointer hover:bg-gray-700 p-2 rounded-2xl`}
      >      
      <div className="relative w-fit">
        <img
          className="relative w-13 aspect-square rounded-full"
          src={avatar}
          alt=""
        />
      </div>
      <div className="w-full overflow-hidden">
        <p className="font-semibold truncate">{name}</p>
        <p className="text-sm text-gray-300 truncate">{status ? 'Online' : 'Offline'}</p>
      </div>
    </div>
  );
};

export default UserCard;
