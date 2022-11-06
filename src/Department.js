import React,{Component} from 'react';
import {Table} from 'react-bootstrap';

//to show or hide the modal pop-up window
import {Button,ButtonToolbar} from 'react-bootstrap';
import { AddDepModal } from './AddDepModal';
import { EditDepModal } from './EditDepModal';


export class Department extends Component{
    //We need to write super(props). So, that the Component's Constructor may get called.
    constructor(props){
        super(props); 
        // We can define our variables inside the state of this component. We are creating a variable to store department table data.
        this.state={deps:[], addModalShow:false, editModalShow:false}
    }
    // Function to refresh department's array. We are writing fetch method to get data from the department API.
    refreshList(){
        fetch(process.env.REACT_APP_API+'department'+'/Getdate')
        .then(response=>response.json())
        // Once the data is available we update the department's array using set state method
        .then(data=>{
            this.setState({deps:data});
        });
    }
    // We need to call the refresh method on a lifecycle method called as componentDidMount
    componentDidMount(){
        this.refreshList();
    }
      
    // We will also call the refresh method on a lifecycle method called as componentDidUpdate
    componentDidUpdate(){
        this.refreshList();
    }

    deleteDep(depid){
        if(window.confirm('Are you sure?')){
            fetch(process.env.REACT_APP_API+'department/'+depid,{
                method:'DELETE',
                header:{'Accept':'application/json',
            'Content-Type':'application/json'
            }
            })
        }
    }


    render(){
        const {deps, depid, depname}=this.state;
        let addModalClose=()=>this.setState({addModalShow:false});
        let editModalClose=()=>this.setState({editModalShow:false});
        return(
            <div>
               <Table className='mt-4' striped bordered hover size="sm">
               <thead>
                <tr>
               <th>DepartmentId</th>
               <th>DepartmentName</th>
               <th>
                
               </th>
               </tr>
               </thead>
               <tbody>
                {deps.map(dep=>
                    <tr key={dep.DepartmentId}>
                        <td>{dep.DepartmentId}</td>
                        <td>{dep.DepartmentName}</td>
                        <td>
                            <ButtonToolbar>
                                <Button className="mr-2" variant="info"
                                onClick={()=>this.setState({editModalShow:true,depid:dep.DepartmentId,depname:dep.DepartmentName})}>
                                    Edit
                                </Button>
                                <Button className="mr-2" variant="danger"
                                onClick={()=>this.deleteDep(dep.DepartmentId)}>
                                    Delete
                                </Button>

                                <EditDepModal show={this.state.editModalShow}
                                onHide={editModalClose}
                                depid={depid}
                                depname={depname}/>
                            </ButtonToolbar>
                        </td>
                    </tr>
                    )}
               </tbody>
               </Table>
               <ButtonToolbar>
                <Button variant='primary'
                onClick={()=>this.setState({addModalShow:true})}>Add Department</Button>

                <AddDepModal show={this.state.addModalShow}
                onHide={addModalClose}/>
               </ButtonToolbar>
            </div>
        )
    }
}
