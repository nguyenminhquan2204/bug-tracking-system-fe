"use client";

import UserTable from "../components/UserTable";
import AddUserDialog from "../components/AddUserDialog";
import FilterSearchUser from "../components/FilterSearchUser";
import TitleDescription from "@/features/components/TitleDescription";
import PaginationCustom from "@/features/components/PaginationCustom";
import { useManageUserStore } from "../stores/useManageUserStore";
import { useShallow } from "zustand/shallow";
import { useEffect } from "react";
import { DEFAULT_FIRST_PAGE } from "@/packages/utils";

export default function ManageUserPage() {
  const { 
    getUserList, 
    userList, 
    getRoleList, 
    roleList, 
    totalItems, 
    userGetListQuery, 
    setUserGetListQuery
  } = useManageUserStore(useShallow((state) => ({
    getUserList: state.getUserList,
    userList: state.userList,
    getRoleList: state.getRoleList,
    roleList: state.roleList,
    totalItems: state.totalItems,
    userGetListQuery: state.userGetListQuery,
    setUserGetListQuery: state.setUserGetListQuery
  })))

  useEffect(() => {
    const fetchApi = async () => {
      await Promise.all([
        getUserList(),
        getRoleList()
      ])
    }
    fetchApi()
  }, [])

  return (
    <div className="space-y-6">
      <TitleDescription title='Manage Users' description='View and manage information users.' />
      <div className="flex flex-wrap items-end gap-4">
        <FilterSearchUser data={roleList} />
        <AddUserDialog data={roleList} />
      </div>
      <UserTable data={userList} />
      <PaginationCustom 
        totalItems={totalItems}
        currentPage={userGetListQuery.page || DEFAULT_FIRST_PAGE}
        limit={userGetListQuery.limit || 10}
        onChangePage={(page) => setUserGetListQuery({ page })}
        onItemsPerPageChange={(limit) =>
          setUserGetListQuery({ limit, page: DEFAULT_FIRST_PAGE })
        }
        itemLabel="users"
      />
    </div>
  );
}