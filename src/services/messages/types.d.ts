export interface Message {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  scheduledAt: string;
  isExpired: boolean;
  cover?: string;
  verses?: string[];
  author?: {
    id: string;
    firstname: string;
    lastname: string;
  };
}

export interface CreateMessageDto {
  title: string;
  content: string;
  type: string;
  cover?: string;
  scheduledAt: string;
}

export interface UpdateMessageDto {
  title?: string;
  content?: string;
  type?: string;
  cover?: string;
  scheduledAt?: string;
}
