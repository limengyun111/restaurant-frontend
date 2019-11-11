import React, { Suspense, useState } from 'react';
import {withRouter} from "react-router-dom";
import api from "./api";
import createfetcher from "./create-fetcher";
import { Card,Modal, Button} from 'antd';

function DeskItem(props) {

	
	var did = props.desk.id

	return (
		<div>
			<Card style={{ width: 300,margin:40}}>
				<p>桌名：{ props.desk.name}</p>
				<p>容纳人数：{ props.desk.capacity }</p>
				<Button size="small" 
				onClick={ ()=> props.deleteDesk(did) }>删除</Button>
     </Card>
		</div>
	)
}
// 增加桌子
class AddDesk extends React.Component {
	constructor(props) {
		super(props)
		this.state={
			visible: false,
			deskName:"",
			capacity:"",
		}
	}

  
	showModal = () => {
	  this.setState({
		visible: true,
	  });
	};
  
	handleOk = e => {
		
		e.persist()
	
	  this.setState({
		visible: false,
		})
		var newDesk = {
			name:this.state.deskName,
			capacity:this.state.capacity,
		}
		
			api.post (`/restaurant/1/desk/`,newDesk).then(() =>{
        window.location.reload()
			})
		
		
	};
  
	handleCancel = e => {
	
	  this.setState({
		visible: false,
		})
		
	};
	
  
	render() {
	  return (
		<div>
		  <Button type="primary" onClick={this.showModal} style={{marginLeft:40}}>
			增加桌子
		  </Button>
		  <Modal
			title="增加桌子"
			visible={this.state.visible}
			onOk={this.handleOk}
			onCancel={this.handleCancel}
		
		  >
		
				桌子名称：<input type="text" value={this.state.deskName} onChange={ (e)=>{ this.setState({deskName:e.target.value}) }} 
			/><br/><br/>
				容纳人数：<input type="text" value={this.state.capacity} onChange={ (e)=>{ this.setState({capacity:e.target.value}) } }
				/>
		
		  </Modal>
		</div>
	  );
	}
}
  


function DeskManage (props){
		var [desks,setDesk] = useState({})
		var [name,setName] = useState()
		var [num,setNum] = useState()
		var rid = props.match.params.rid
    
		var fetcher = createfetcher((rid)=>{
			return api.get(`/restaurant/${rid}/desk`)
		})
		// var newDesk = {
		// 	name:name,
		// 	capacity:num,
		// }
	// useEffect(()=> {
	// 	awai api.get(`/restaurant/${rid}/desk`).then(res => {
	// 		setDesk(res.data)
	// 	})
	// },[newDesk])
	// async ()=>{
	// 	await api.get(`/restaurant/${rid}/desk`).then(res => {
	// 		setDesk(res.data)
	// 	})
	// }

		// useEffect(() =>{
		// 	api.post (`/restaurant/${rid}/desk/`,newDesk).then(()=>{
		// 		api.get(`/restaurant/${rid}/desk`).then(res => {
		// 			setDesk(res.data)
		// 		})
		// 	})
		
		// },[newDesk])



	function deleteDesk(did) {
			api.delete(`/restaurant/${rid}/desk/${did}`).then(()=> {
				api.get(`/restaurant/${rid}/desk/`).then((res)=>{
					setDesk(res.data)
				})
			})
		
		}


  function DeskInfo({rid}) {
		var desks = fetcher.read(rid).data
	
			 return (
				<div>
					{
					desks.map( desk => {
						return <DeskItem key={ desk.id } 
						deleteDesk={deleteDesk} desk={desk}
						/>
					})
				}
				</div>
			 )
	 }
	
	
	
	 function changeNum(e) {
		 setNum(e.target.value)
	 }
	 function changeName(e) {
	  setName(e.target.value)
	 }
 


   return (
		<div>
			<Suspense fallback={<div>loading...</div>}>
			  <DeskInfo rid={rid} />
				</Suspense>
				<AddDesk  changeNum={ changeNum } changeName={ changeName }/>
			
		
		<div>
			
		</div>
		</div>
  )
	 }




export default withRouter(DeskManage)