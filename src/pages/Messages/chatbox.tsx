import {HStack, IconButton, Input, InputGroup, InputRightElement} from "@chakra-ui/react";
import socket from "../../socket";
import {FiSend} from "react-icons/all";
import {useForm} from "react-hook-form";
import {Message, useUserStore} from "../../../store";
import {useEffect, useMemo, useState} from "react";
import debounce from "lodash.debounce";

interface ChatboxProps {
    chatroomId: number
}
export const Chatbox = (props: ChatboxProps) =>{
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const userStore = useUserStore();

    //https://github.com/orgs/react-hook-form/discussions/3078
    const onTyping = debounce((e)=>{
        if(e.target.value.length > 0){
            socket.emit("user-typing", {chatroomId: props.chatroomId, senderId: userStore.user.id, isTyping: true});
        }else{
            socket.emit("user-typing", {chatroomId: props.chatroomId, senderId: userStore.user.id, isTyping: false});
        }
    }, 700)

    const onSubmit = useMemo(()=>{
        return (data: any) =>{
            const message = {
                content: data.message,
                chatroom_id: props.chatroomId,
                sender_id: userStore.user.id,
                sent_at: new Date(),
                status: 'sent'
            } as Message
            socket.emit('user-typing', {chatroomId: props.chatroomId, senderId: userStore.user.id, isTyping: false});
            socket.emit('send-message', message);
            reset();
            //cancel debounced value if user sends message before debounce is over
            onTyping.flush();
        }
    },[onTyping, props.chatroomId, reset, userStore.user.id])



    
    return(
        <HStack w={'100%'} >
            <form onSubmit={handleSubmit(onSubmit)} style={{width:'100%'}}>
                <InputGroup>
                    <Input
                        placeholder={'Type your message'}
                        {...register("message", { required: true, onChange:(e)=>onTyping(e) })}    />
                    <InputRightElement >
                        <IconButton type={'submit'} aria-label={'send message'} icon={<FiSend/>} />
                    </InputRightElement>
                </InputGroup>
            </form>

        </HStack>
    )
}