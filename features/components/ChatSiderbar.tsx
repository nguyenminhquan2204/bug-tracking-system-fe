'use-client';

import { IUserChat } from "@/packages/interfaces";

interface Props {
  users: IUserChat[];
  testers?: IUserChat[];
  developers?: IUserChat[];
  selectedUser: IUserChat | null;
  onSelect: (user: IUserChat) => void;
}

export function ChatSidebar({ users, testers, developers, selectedUser, onSelect }: Props) {
  return (
    <div className="w-50 bg-white border-r flex flex-col">
      <div className="text-xl font-bold p-4">Messages</div>
      <div className="flex-1 overflow-y-auto">
        {users && users.length > 0 && users.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelect(user)}
            className={`flex items-center gap-3 p-3 cursor-pointer transition ${
              selectedUser?.id === user.id
                ? "bg-blue-50"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
              {user.username.charAt(0)}
            </div>
            <div className="font-medium">{user.username}</div>
          </div>
        ))}
      </div>
      {(testers || developers) && 
        <>
          <br></br>
          <div className="flex-1 overflow-y-auto">
            {testers && testers.length > 0 && testers.map((user) => (
              <div
                key={user.id}
                onClick={() => onSelect(user)}
                className={`flex items-center gap-3 p-3 cursor-pointer transition ${
                  selectedUser?.id === user.id
                    ? "bg-blue-50"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                  {user.username.charAt(0)}
                </div>
                <div className="font-medium">{user.username}</div>
              </div>
            ))}
          </div>
          <br></br>
          <div className="flex-1 overflow-y-auto">
            {developers && developers.length > 0 && developers.map((user) => (
              <div
                key={user.id}
                onClick={() => onSelect(user)}
                className={`flex items-center gap-3 p-3 cursor-pointer transition ${
                  selectedUser?.id === user.id
                    ? "bg-blue-50"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                  {user.username.charAt(0)}
                </div>
                <div className="font-medium">{user.username}</div>
              </div>
            ))}
          </div>
        </>
      }
    </div>
  );
}