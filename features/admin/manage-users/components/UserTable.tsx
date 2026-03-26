'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useManageUserStore } from "../stores/useManageUserStore";
import { useShallow } from "zustand/shallow";
import EditUserDialog from "./EditUserDialog";
import DeleteUserDialog from "./DeleteUserDialog";
import { IUser } from "@/packages/interfaces";
import { useTranslations } from "next-intl";

export default function UserTable({ data }: { data: IUser[] }) {
   const t = useTranslations('Admin.ManageUser');
   const { setSelectedUser, setIsOpenEditUserDialog, isOpenEditUserDialog, setIsOpenDeleteUserDialog, isOpenDeleteUserDialog } = useManageUserStore(useShallow((state) => ({
      setSelectedUser: state.setSelectedUser,
      setIsOpenEditUserDialog: state.setIsOpenEditUserDialog,
      isOpenEditUserDialog: state.isOpenEditUserDialog,
      setIsOpenDeleteUserDialog: state.setIsOpenDeleteUserDialog,
      isOpenDeleteUserDialog: state.isOpenDeleteUserDialog
   })))

   return (
      <>
         <EditUserDialog 
            open={isOpenEditUserDialog}
            onOpenChange={setIsOpenEditUserDialog}
         />
         <DeleteUserDialog 
            open={isOpenDeleteUserDialog}
            onOpenChange={setIsOpenDeleteUserDialog}
         />
         <div className="rounded-md border">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead className="w-12">#</TableHead>
                     <TableHead>{t('table.columns.userName')}</TableHead>
                     <TableHead>{t('table.columns.email')}</TableHead>
                     <TableHead>{t('table.columns.role')}</TableHead>
                     <TableHead>{t('table.columns.status.title')}</TableHead>
                     <TableHead>{t('table.columns.actions.title')}</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {data && data.length > 0 && data.map((item, index) => {
                     return (
                        <TableRow key={index}>
                           <TableCell>{index + 1}</TableCell>
                           <TableCell>{item.userName}</TableCell>
                           <TableCell>{item.email}</TableCell>
                           <TableCell>{item.role ? item.role.name : '-'}</TableCell>
                           <TableCell>
                              {item.isActive 
                                 ? <Badge variant='secondary' className="text-green-500">{t('table.columns.status.options.active')}</Badge>
                                 : <Badge variant='destructive' className="text-white">{t('table.columns.status.options.inactive')}</Badge>
                              }
                           </TableCell>
                           <TableCell>
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="cursor-pointer">
                                       <MoreVertical className="h-4 w-4" />
                                    </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end">
                                    <DropdownMenuItem 
                                       onClick={() => {
                                          setSelectedUser(item);
                                          setIsOpenEditUserDialog(true)
                                       }}
                                    >
                                       {t('table.columns.actions.options.edit')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                       className="text-red-600"
                                       onClick={() => {
                                          setSelectedUser(item);
                                          setIsOpenDeleteUserDialog(true);
                                       }}
                                    >
                                       {t('table.columns.actions.options.delete')}
                                    </DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu>
                           </TableCell>
                        </TableRow>
                     )
                  })}
               </TableBody>
            </Table>
         </div>
      </>
   )
}