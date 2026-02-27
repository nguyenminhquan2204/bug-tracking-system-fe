export interface IUserChat {
   id: number;
   username: string;
   email: string;
}

export interface IConver {
   id: number;
   type: string
}

export interface IMessage {
   id: number;
   conversationId: number;
   senderId: number;
   content: string;
   isRead: boolean;
}