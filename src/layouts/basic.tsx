/*
 * @Author: Peng Xiang (Email:px.i@foxmail.com QQ:245803627)
 * @Date: 2023-02-21 15:23:25
 * @LastEditTime: 2023-02-21 15:24:15
 * @LastEditors: Peng Xiang
 * @Description: 
 * @FilePath: \src\layouts\basic.tsx
 * 
 */
import React from 'react';

export default (props: any) => {
    return (
        <div>
            <h2>basic layout</h2>
            {props.children}
        </div>
    );
};