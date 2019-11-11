import React, { useState, useEffect } from "react"
import api from "./api"
import { Card, Icon ,Button, Radio} from 'antd'
import  AddFood from "./AddFood.js"
const { Meta } = Card
const {size} = Radio

function FoodItem (props) {
 var [foodInfo,setFoodInfo] = useState(props.food)
 var [isModify,setModify] = useState(false)
 var [foodprops,setprops] = useState({
     name:props.food.name,
     desc:props.food.desc,
     price:props.food.price,
     category:props.food.category,
     img:null,
     status:"on"
 })

 function change (e) {
  setprops({
         ...foodprops,
         [e.target.name]:e.target.value
     }
     )
 }

 function getImg (e) {
 
  setprops({
    ...foodprops,
    img: e.target.files[0]
 }
)
 }
function setOffline () {
  api.put("/restaurant/:rid/food/"+foodInfo.id,{
    ...foodprops,
    status:"off",
  }).then((res => {
    setFoodInfo(res.data)
    
  }))
}
function setOnline () {
  api.put("/restaurant/:rid/food/"+foodInfo.id,{
    ...foodprops,
    status:"on",
  }).then((res => {
    setFoodInfo(res.data)
    
  }))
}
 

 function save (e) {
    e.preventDefault()

    var fd = new FormData()
    for(var key in foodprops) {
      var val = foodprops[key]
      console.log(key,val)
      fd.append(key,val)
    }

     api.put(`/restaurant/${props.food.rid}/food/` + foodInfo.id,fd).then((foodinfo) => {
        setModify(false)
        setFoodInfo(foodinfo.data)
        
     })
     
 }
    return (       
         <div>
          {!isModify?
          <Card
            style={{ width: 300 ,margin:40}}
            cover={
              <img
                alt={ foodInfo.name }
                src={ "../upload/"+foodInfo.img }
              />
            } 
                  
            actions={[
              foodInfo.status === 'on' ? 
              
              <button onClick = { setOffline }>
                <Icon type="setting" key="setting"/>
                下架
              </button>
              :
              <button onClick = { setOnline }>
                <Icon type="setting" key="setting"/>
                上架
              </button>
              ,
              <button onClick={ ()=> {setModify(true)}}>
                 <Icon type="edit" key="edit" />
                 修改
              </button>,
              <button onClick = { () => { props.onDelete( foodInfo.id)} }>
                 <Icon type="delete" key="delete" />
                 删除
              </button>
              
            ]}
          >
            <Meta   
              title={ foodInfo.name }
            />

            <ul>
            <li>
             描述:{ foodInfo.desc }
            </li>
            <li>
             价格:{ foodInfo.price }
            </li>
            <li>
             分类:{ foodInfo.category }
            </li>
            </ul>
          </Card> :
          <div>
              <form style={{ width:300,margin:20}}>
                  菜名：<input 
                  style={{ width:300}} type="text" defaultValue={foodInfo.name} 
                  onChange={change} name="name"/><br/>
                  描述：<input 
                  style={{ width:300}} type="text" defaultValue={foodInfo.desc} 
                  onChange={change}
                  name="desc"/><br/>
                  价格：<input 
                  style={{ width:300}} type="text" defaultValue={foodInfo.price} 
                  onChange={change} name="price"/><br/>
                  分类：<input 
                  style={{ width:300}} type="text" defaultValue={foodInfo.category} 
                  onChange={change} name="category"/><br/>
                  图片：<input type="file" onChange = { getImg }
                   name="img"/><br/>
                  <Button type="primary"  size={size} onClick={ save }>完成并保存</Button>
              </form>
          </div>
          }
        </div>
    )
}



function FoodManagae (props) {
   var [foods,setfoods] = useState([])
   var rid = props.match.params.rid

   useEffect(() => {
       api.get(`/restaurant/${rid}/food`).then(res => {
        setfoods(res.data)
       })

   },[])

   function renderAgain () {
      api.get(`/restaurant/${rid}/food`).then(res => {
      setfoods(res.data)
     })
   }
   
  function onDelete (id) {
    api.delete(`/restaurant/${rid}/food`+id).then(() => {
      api.get(`/restaurant/${rid}/food`).then(res => {
        setfoods(res.data)
       })
    })
  }
  
  
   
   return (
       <div>
           <div>
               {
                 foods.map(food => {
                    return <FoodItem food={food} key={food.id} onDelete ={ onDelete } 
                    ></FoodItem>
                 })
               }
           </div>
           <AddFood foods={ foods } renderAgain={ renderAgain }/>
       </div>
   )
}

export default FoodManagae