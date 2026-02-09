'use client'

import TitleDescription from "@/features/components/TitleDescription"
import ProjectTable from "../components/ProjectTable"
import { useManageProjectStore } from "../stores/useManageProjectStore"
import { useShallow } from "zustand/shallow"
import { useEffect } from "react"
import AddProjectDialog from "../components/AddProjectDialog"
import PaginationCustom from "@/features/components/PaginationCustom"
import { DEFAULT_FIRST_PAGE } from "@/packages/utils"
import FilterSearchProjects from "../components/FilterSearchProjects"

export default function ManageProjectPage () {
   const { 
      getProjectList, 
      projectList, 
      getAdminList, 
      adminList,
      totalItems,
      projectGetListQuery,
      setProjectGetListQuery
   } = useManageProjectStore(useShallow((state) => ({
      getProjectList: state.getProjectList,
      projectList: state.projectList,
      getAdminList: state.getAdminList,
      adminList: state.adminList,
      totalItems: state.totalItems,
      projectGetListQuery: state.projectGetListQuery,
      setProjectGetListQuery: state.setProjectGetListQuery
   })))

   useEffect(() => {
      const fetchApi = async () => {
         await Promise.all([
            getProjectList(),
            getAdminList()
         ])
      }
      fetchApi()
   }, [])

   return (
      <div className="space-y-6">
         <TitleDescription title="Manage Projects" description="View and manage information projects." />
         <div className="flex flex-wrap items-end gap-4">
            <FilterSearchProjects data={adminList} />
            <AddProjectDialog data={adminList} />
         </div>
         <ProjectTable data={projectList} />
         <PaginationCustom 
            totalItems={totalItems}
            currentPage={projectGetListQuery.page || DEFAULT_FIRST_PAGE}
            limit={projectGetListQuery.limit || 10}
            onChangePage={(page) => setProjectGetListQuery({ page })}
            onItemsPerPageChange={(limit) =>
               setProjectGetListQuery({ limit, page: DEFAULT_FIRST_PAGE })
            }
            itemLabel="projects"
         />
      </div>
   )
}