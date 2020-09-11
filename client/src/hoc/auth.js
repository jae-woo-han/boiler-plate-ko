import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import {auth} from '../_actions/user_action';

export default function(SpecificComponent, option, adminRoute = null) {

    //option
    //null == 아무나
    //true == 로그인 유저
    //false == 로그인 유저는 안 됨

    function AuthenticationCheck (props){
        
        const dispatch = useDispatch();
        
        useEffect(()=>{
            
            dispatch(auth()).then(response =>{
                console.log(response);

                //로그인 하지 않은 상태
                if(!response.payload.isAuth){
                    if(option){
                        alert('로그인 해주세요');
                        props.history.push('/login');
                    }
                }else{
                //로그인 상태
                    if(adminRoute && !response.payload.isAdmin){
                        alert('권한이 없습니다.');
                        props.history.push('/');
                    }else {
                        if(option ==false){//로그인 유저가 들어갈 필요 없는 페이지 들어갈 때
                            props.history.push('/');
                        }
                    }
                }
            });
        }, [])

        return (
            <SpecificComponent />
        )
    }

    return AuthenticationCheck
}