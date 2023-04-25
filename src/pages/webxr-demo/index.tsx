/*
 * @Author: Peng Xiang (Email:px.i@foxmail.com QQ:245803627)
 * @Date: 2023-03-14 16:38:19
 * @LastEditTime: 2023-04-25 13:45:00
 * @LastEditors: Peng Xiang
 * @Description: 
 * @FilePath: \src\pages\webxr-demo\index.tsx
 * 
 */
import React, { useLayoutEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

//@ts-ignore
import HandRayTest from './HandRayTest.js';
import './index.css';

export default () => {

    useLayoutEffect(() => {
        mount();
    }, [])

    const mount = () => {
        // Pano();
        HandRayTest();
    }

    return (
        <HelmetProvider>
            <div>
                <Helmet>

                </Helmet>
            </div>
        </HelmetProvider>
    )
}

