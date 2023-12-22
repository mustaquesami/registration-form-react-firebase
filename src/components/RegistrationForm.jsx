import Container from './layouts/Container'
import Flex from './layouts/Flex'
import React, { useState, useEffect } from 'react'
import Img from './layouts/Img'
import doctor from '../assets/doctor.png'
import Input from './layouts/Input'
import { getDatabase, push, ref, set, onValue, remove } from "firebase/database";

const RegistrationForm = () => {
  const [name,setName] = useState("");
  const [date,setDate] = useState("");
  const [gender,setGender] = useState("");
  const [phone,setPhone] = useState("");
  const [email,setEmail] = useState("");
  const [address,setAddress] = useState("");
  const [errMsg,setErrMsg] = useState(false);
  const [patients, setPatients] = useState([]);

  const handleSubmit = (e) =>{
    e.preventDefault()
    if(name==""||date==""||gender==""||phone==""||email==""||address==""){
      setErrMsg(true);
    }else{
          setErrMsg(false);
            const db = getDatabase();
            const patientRef = ref(db,'patients');
            const newPatientRef = push(patientRef);
            set(newPatientRef, {
              name: name,
              date: date,
              gender : gender,
              phone: phone,
              email: email,
              address: address
            }).then(()=>{
              setName("");
              setDate("");
              setGender("");
              setPhone("");
              setEmail("");
              setAddress("");
              console.log("data send");
            })
          
    }
  }
  useEffect(() => {
    const db = getDatabase();
    const patientsRef = ref(db, 'patients');
  
    // Listen for changes in the data
    onValue(patientsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the data object to an array
        const patientsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        // Update the state with the new data
        setPatients(patientsArray);
      } else {
        // If there's no data, set the state to an empty array
        setPatients([]);
      }
    });
  }, []); // Run this effect only once when the component mounts
  
  const handleDelete = (id) => {
    const db = getDatabase();
    const patientRef = ref(db, `patients/${id}`);

    remove(patientRef)
    .then(() => {
        console.log("delete successfully");
      })
      .catch((error) => {
        console.error('Error deleting data:', error);
      });
  };
  
  return (
    <Container>
        <Flex className='items-center justify-between border border-spacing-2 rounded mt-2 mx-2 sm:mx-2 md:mx-2'>
            <div className='ml-2'>
              <h2 className='text-xl font-bold md:text-4xl'>New Patient Enrollment</h2>
              <p className='text-base md:text-xl'>Dr. Xander M. Spencer</p>
            </div>
            <Img src={doctor} imgClassName='w-full'/>
        </Flex>
        <Flex className='flex-col mx-2 sm:mx-2 md:mx-2 lg:flex-row lg:justify-between lg:gap-2'>
            <div className='lg:basis-1/2'>
              <form className='flex flex-col'>
                  <Input type='text' onChange={(e)=>{setName(e.target.value)}} name='name' placeholder='Name' value={name}/>
                  <Input type='date' onChange={(e)=>{setDate(e.target.value)}} name='date' placeholder='Date' value={date}/>
                  <select name='gender' onChange={(e)=>{setGender(e.target.value)}} value={gender} className='mt-2 h-12 rounded'>
                    <option value='' disabled>Please Select</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                  </select>
                  <Input type='text' onChange={(e)=>{setPhone(e.target.value)}} name='phone' placeholder='Phone' value={phone}/>
                  <Input type='email' onChange={(e)=>{setEmail(e.target.value)}} name='email' placeholder='Email' value={email}/>
                  <textarea onChange={(e)=>{setAddress(e.target.value)}} placeholder='Address' className='mt-2 border border-spacing-2 rounded h-20' name='address' value={address}>
                  </textarea>
                  {errMsg && <span className='text-5 font-bold text-red-600'>All fields are required</span>}
                  <button onClick={handleSubmit} className='text-left px-5 py-3 bg-blue-600 mt-2 w-24 rounded text-white'>Submit</button>
              </form>
            </div>
            <div className='lg:basis-1/2 border border-spacing-2 rounded mt-2'>
                  <table className="table-auto">
                    <thead>
                      <tr>
                        <th className='border px-4 py-2'>Name</th>
                        <th className='border px-4 py-2'>Date of Birth</th>
                        <th className='border px-4 py-2'>Gender</th>
                        <th className='border px-4 py-2'>Phone</th>
                        <th className='border px-4 py-2'>Email</th>
                        <th className='border px-4 py-2'>Address</th>
                        <th className='border px-4 py-2'>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.id}>
                          <td className='border px-4 py-2'>{patient.name}</td>
                          <td className='border px-4 py-2'>{patient.date}</td>
                          <td className='border px-4 py-2'>{patient.gender}</td>
                          <td className='border px-4 py-2'>{patient.phone}</td>
                          <td className='border px-4 py-2'>{patient.email}</td>
                          <td className='border px-4 py-2'>{patient.address}</td>
                          <td className='border px-4 py-2'><button onClick={() => handleDelete(patient.id)} className='bg-red-500 text-white rounded p-1'>Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
            </div>
        </Flex>
    </Container>
  )
}

export default RegistrationForm