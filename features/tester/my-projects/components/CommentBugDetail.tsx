/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBug } from "../interface";
import AddCommentSection from "./AddCommentSection";

export default function CommentBugDetail({ selectedBug }: { selectedBug: IBug }) {
   return (
      <>
         <div className="space-y-4">
         <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            Comments
         </h3>
         <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {selectedBug.comments && selectedBug.comments.length > 0 ? (
               selectedBug.comments.map((comment: any) => (
               <div
                  key={comment.id}
                  className="rounded-lg border p-3 text-sm bg-muted/20"
               >
                  <div className="flex justify-between items-center mb-1">
                     <p className="font-medium">{comment.user.userName}</p>
                     <span className="text-xs text-muted-foreground">
                     {new Date(comment.createdAt).toLocaleString()}
                     </span>
                  </div>

                  <p className="text-sm whitespace-pre-wrap">
                     {comment.content}
                  </p>
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