import React,{Component} from 'react';
import {Table} from 'react-bootstrap';

//to show or hide the modal pop-up window
import {Button,ButtonToolbar} from 'react-bootstrap';
import { AddEmpModal } from './AddEmpModal';
import { EditEmpModal } from './EditEmpModal';


export class Employee extends Component{
    //We need to write super(props). So, that the Component's Constructor may get called.
    constructor(props){
        super(props); 
        // We can define our variables inside the state of this component. We are creating a variable to store department table data.
        this.state={emps:[], addModalShow:false, editModalShow:false}
    }
    // Function to refresh department's array. We are writing fetch method to get data from the department API.
    refreshList(){
        fetch(process.env.REACT_APP_API+'employee'+'/Get')
        .then(response=>response.json())
        // Once the data is available we update the department's array using set state method
        .then(data=>{
            this.setState({emps:data});
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

    deleteEmp(empid){
        if(window.confirm('Are you sure?')){
            fetch(process.env.REACT_APP_API+'employee/'+empid,{
                method:'DELETE',
                header:{'Accept':'application/json',
            'Content-Type':'application/json'
            }
            })
        }
    }


    render(){
        const {emps, empid, empname, depmt, photofilename, doj}=this.state;
        let addModalClose=()=>this.setState({addModalShow:false});
        let editModalClose=()=>this.setState({editModalShow:false});
        return(
            <div>
               <Table className='mt-4' striped bordered hover size="sm">
               <thead>
                <tr>
               <th>EmployeeId</th>
               <th>EmployeeName</th>
               <th>Department</th>
               <th>DOJ</th>
               <th>Options</th>
               </tr>
               </thead>
               <tbody>
                {emps.map(emp=>
                    <tr key={emp.EmployeeId}>
                        <td>{emp.EmployeeId}</td>
                        <td>{emp.EmployeeName}</td>
                        <td>{emp.Department}</td>
                        <td>{emp.DateOfJoining}</td>
                        <td>
                            <ButtonToolbar>
                                <Button className="mr-2" variant="info"
                                onClick={()=>this.setState({editModalShow:true,empid:emp.EmployeeId,empname:emp.EmployeeName, depmt:emp.Department,photofilename:emp.PhotoFileName,doj:emp.DateOfJoining})}>
                                    Edit
                                </Button>
                                <Button className="mr-2" variant="danger"
                                onClick={()=>this.deleteEmp(emp.EmployeeId)}>
                                    Delete
                                </Button>

                                <EditEmpModal show={this.state.editModalShow}
                                onHide={editModalClose}
                                empid={empid}
                                empname={empname}
                                depmt={depmt}
                                photofilename={photofilename}
                                doj={doj}
                                />
                            </ButtonToolbar>
                        </td>
                    </tr>
                    )}
               </tbody>
               </Table>
               <ButtonToolbar>
                <Button variant='primary'
                onClick={()=>this.setState({addModalShow:true})}>Add Employee</Button>

                <AddEmpModal show={this.state.addModalShow}
                onHide={addModalClose}/>
               </ButtonToolbar>
            </div>
        )
    }
}
