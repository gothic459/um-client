import {
	Box,
	Button,
	Code,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	HStack,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Text,
	useColorMode,
	useColorModeValue,
	useDisclosure,
	useToast,
	VStack,
	Wrap,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { MoonIcon, SunIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { loginUser } from '../api/login-user';
import { useMutation, useQuery } from 'react-query';
import { checkAuth } from '../api/check-auth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useUserStore } from '../../store';
import { fetchUserProfile } from '../api/users';
import { useTranslation } from 'react-i18next';
import { GB, PL } from 'country-flag-icons/react/3x2';
import { Link } from 'react-router-dom';
import socket from "../socket";
import useSocket from "../hooks/useSocket";

export default function Login() {
	const { t, i18n } = useTranslation();
	const [showPassword, setShowPassword] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [formError, setFormError] = useState(false);
	const [isEverythingLoading, setIsEverythingLoading] = useState(false);

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};

	const handleUsernameChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setFormError(false);
		setUsername(event.target.value);
	};
	const handlePasswordChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setFormError(false);
		setPassword(event.target.value);
	};
	const navigate = useNavigate();
	const { colorMode, toggleColorMode } = useColorMode();

	const { refetch: refetchProfile, isLoading:refetchLoading } = useQuery(
		'fetchUserProfile',
		() => fetchUserProfile(),
		{
			enabled: false,
			refetchOnWindowFocus: false,
		},
	);

	const { data: authData, refetch: refetchAuth, isLoading: refetchAuthLoading } = useQuery(
		'checkAuth',
		() => checkAuth(),
		{
			enabled: false,
			refetchOnWindowFocus: false,
		},
	);

	const { mutate: LoginMutation, isLoading, status } = useMutation(loginUser, {
		onSuccess: (data) => {
			userAuth.setAuth(true);
			userAuth.setRole(data.role);
			userStore.setUser(data);
			refetchProfile().then((response) => {
				userStore.setUser(response.data);
				console.log('redirecting after successful login...');
				setIsEverythingLoading((refetchAuthLoading && refetchLoading) && isLoading);
				navigate('/', { replace: true });
			});
		},
		onError: (error) => {
			setFormError(true);
		},
	});

	const selectSampleAccount = (selection: string) => {
		switch (selection) {
			case 'admin':
				setUsername('abbotoneal372');
				setPassword('32840473032');
				break;
			case 'teacher':
				setUsername('lylegregory371');
				setPassword('20282483098');
				break;
			case 'student':
				setUsername('haley10381');
				setPassword('49110485529');
				break;
		}
	};

	const userStore = useUserStore((state) => state);
	const userAuth = useAuthStore();

	useEffect(() => {
		refetchAuth().then((res) => {
			if (res.data.auth) {
				navigate('/');
			}
		});
	}, [navigate, refetchAuth, userAuth.auth]);

	const handleLogin = () => {
		if (username === '' || password === '') {
			setFormError(true);
			return;
		}
		setIsEverythingLoading(true);
		LoginMutation({ username, password });
	};
	useEffect(()=>{
		console.log();
	},[isLoading, refetchLoading])
	return (
		<Flex
			minH={'100vh'}
			minW={'100%'}
			align={'center'}
			justify={'center'}
			flexDir={'row'}
			bg={useColorModeValue('gray.500', 'black.800')}>
			<Stack spacing={8} mx={'auto'} py={12} px={6}>
				<Box
					rounded={'lg'}
					bg={useColorModeValue('white', 'gray.700')}
					boxShadow={'lg'}
					p={8}>
					<VStack>
						<Stack flexDir={'column'} spacing={4}>
							<Text>sample accounts:</Text>
							<Code
								cursor={'pointer'}
								onClick={() => selectSampleAccount('student')}>
								student account
							</Code>
							<Code
								cursor={'pointer'}
								onClick={() => selectSampleAccount('teacher')}>
								teacher account
							</Code>
							<Code
								cursor={'pointer'}
								onClick={() => selectSampleAccount('admin')}>
								admin account
							</Code>
						</Stack>
					</VStack>
					<Stack spacing={10}>
						<HStack
							display={'flex'}
							justifyContent={'space-between'}>
							<Wrap>
								<IconButton
									p={1}
									aria-label={'English'}
									icon={<GB />}
									onClick={() => changeLanguage('en')}
								/>
								<IconButton
									p={1}
									aria-label={'Polish'}
									icon={<PL />}
									onClick={() => changeLanguage('pl')}
								/>
							</Wrap>
							<Wrap>
								<IconButton
									aria-label={'Toggle Color Mode'}
									onClick={toggleColorMode}
									icon={
										colorMode === 'light' ? (
											<MoonIcon />
										) : (
											<SunIcon />
										)
									}
								/>
							</Wrap>
						</HStack>
						<Stack align={'center'}>
							<Heading fontSize={'4xl'} textAlign={'center'}>
								{t('login-screen.message')}
							</Heading>
						</Stack>

						<FormControl isInvalid={formError}>
							<FormErrorMessage>
								{t('login-screen.validate-error')}
							</FormErrorMessage>
							<FormControl
								id="username"
								isRequired
								isInvalid={formError}>
								<FormLabel>
									{t('login-screen.username')}
								</FormLabel>
								<Input
									type="text"
									value={username}
									onChange={handleUsernameChange}
								/>
							</FormControl>
							<FormControl
								id="password"
								isRequired
								isInvalid={formError}>
								<FormLabel>
									{t('login-screen.password')}
								</FormLabel>
								<InputGroup>
									<Input
										type={
											showPassword ? 'text' : 'password'
										}
										onChange={handlePasswordChange}
									/>
									<InputRightElement h={'full'}>
										<Button
											variant={'ghost'}
											onClick={() =>
												setShowPassword(
													(showPassword) =>
														!showPassword,
												)
											}>
											{showPassword ? (
												<ViewIcon />
											) : (
												<ViewOffIcon />
											)}
										</Button>
									</InputRightElement>
								</InputGroup>
							</FormControl>
						</FormControl>

						<Text align={'right'} color={'blue.400'}>
							<Link to={'/forgot-password'}>
								{t('login-screen.forgot-password')}
							</Link>
						</Text>
						<Stack spacing={10} pt={2}>
							<Button
								loadingText={
									t('login-screen.sign-in-btn-loading') ??
									'Loading...'
								}
								isLoading={isEverythingLoading}
								size="lg"
								bg={'blue.400'}
								color={'white'}
								_hover={{
									bg: 'blue.500',
								}}
								onClick={handleLogin}>
								{t('login-screen.sign-in-btn')}
							</Button>
						</Stack>
						<Stack pt={6} direction={'column'} align={'center'}>
							<Link to={'/forgot-password'}>
								<Text color={'red.400'}>
									{t('login-screen.contact-admin')}
								</Text>
							</Link>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
