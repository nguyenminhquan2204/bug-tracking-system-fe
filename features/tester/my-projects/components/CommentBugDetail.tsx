/* eslint-disable @typescript-eslint/no-explicit-any */
import { useShallow } from "zustand/shallow";
import { IBug } from "../interface";
import { useMyProjectStore } from "../stores/useMyProjectStore";
import AddCommentSection from "./AddCommentSection";
import { useEffect } from "react";

export default function CommentBugDetail({ selectedBug }: { selectedBug: IBug }) {
   const { getBugDetailById, bugDetail } = useMyProjectStore(useShallow((state) => ({
      getBugDetailById: state.getBugDetailById,
      bugDetail: state.bugDetail
   })))

   useEffect(() => {
      if(!selectedBug) return;
      getBugDetailById(selectedBug.id)
   }, [])

   return (
      <>
         <div className="space-y-4">
         <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            Comments
         </h3>
         <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {bugDetail && bugDetail.comments && bugDetail.comments.length > 0 ? (
               bugDetail.comments.map((comment: any) => (
                  <div
                     key={comment.id}
                     className="rounded-xl border bg-white dark:bg-zinc-900 p-4 shadow-sm hover:shadow-md transition"
                  >
                     {/* Header */}
                     <div className="flex justify-between items-center mb-2">
                     <p className="font-semibold text-sm">
                        {comment.user?.userName}
                     </p>
                     <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleString()}
                     </span>
                     </div>
                     <p className="text-sm whitespace-pre-wrap mb-3">
                        {comment.content}
                     </p>
                     {comment.attachments && comment.attachments.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                           {comment.attachments.map((att: any) => {
                              const file = att.file
                              const isImage = file?.type?.startsWith("image")
                              const isVideo = file?.type?.startsWith("video")
                              return (
                              <div
                                 key={att.id}
                                 className="relative rounded-lg overflow-hidden border bg-black/5"
                              >
                                 {isImage && (
                                    <a href={file.path} target="_blank">
                                    <img
                                       src={file.path}
                                       alt={file.name}
                                       className="w-full h-32 object-cover hover:scale-105 transition"
                                    />
                                    </a>
                                 )}
                                 {isVideo && (
                                    <video
                                    src={file.path}
                                    controls
                                    className="w-full h-32 object-cover"
                                    />
                                 )}
                                 {!isImage && !isVideo && (
                                    <a
                                       href={file.path}
                                       target="_blank"
                                       className="flex flex-col items-center justify-center h-32 text-xs text-center p-2 hover:bg-muted/40 transition"
                                    >
                                       <div className="text-3xl mb-2">📎</div>
                                       <span className="truncate w-full">{file.name}</span>
                                    </a>
                                 )}
                                 {isImage && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                                    {file.name}
                                    </div>
                                 )}
                              </div>
                              )
                           })}
                        </div>
                     )}
                  </div>
               ))
               ) : (
                  <p className="text-muted-foreground text-sm">
                     No comments yet
                  </p>
            )}
         </div>
            <AddCommentSection bugId={selectedBug.id} />
         </div>
      </>
   )
}