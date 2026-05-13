export enum NotificationType {
  MENTION = 'MENTION',
  COMMENT = 'COMMENT',
  ASSIGN = 'ASSIGN',
  SYSTEM = 'SYSTEM',
  MESSAGE = 'MESSAGE'
}

export interface INotification {
   id: number,
   userId: number,
   senderName: string,
   title: NotificationType,
   content: string,
   type: NotificationType,
   isRead: boolean,
   createdAt: string
}