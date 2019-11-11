import React from "react"
import {Link} from "react-router-dom"
import back from "./background.css"
const center = {
  display:"block",
  margin:"0 auto",
  width:"100px",
  color:"black",
  marginTop:"10px",
  background:"rgb(252, 186, 3)",
  borderRadius:"15px",
  textAlign:"center",
}
function HomePage() {
  return(
    <div style={{fontSize:"20px"}}>
      <Link to="/login" style={center}>登录</Link>
      <Link to="/register" style={center}>注册</Link>
    </div>
  )
}

export default HomePage