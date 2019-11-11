import React from 'react';

import './App.css';
import {Router,Route,Switch} from "react-router-dom"
// import { hashHistory } from 'react-router'

//用餐者和管理者使用同一个前端页面

//用餐者 扫码进入,并选择人数/landing/restaurant/35/desk/20
//       点餐页面 /restaurant/35/desk/20
//       点餐成功页面

//管理者 
//登录
//订单管理：manage/order  订单详情页面manage/order/35
//菜品管理：manage/food
//桌面管理：manage/desk

import HomePage from "./HomePage"
import Login from "./Login"
import Manage from "./boss-manage"
import LandingPage from "./LandingPage"
import FoodCart from './FoodCart'
import OrderSuccess from "./OrderSuccess"
import history from './history'
import Register from './Register'
 
// http://10.240.253.165:3004/#/login 管理者登录页面 a a /b b/c c
// http://10.240.253.165:3004/#/register 管理者登录页面
// http://10.240.253.165:3004/#/landing/r/1/d/1 用餐者 登陆 私房菜餐厅
// http://10.240.253.165:3004/#/landing/r/2/d/3 用餐者 登陆 城市餐厅
// http://10.240.253.165:3004/#/r/3/d/5  用餐者 登陆 知味观 餐厅

function App() {
  return (
    <Router history={history}>
      <Switch>
        
        <Route path="/" component={ HomePage } exact/> 
        <Route path="/landing/r/:rid/d/:did" component={LandingPage} />
        <Route path="/r/:rid/d/:did/c/:count" component={FoodCart} />
        {/* 点餐成功后跳转的页面 */}
        <Route path="/r/:rid/d/:did/order-success" component={OrderSuccess} />
        
        <Route path="/restaurant/:rid/manage/" component={ Manage }/>
        <Route path="/login" component={ Login } />
        <Route path="/register" component={ Register }/>
      </Switch>
    </Router>
  )
}



export default App;

