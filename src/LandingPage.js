import React, { Suspense, useState} from 'react'
import { Button} from 'antd';
import { withRouter } from 'react-router-dom'
import { Select } from 'antd'
import createFetcher from "./create-fetcher"
import api from "./api"
import back from "./background.css"
const { Option } = Select;
const ButtonStyle = {
  margin:"50px auto",
  width:"100px",
  display:"block",
  background:"rgb(252,186,3)",
  border:"none",
}
const fontstyle ={
  textAlign:"center",
 
  margin:"20px"
}
function LandingPage ( props ) {
  var [count,setCount] = useState(0)

  var fetcher = createFetcher((did) => {
      return api.get('/deskinfo?did=' + did)
  })
   
   
  function DeskInfo ({did}) {
      var info = fetcher.read(did).data
     

      return (
          <div>
              <h2 style={fontstyle}>{info.title}</h2>
              <h2 style={fontstyle}>{info.name}</h2>
          </div>
      )
  }
    
    var rid = props.match.params.rid
    var did = props.match.params.did

   function onChange(value) {
      setCount(value)
      
    }
   function orderFood () {
    props.history.push(`/r/${rid}/d/${did}/c/${count}/`)
  }
    

    return (
    <div>
     <Suspense fallback={<div>loading</div>}>
       <DeskInfo did={ did }/>
      </Suspense>
      <Select 
        showSearch
        style={{ width: 200,marginLeft:90}}
        placeholder="Select person count"
        optionFilterProp="children"
        onChange={onChange}
        
        
        filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="4">4</Option>
    </Select><br/>
    <Button type="primary" style={ButtonStyle} onClick={ orderFood }>开始点餐</Button>
    </div>

)
}


export default withRouter(LandingPage)