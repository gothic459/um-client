import { Flex, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {useAuthStore, useChatroomStore, useUserStore} from '../../store';
import { useQuery } from 'react-query';
import { logoutUser } from '../api/logout-user';
import { useEffect } from 'react';
import LoadingScreen from '../components/shared/loading-screen';
import socket from "../socket";

const Logout = () => {
	const navigate = useNavigate();
	const userAuth = useAuthStore();
	const userStore = useUserStore();
	const chatroomStore = useChatroomStore();

	const toast = useToast();
	const { refetch, isLoading } = useQuery('logoutUser', () => logoutUser(), {
		enabled: false,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		refetch().then(() => {
			userAuth.logout();
			userStore.clearUser();
			chatroomStore.logout();
			navigate('/login');
			socket.disconnect();
		});
	}, [chatroomStore, navigate, refetch, userAuth, userStore]);

	return (
		<Flex>
			<LoadingScreen />
		</Flex>
	);
};
export default Logout;
