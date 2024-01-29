import React from "react";

const UserProfile = ({ user }) => {
  return (
    <div className="w-full flex items-center justify-center gap-8 flex-col p-2">
      <h6 className="text-xl font-bold text-green-600">Your profile</h6>

      <div className="w-full flex flex-col items-center justify-center gap-4">
        <img src={user?.avatar} className="h-20 w-20 rounded-full" />
        <p className="font-bold">{user?.name}</p>
        <p className="font-bold">{user?.email}</p>
      </div>
    </div>
  );
};

export default UserProfile;
