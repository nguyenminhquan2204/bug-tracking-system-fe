'use client';

import { IUserChat } from "@/packages/interfaces";
import { useTranslations } from "next-intl";

interface Props {
  users: IUserChat[];
  testers?: IUserChat[];
  developers?: IUserChat[];
  selectedUser: IUserChat | null;
  onSelect: (user: IUserChat) => void;
  titleKey?: string;
  sectionLabels?: {
    users?: string;
    testers?: string;
    developers?: string;
  };
  emptyLabel?: string;
}

export function ChatSidebar({
  users,
  testers,
  developers,
  selectedUser,
  onSelect,
  titleKey,
  sectionLabels,
  emptyLabel,
}: Props) {
  const t = useTranslations("Admin.Chat.sidebar");
  const title = titleKey ?? t("title");

  const sections = [
    { key: "admins", label: sectionLabels?.users ?? t("admins"), items: users ?? [] },
    { key: "testers", label: sectionLabels?.testers ?? t("testers"), items: testers ?? [] },
    { key: "developers", label: sectionLabels?.developers ?? t("developers"), items: developers ?? [] },
  ] as const;

  const hasUsers = sections.some((section) => section.items.length > 0);

  return (
    <div className="w-72 bg-white border-r flex flex-col">
      <div className="text-xl font-bold p-2.5">{title}</div>
      <div className="flex-1 overflow-y-auto">
        {hasUsers ? (
          sections.map((section) =>
            section.items.length > 0 ? (
              <div key={section.key} className="py-2">
                <div className="px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {section.label}
                </div>
                {section.items.map((user) => (
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
            ) : null,
          )
        ) : (
          <div className="p-4 text-sm text-gray-500">{emptyLabel ?? t("empty")}</div>
        )}
      </div>
    </div>
  );
}
