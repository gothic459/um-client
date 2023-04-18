import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserData } from './src/types/User';

export interface IAuthStore {
	auth: boolean;
	setAuth: (auth: boolean) => void;
	role: string;
	setRole: (role: string) => void;
	logout: () => void;
}

export interface IUserStore {
	user: UserData;
	setUser: (user: UserData) => void;
	clearUser: () => void;
}
// export interface IMessageStore {
// 	messages: Message[];
// 	setMessages: (messages: Message[]) => void;
// 	addMessage: (message: Message) => void;
// }

export interface IChatroomStore{
	chatrooms: IChatroom[];
	setChatrooms: (chatrooms: IChatroom[]) => void;
	addChatroom: (chatroom: IChatroom) => void;
	addMessage: (message: Message) => void;
}

export interface Message {
	sender_id: number;
	chatroom_id: number;
	content: string;
	sent_at: Date;
	status: "read" | "unread";
}
export interface IChatroom {
	id: number;
	created_by: number;
	created_at: Date;
	last_activity: Date;
	chatroom_user: ChatroomUser[];
	message: Message[];
}
export interface ChatroomUser {
    account: {
		account_images:{
			avatar_url: string;
		},
		person: {
			first_name: string;
			last_name: string;
		}
	}
	id: number;
	chatroom_id: number;
	user_id: number;
}

const initialAuthState = {
	auth: false,
	role: '',
};
const initialUserState = {
	user: {} as UserData,
};

const authStore = (set: any): IAuthStore => ({
	auth: false,
	setAuth: (auth) => set({ auth }),
	role: '',
	setRole: (role) => set({ role }),
	logout: () => {
		set(initialAuthState);
	},
});

const userStore = (set: any, get: any): IUserStore => ({
	user: {} as UserData,
	setUser: (user) => set({ user: user }),
	clearUser: () => {
		set(initialUserState);
	},
});

// const messageStore = (set:any, get:any): IMessageStore => ({
// 	messages: [],
// 	addMessage: (message) => set({messages: [message,...get().messages]}),
// 	setMessages: (messages) => set({messages: messages})
// });

const chatroomStore = (set:any, get:any): IChatroomStore => ({
	chatrooms: [],
	addChatroom: (chatroom) => set({chatrooms: [chatroom,...get().chatrooms]}),
	setChatrooms: (chatrooms) => set({chatrooms: chatrooms}),
	//add message which is nested in chatroom
	addMessage: (message) => {
		const chatrooms = get().chatrooms;
		const chatroom = chatrooms.find((chatroom)=> chatroom.id === message.chatroom_id);
		if(chatroom){
			chatroom.message = [message, ...chatroom.message];
		}
		set({chatrooms: chatrooms});
	}
});

export const useUserStore = create<IUserStore>()(
	persist(userStore, { name: 'user' }),
);
export const useAuthStore = create<IAuthStore>()(
	persist(authStore, { name: 'auth' }),
);
export const useChatroomStore = create<IChatroomStore>()(
	persist(chatroomStore, { name: 'chatroom' }),
);
// export const useMessageStore = create<IMessageStore>()(
// 	persist(messageStore, { name: 'message' }),
// );