import React,{Component} from 'react';
import {Modal,Button, Row, Col, Form, Image} from 'react-bootstrap';

export class EditEmpModal extends Component{
    constructor(props){
        super(props);
        //we need to declare departments array to show values in dropdown
        this.state={deps:[]};
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleFileSelected=this.handleFileSelected.bind(this);
    }
//We may need some variables to store profile picture details and photo paths.
photofilename = "anonymous.png";
imagesrc = process.env.REACT_APP_PHOTO+this.photofilename;

//lets populate the dropdown array value in componentDidMount lifecycle method.
componentDidMount(){
    fetch(process.env.REACT_APP_API+'department'+'/Getdate')
    .then(response=>response.json())
    .then(data=>{
        this.setState({deps:data});
    });
}

 // lets define the handle submit method to save the department name using api. the body will have department name in JSON format. Once saved we will display the message in alert box
    handleSubmit(event){
        event.preventDefault();
        fetch(process.env.REACT_APP_API+'employee',{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                // DepartmentId:null,
                EmployeeId:event.target.EmployeeId.value,
                EmployeeName:event.target.EmployeeName.value,
                Department:event.target.Department.value,
                DateOfJoining:event.target.DateOfJoining.value,
                PhotoFileName:this.photofilename
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
        },
        (error)=>{
            alert('Failed');
        })
    }


    //lets add a method to save the uploaded photo
    handleFileSelected(event){
        event.preventDefault();
        this.photofilename=event.target.files[0].name;
        const formData = new FormData();
        formData.append(
            "myFile",
            event.target.files[0],
            event.target.files[0].name
        )

        //then send this photo to the save file api method 
        fetch(process.env.REACT_APP_API+'Employee/SaveFile',{
            method:'POST',
            body:formData
        })
        .then(res=>res.json())
        //once successful we update the image source
        .then((result)=>{
            this.imagesrc=process.env.REACT_APP_PHOTO+result;
        },
        (error)=>{
            alert('Failed');
        
        })

    }
    
    render(){
        return(
            <div className="container">
            
            <Modal
            {...this.props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Employee
                    </Modal.Title>
                </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col sm={6}>
                        <Form onSubmit={this.handleSubmit}>

                        <Form.Group controlId="EmployeeId">
                            <Form.Label>EmployeeId</Form.Label>
                        <Form.Control type="text" name="EmployeeId" required placeholder="EmployeeId" disabled defaultValue={this.props.empid}/>
                        </Form.Group> 

                        <Form.Group controlId="EmployeeName">
                            <Form.Label>EmployeeName</Form.Label>
                        <Form.Control type="text" name="EmployeeName" required placeholder="EmployeeName" defaultValue={this.props.empname}/>
                        </Form.Group> 
                         {/* The department field will be a drop down*/}
                        <Form.Group controlId="Department">
                            <Form.Label>Department</Form.Label>
                        <Form.Control as = "select" defaultValue={this.props.depmt}>
                        {this.state.deps.map(dep=>
                            <option key={dep.DepartmentId}>{dep.DepartmentName}</option>
                            )}
                        </Form.Control>
                        </Form.Group>
                        

                        <Form.Group controlId="DateOfJoining">
                        {/* The dateofjoining will be a datepicker*/}
                        <Form.Label>DateOfJoining</Form.Label>
                       <Form.Control type="date" name="DateOfJoining" required placeholder="DateOfJoining" defaultValue={this.props.doj}/>
                        </Form.Group>          

                        <Form.Group>
                            <Button variant="primary" type="submit">
                                Update Employee
                            </Button>
                        </Form.Group>
                        </Form>
                    </Col>

                    {/* To Display Uploaded Profile Picture */}

                    <Col sm={6}>
                        <Image width="200px" height="200px" src={process.env.REACT_APP_PHOTO+this.props.photofilename}/>
                        <input onChange={this.handleFileSelected} type="File"/>
                    </Col>


                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={this.props.onHide}>Close</Button>
            </Modal.Footer>

            </Modal>

            </div>
        )
    }
}