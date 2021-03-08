import {useState} from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export interface FormStage {
    [key: string]: any;
    values: [];
    submitSuccess: boolean;
    loading: boolean;
}

const fields= [
    {
        name: "firstName",
        type:"text",
        label:"First Name",
        placeholder: "Enter first name"
    },
    {
        name: "lastName",
        type:"text",
        label:"Last Name",
        placeholder: "Enter last name"
    },
    {
        name: "npiNumber",
        type:"text",
        label:"NPI Number",
        placeholder: "Enter NPI number"
    },
    {
        name: "address",
        type:"text",
        label:"Address",
        placeholder: "Enter address"
    },
    {
        name: "phone",
        type:"text",
        label:"Phone",
        placeholder: "Enter phone number"
    },
    {
        name: "email",
        type:"email",
        label:"Email",
        placeholder:"Enter email address"
    },
]

const Create =()=> {
    const [values, setValues] = useState<any>([]);
    const [registrationObj, setRegistrationObj] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false)
    const [submitSuccess, setsubmitSuccess] = useState<boolean>(false);
    const history = useHistory();
    
    const processFormSubmission = (e: React.FormEvent<HTMLFormElement>): void => {
        setLoading(true);
        setsubmitSuccess(true);
        setValues([...values, {...registrationObj, id:values.length}]);

        axios.post(`http://localhost:3000/customers`, {...registrationObj, id:values.length}).then(data => [
            setTimeout(() => {
                setLoading(false);
              history.push('/');
            }, 500)
        ]);
    }

    const handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
        let reg ={...registrationObj}
        reg[e.currentTarget.name] = e.currentTarget.value  
        setRegistrationObj(reg)
    }

    
    return (
        <div>
            <div className="form-group col-md-4">
                    <button className="btn btn-success" type="submit" onClick={()=>history.push('/')}>Go Back</button>
            </div>
            <div className={"col-md-12 form-wrapper"}>
                <h2> New User </h2>
                {!submitSuccess && (
                    <div className="alert alert-info" role="alert">
                        Fill the form below to Register
                </div>
                )}
                {submitSuccess && (
                    <div className="alert alert-info" role="alert">
                         Successfully Registered!
                        </div>
                )}
                <div>
                  {fields.map((item)=>{
                        return(
                        <div key={`${item.name} ${item.type}`} className="form-group col-md-12">
                            <label htmlFor={item.name}> {item.label}</label>
                            <input type={item.type} id={item.name} onChange={(e) => handleInputChanges(e)} name={item.name} className="form-control" placeholder={item.placeholder} />
                        </div>
                        )
                    })}

                    <div className="form-group col-md-4">
                        <button className="btn btn-success" type="submit" onClick={(e:any)=>processFormSubmission(e)} >
                            Save Changes
                        </button>
                        {loading &&
                            <span className="fa fa-circle-o-notch fa-spin" />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Create;