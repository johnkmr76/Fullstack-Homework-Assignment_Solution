import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { Edit, Delete } from "../images";

const columns = [
  "First Name",
  "Last Name",
  "NPI Number",
  "Business Address",
  "Telephone Number",
  "Email",
  "Actions"
];

interface Customer {
    id:number,
    firstName: string,
    lastName: string;
    npiNumber: number;
    address: string;
    phone: number;
    email: string;
}

const Home = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const history = useHistory();

  useEffect(() => {
    axios.get(`http://localhost:3000/customers`).then((response) => {
      setCustomers(response.data);
    });
  }, []);

  const deleteCustomer = (id: any) => {
    axios.delete(`http://localhost:3000/customers/${id}`).then((data) => {
      const index = customers.findIndex((customer) => customer.id === id);
      let cust = [...customers];
      cust.splice(index, 1)
      setCustomers(cust);
      history.push("/");
    });
  };

  return (
    <div>
      <h1> User Management System </h1>
      <div className="container">
        <br />
        <button
          className="btn btn-success"
          onClick={() => {
            history.push("/create");
          }}
        >
          + Add User
        </button>
        <div className="row">
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                {columns.map((item) => (
                  <th key={`${item} col`} scope="col">
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers &&
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.firstName}</td>
                    <td>{customer.lastName}</td>
                    <td>{customer.npiNumber}</td>
                    <td>{customer.address}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.email}</td>
                    <td>
                      <div className="d-flex justify-content-between align-items-center">
                        <Link
                          to={`edit/${customer.id}`}
                          className="btn btn-sm btn-outline-secondary"
                        >
                          <img height={20} width={20} src={Edit} alt="Edit" />{" "}
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => deleteCustomer(customer.id)}
                        >
                          <img
                            height={20}
                            width={20}
                            src={Delete}
                            alt="Delete"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {customers.length === 0 && (
          <div style={{ marginTop: 50, marginRight: 0, width: "100%" }}>
            {customers.length === 0 && (
              <div className="text-center" style={{ marginBottom: 40 }}>
                <h2 style={{ opacity: 0.6 }}>No Records Found ...</h2>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;