import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { server } from "../server";
import { BsXCircleFill } from "react-icons/bs";
import { useSelector } from "react-redux";

const CreateGroup = ({ chat, edit }) => {
  const user = useSelector((state) => state.user);
  const [searchRes, setSearRes] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState(
    chat?.users?.map((u) => {
      return u?.email !== user?.email ? u : "";
    })
  );
  const [groupName, setGroupName] = useState(
    chat?.chatName !== "sender" ? chat?.chatName : ""
  );
  const [state, setState] = useState(false);
  const search = async (value) => {
    await axiosInstance
      .get(`${server}/api/users/?search=${value}`)
      .then((res) => {
        setSearRes(res.data);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    setSelectedUsers([...new Set(selectedUsers)]);
  }, [state]);

  //createGroup//update
  const users = selectedUsers?.map((u) => {
    return u?._id;
  });
  const create = async () => {
    if (users?.length < 2) {
      return alert("Group can not have less than 2 members");
    }
    if (!groupName) {
      return alert("group name is required");
    }
    if (edit) {
      await axiosInstance
        .put(`${server}/api/chats/update-group/${chat?._id}`, {
          users: JSON.stringify(users),
          chatName: groupName,
        })
        .then((res) => {
          alert("Group updated");
          window.location.reload();
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await axiosInstance
        .post(`${server}/api/chats/create-group-chat`, {
          users: JSON.stringify(users),
          chatName: groupName,
        })
        .then((res) => {
          console.log(res);
          alert("Group Created");

          window.location.reload();
        })
        .catch((err) => {});
    }
  };

  return (
    <div
      style={{ height: "350px" }}
      className="w-full flex overflow-y-auto pb-28  flex-col gap-1 items-center"
    >
      <h6 className="text-green-600 font-bold">
        {edit ? "Update Group" : "Create Group"}
      </h6>
      <div className="w-full flex flex-wrap gap-1">
        {selectedUsers?.length
          ? selectedUsers?.map((select, i) => {
              return select !== "" ? (
                <div
                  onClick={(e) => {
                    selectedUsers.pop(select);
                    setState((c) => !c);
                  }}
                  key={i}
                  className="flex cursor-pointer relative items-center justify-center flex-col"
                >
                  <img src={select?.avatar} className="h-4 w-4 rounded-full" />
                  <p style={{ fontSize: "0.3rem" }}>
                    {select?.name?.substring(0, 6)}
                  </p>

                  <BsXCircleFill
                    size={"0.5rem"}
                    className="text-red-600 absolute top-0 right-0"
                  />
                </div>
              ) : (
                ""
              );
            })
          : ""}
      </div>
      <input
        onChange={(e) => search(e.target.value)}
        type="search"
        className="p-0.5 w-5/6 pl-4 border-2  rounded-md border-emerald-400"
        placeholder="Search members to add..."
      />
      <div className="w-5/6 flex flex-col gap-2 items-center justify-center">
        {searchRes?.length
          ? searchRes?.map((res, i) => {
              return (
                <div
                  key={i}
                  onClick={(e) => {
                    setSelectedUsers([...new Set(selectedUsers), res]);
                  }}
                  className="w-full relative flex items-center justify-around"
                >
                  <img src={res?.avatar} className="h-10 w-10 rounded-full" />
                  <p className="text-sm font-semibold">{res?.name}</p>
                  <button
                    disabled={
                      selectedUsers?.find((val) => {
                        return val?._id === res?._id;
                      })
                        ? true
                        : false
                    }
                    onClick={(e) => {
                      setSelectedUsers([...selectedUsers, res]);
                    }}
                    className="px-1 text-xs py-0.5 disabled:opacity-30 bg-green-600 text-white rounded-md"
                  >
                    Add
                  </button>
                </div>
              );
            })
          : ""}
      </div>
      <div className="absolute bottom-2 bg-white w-full flex flex-col items-center justify-center gap-4">
        <input
          onChange={(e) => setGroupName(e.target.value)}
          type="text"
          className="p-0.5 w-5/6 pl-4 border-2  rounded-md border-emerald-400"
          placeholder={!groupName ? "Enter Group Name" : groupName}
        />
        {!edit ? (
          <button
            onClick={create}
            className="bg-green-600 shadow-sm shadow-black rounded-md py-0.5 px-1 text-white font-semibold w-1/3 "
          >
            Create
          </button>
        ) : (
          <button
            onClick={create}
            className="bg-blue-600 shadow-sm shadow-black rounded-md py-0.5 px-1 text-white font-semibold w-1/3 "
          >
            Update
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateGroup;
