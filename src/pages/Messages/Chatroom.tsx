import {
    Avatar, Box,
    Divider,
    Flex,
    Heading, IconButton,
    TabPanel,
    Text, Tooltip, useDisclosure
} from "@chakra-ui/react";
import {Chatbox} from "./chatbox";
import {IChatroom, Message, useUserStore} from "../../../store";
import {UserTyping} from "./components/user-typing";
import {ArrowBackIcon, CheckIcon} from "@chakra-ui/icons";

interface ChatroomProps extends React.ComponentProps<typeof TabPanel> {
    chatroom: IChatroom;
    isTyping: boolean;
    onExitChatroom: () => void;
    backButtonVisible: boolean;
}

export const Chatroom = (props: ChatroomProps, {...rest}) =>{

    const userId = useUserStore((state) => state.user.id);
    const chatroomUsers = props.chatroom.chatroom_user;
    const chatroomId = props.chatroom.id;
    const messages = props.chatroom.message;
    const latestMessage = messages.filter((message: Message) => message.sender_id === userId)[0]

    return(
        <Box
            as={TabPanel}
            display={'inline-flex'}
            flexDir={'column'}
            rounded={'md'}
            borderColor={'slate'}
            borderWidth={'1px'}
            h={'100%'}
            w={'100%'}
            overflowY={'auto'}
            onClick={props.onClick}

            {...rest}
        >
            <Flex p={'2'} alignItems={'center'} justifyContent={'space-between'}  gap={'4'}>
                <Flex gap={'2'} alignItems={'center'}>
                    <Avatar size={'md'} src={chatroomUsers[0].account.account_images?.avatar_url || ''} />
                    <Heading size={'md'}>
                        {chatroomUsers[0].account.person.first_name} {chatroomUsers[0].account.person.last_name}
                    </Heading>
                </Flex>
                {
                    props.backButtonVisible &&
                    (
                        <Box>
                            <IconButton aria-label={'back'} icon={<ArrowBackIcon/>} onClick={props.onExitChatroom} />
                        </Box>
                    )
                }

            </Flex>

            <Divider />

            <Flex flex={'1'}
                  flexDir={'column-reverse'}
                  p={'6'}
                  gap={'1'}
                  overflowY={'scroll'}
                  position={'relative'}
            >
                {
                    messages && messages.map((message:Message) => {
                        const isSender = message.sender_id === userId;
                        const border = isSender ? 'borderBottomRightRadius' : 'borderBottomLeftRadius';
                        const tooltipPosition = isSender ? 'left-end' : 'right-end';
                        const borderRadiusStyle = {[border]: '0'};
                        const time = new Date(message.sent_at).toLocaleTimeString()
                        const date = new Date(message.sent_at).toLocaleDateString()
                        const messageStatus = message.status;
                        const recipient = chatroomUsers.find((user) => user.user_id !== userId);

                        return (
                            <Flex key={message.id}
                                  alignItems={isSender ? 'flex-end' : 'flex-start'}
                                  justifyContent={isSender ? 'flex-end' : 'flex-start'}
                                  gap={'2'}
                            >
                            <Tooltip label={messageStatus} placement={tooltipPosition}>
                                    <Box bgColor={isSender ? 'blue.700' : 'green.700'}
                                         px={'4'} py={'2'}
                                         w={{base: '30% !important', md: '35% !important'}}
                                         rounded={'xl'} display={'flex'} flexDir={'column'} gap={'2'} {...borderRadiusStyle}>
                                        <Text fontSize={'md'} wordBreak={'break-word'}>{message.content}</Text>
                                        <Text fontSize={'xs'}>{time} {date}</Text>
                                    </Box>
                            </Tooltip>
                                <Flex display={'block'} position={'relative'} h={'100%'}>
                                    {
                                        isSender && messageStatus === 'sent' &&
                                        <Tooltip label={'Message sent'} hasArrow placement={'bottom-end'} aria-label={'Message sent'} >
                                            <Avatar position={'absolute'} bottom={'0'} as={CheckIcon} size={'2xs'} bgColor={'transparent'} color={'green.500'}  />
                                        </Tooltip>
                                    }
                                    {
                                        isSender && ((messageStatus === 'read') && (message.id === latestMessage.id)) &&
                                        <Tooltip label={`Read by ${recipient?.account.person.first_name} ${recipient?.account.person.last_name}`}
                                                 hasArrow
                                                 placement={'bottom-end'}
                                                 aria-label={'Message sent'}>
                                            <Avatar position={'absolute'} bottom={'0'} size={'2xs'} src={recipient?.account.account_images?.avatar_url || ''} />
                                        </Tooltip>
                                    }

                                </Flex>
                            </Flex>
                        )

                    })
                }
            </Flex>
            <UserTyping isTyping={props.isTyping} />
            <Chatbox chatroomId={chatroomId} />

        </Box>
    )
}