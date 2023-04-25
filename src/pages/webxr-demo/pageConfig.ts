/*
 * @Author: Peng Xiang (Email:px.i@foxmail.com QQ:245803627)
 * @Date: 2023-02-21 14:47:38
 * @LastEditTime: 2023-03-03 13:23:53
 * @LastEditors: Peng Xiang
 * @Description: 
 * @FilePath: \src\pages\cyzxdcharts\pageConfig.ts
 * 
 */

export const publicPath = process.env.NODE_ENV == 'development' ? 'webxr-demo' : '.';

export const stage = {
    width: 1920,
    height: 1080,
}

// 3840×2160 （超高清 4K）
// 2560X1440 （2K）
// 1920×1080 （1080p全高清）
// 1600×900
// 1280×720    （720P 高清）

// 960x540 ppt


// ppt
// 十进制值	全屏像素（水平 × 垂直）	宽屏像素（水平 + 垂直）	每英寸点数（水平和垂直）
// 50	500 × 375	667 × 375	50 dpi
// 96（默认值）	960 × 720	1280 × 720	96 dpi
// 100	1000 × 750	1333 × 750	100 dpi
// 150	1500 × 1125	2000 × 1125	150 dpi
// 200	2000 × 1500	2667 × 1500	200 dpi
// 250	2500 × 1875	3333 × 1875	250 dpi
// 300	3000 × 2250	4000 × 2250	300 dpi