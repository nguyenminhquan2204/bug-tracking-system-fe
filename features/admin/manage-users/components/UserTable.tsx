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
import { IUser } from "../inferface";
import { useManageUserStore } from "../stores/useManageUserStore";
import { useShallow } from "zustand/shallow";
import EditUserDialog from "./EditUserDialog";
import DeleteUserDialog from "./DeleteUserDialog";

export default function UserTable({ data }: { data: IUser[] }) {
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
                     <TableHead>Username</TableHead>
                     <TableHead>Email</TableHead>
                     <TableHead>Role</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead>Action</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {data && data.length > 0 && data.map((item, index) => {
                     return (
                        <TableRow key={index}>
                           <TableCell>{index + 1}</TableCell>
                           <TableCell>{item.userName}</TableCell>
                           <TableCell>{item.email}</TableCell>
                           <TableCell>{item.role.name}</TableCell>
                           <TableCell>
                              {item.isActive 
                                 ? <Badge variant='secondary' className="text-green-500">Active</Badge>
                                 : <Badge variant='destructive' className="text-white">InActive</Badge>
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
                                       Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                       className="text-red-600"
                                       onClick={() => {
                                          setSelectedUser(item);
                                          setIsOpenDeleteUserDialog(true);
                                       }}
                                    >
                                       Delete
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